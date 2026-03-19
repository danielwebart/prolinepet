import { NextResponse } from 'next/server';
// Rebuild trigger: Fix webpack runtime error
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

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
    `SELECT id, name, email, doc, "salesRepAdmin", "isSalesAdmin", "twoFactorRequired", "erpIntegrationMode", "createdAt", "updatedAt", ("twoFactorSecret" IS NOT NULL) as "hasTwoFactorSecret" FROM "User" ${whereSql} ORDER BY name ASC`
  );
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  await ensureUserDocColumn();
  const data = await request.json();
  const { name, email, password, erpIntegrationMode } = data || {};
  const doc = normalizeDoc(String((data as any)?.doc || '')) || null;
  const hashed = await bcrypt.hash(password, 10);

  // Check for duplicate email across other users
  let finalEmail = email;
  if (email) {
    const emailCheck: any[] = await prisma.$queryRawUnsafe(`SELECT id, doc FROM "User" WHERE email='${String(email).replace(/'/g,"''")}' LIMIT 1`);
    if (emailCheck.length > 0) {
      // If email exists, check if it belongs to a different user
      const found = emailCheck[0];
      // If we have a doc, compare with found doc. If found doc is different, it's a duplicate.
      // If we don't have a doc (creating new user without doc?), we can't easily compare, but usually POST with doc implies integration.
      // Logic: if doc is provided, and found.doc is different, then duplicate.
      // If doc is provided, and found.doc is SAME, then it's the same user (update), so email is fine.
      
      const isSameUser = doc && found.doc === doc;
      if (!isSameUser) {
        finalEmail = null; // Email already in use by another user -> set to null
      }
    }
  }

  if (doc) {
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id FROM "User" WHERE doc='${doc}' LIMIT 1`);
    const exists = rows[0]?.id as number | undefined;
    if (exists) {
      const emailSql = finalEmail ? `'${String(finalEmail).replace(/'/g,"''")}'` : 'NULL';
      await prisma.$executeRawUnsafe(`UPDATE "User" SET name='${String(name).replace(/'/g,"''")}', email=${emailSql}, password='${String(hashed).replace(/'/g,"''")}', "erpIntegrationMode"='${String(erpIntegrationMode || 'TEST').replace(/'/g,"''")}', "updatedAt"=CURRENT_TIMESTAMP WHERE doc='${doc}'`);
      const updated: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, doc, "salesRepAdmin", "isSalesAdmin", "erpIntegrationMode", "createdAt", "updatedAt" FROM "User" WHERE doc='${doc}' LIMIT 1`);
      return NextResponse.json(updated[0]);
    }
    const emailVal = finalEmail ? `'${String(finalEmail).replace(/'/g,"''")}'` : 'NULL';
    await prisma.$executeRawUnsafe(`INSERT INTO "User"(name,email,password,doc,"createdAt","updatedAt","salesRepAdmin","isSalesAdmin","erpIntegrationMode") VALUES ('${String(name).replace(/'/g,"''")}',${emailVal},'${String(hashed).replace(/'/g,"''")}','${doc}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, false, '${String(erpIntegrationMode || 'TEST').replace(/'/g,"''")}')`);
    const created: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, doc, "salesRepAdmin", "isSalesAdmin", "erpIntegrationMode", "createdAt", "updatedAt" FROM "User" WHERE doc='${doc}' LIMIT 1`);
    return NextResponse.json(created[0]);
  }
  // Fallback for non-doc creation (should use finalEmail too)
  // Check if email exists (since no doc to compare, any existing email is a conflict)
  if (email && !finalEmail) {
     // logic already handled above: if email exists, finalEmail became null unless it was same user.
     // But here we don't have doc. So if email exists, it must be another user?
     // Wait, if I create a user without doc, and email exists, it's definitely a duplicate.
  }
  
  const created = await prisma.user.create({ 
    data: { name, email: finalEmail, password: hashed, erpIntegrationMode: erpIntegrationMode || 'TEST' }, 
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true, salesRepAdmin: true, isSalesAdmin: true, erpIntegrationMode: true } 
  });
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
