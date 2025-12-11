import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

function normalizeDoc(doc: string): string {
  return (doc || '').replace(/\D+/g, '');
}

async function ensureUserDocColumn() {
  try {
    const pgCols: any[] = await prisma.$queryRawUnsafe(
      `SELECT column_name FROM information_schema.columns WHERE table_name='User' AND column_name='doc'`
    );
    if (Array.isArray(pgCols) && pgCols.length > 0) return;
  } catch {}
  try {
    const sqliteCols: any[] = await prisma.$queryRawUnsafe('PRAGMA table_info("User")');
    const names = new Set((sqliteCols || []).map((c: any) => c.name));
    if (!names.has('doc')) {
      await prisma.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "doc" varchar(255)`);
    }
    try {
      await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_doc_key" ON "User"("doc")`);
    } catch {}
  } catch {}
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const salesRepAdmin = url.searchParams.get('salesRepAdmin');
  const onlyReps = !!(salesRepAdmin && ['1','true','yes'].includes(String(salesRepAdmin).toLowerCase()));
  await ensureUserDocColumn();
  const whereSql = onlyReps ? `WHERE ("salesRepAdmin"=TRUE OR "salesRepAdmin"=1)` : '';
  const rows: any[] = await prisma.$queryRawUnsafe(
    `SELECT id, name, email, doc, "salesRepAdmin", "createdAt", "updatedAt" FROM "User" ${whereSql} ORDER BY name ASC`
  );
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  await ensureUserDocColumn();
  const data = await request.json();
  const { name, email, password } = data || {};
  const doc = normalizeDoc(String((data as any)?.doc || '')) || null;
  const hashed = await bcrypt.hash(password, 10);
  if (doc) {
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id FROM "User" WHERE doc='${doc}' LIMIT 1`);
    const exists = rows[0]?.id as number | undefined;
    if (exists) {
      await prisma.$executeRawUnsafe(`UPDATE "User" SET name='${String(name).replace(/'/g,"''")}', email='${String(email).replace(/'/g,"''")}', password='${String(hashed).replace(/'/g,"''")}', "updatedAt"=CURRENT_TIMESTAMP WHERE doc='${doc}'`);
      const updated: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, doc, "salesRepAdmin", "createdAt", "updatedAt" FROM "User" WHERE doc='${doc}' LIMIT 1`);
      return NextResponse.json(updated[0]);
    }
    await prisma.$executeRawUnsafe(`INSERT INTO "User"(name,email,password,doc,"createdAt","updatedAt","salesRepAdmin") VALUES ('${String(name).replace(/'/g,"''")}','${String(email).replace(/'/g,"''")}','${String(hashed).replace(/'/g,"''")}','${doc}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false)`);
    const created: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, doc, "salesRepAdmin", "createdAt", "updatedAt" FROM "User" WHERE doc='${doc}' LIMIT 1`);
    return NextResponse.json(created[0]);
  }
  const created = await prisma.user.create({ data: { name, email, password: hashed }, select: { id: true, name: true, email: true, createdAt: true, updatedAt: true, salesRepAdmin: true } });
  return NextResponse.json(created);
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const ids: number[] = Array.isArray(body?.ids) ? (body.ids as any[]).map((x) => Number(x)).filter((n) => Number.isFinite(n) && n > 0) : [];
    if (!ids.length) return NextResponse.json({ error: 'IDs obrigatórios' }, { status: 400 });
    try { await prisma.$executeRawUnsafe(`UPDATE "User" SET "lastEntityId"=NULL WHERE id IN (${ids.join(',')})`); } catch {}
    await prisma.$executeRawUnsafe(`
      DELETE FROM "UserEntityModuleProgram"
      WHERE "userEntityModuleId" IN (
        SELECT id FROM "UserEntityModule" WHERE "userEntityId" IN (
          SELECT id FROM "UserEntity" WHERE "userId" IN (${ids.join(',')})
        )
      )
    `);
    await prisma.$executeRawUnsafe(`
      DELETE FROM "UserEntityModule"
      WHERE "userEntityId" IN (
        SELECT id FROM "UserEntity" WHERE "userId" IN (${ids.join(',')})
      )
    `);
    await prisma.$executeRawUnsafe(`DELETE FROM "UserEntity" WHERE "userId" IN (${ids.join(',')})`);
    const result = await prisma.user.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ deleted: result.count });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
