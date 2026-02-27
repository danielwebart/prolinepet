import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

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

export async function GET(_: Request, { params }: { params: { doc: string } }) {
  try {
    await ensureUserDocColumn();
    const raw = params.doc ?? '';
    const doc = normalizeDoc(raw);
    if (!doc) return NextResponse.json({ error: 'doc inválido' }, { status: 400 });
    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT id, name, email, doc, "salesRepAdmin", "createdAt", "updatedAt" FROM "User" WHERE doc='${doc}' LIMIT 1`
    );
    const user = rows[0] ?? null;
    if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { doc: string } }) {
  try {
    await ensureUserDocColumn();
    const raw = params.doc ?? '';
    const doc = normalizeDoc(raw);
    if (!doc) return NextResponse.json({ error: 'doc inválido' }, { status: 400 });
    const body = await request.json().catch(() => ({} as any));
    const fields: any = {};
    if (body.name !== undefined) fields.name = String(body.name);
    if (body.email !== undefined) fields.email = String(body.email);
    if (body.doc !== undefined) fields.doc = normalizeDoc(String(body.doc || '')) || null;
    if (body.salesRepAdmin !== undefined) fields.salesRepAdmin = Boolean(body.salesRepAdmin);

    // Check email uniqueness if email is being updated
    if (fields.email !== undefined && fields.email !== null && fields.email !== '') {
      const emailCheck: any[] = await prisma.$queryRawUnsafe(`SELECT id, doc FROM "User" WHERE email='${String(fields.email).replace(/'/g,"''")}' LIMIT 1`);
      if (emailCheck.length > 0) {
        const found = emailCheck[0];
        // If found doc is different from current doc, it's a duplicate
        if (found.doc !== doc) {
          fields.email = null;
        }
      }
    }

    const keys = Object.keys(fields);
    if (keys.length === 0) return NextResponse.json({ message: 'Nada para atualizar' });
    const esc = (v: any) => v === null || v === undefined ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`;
    const assignments = keys.map((k) => `"${k}"=${esc(fields[k])}`).join(', ');
    const sql = `UPDATE "User" SET ${assignments}, "updatedAt"=CURRENT_TIMESTAMP WHERE doc='${doc}'`;
    const count = await prisma.$executeRawUnsafe(sql);
    if (!count) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, doc, "salesRepAdmin", "createdAt", "updatedAt" FROM "User" WHERE doc='${fields.doc ?? doc}' LIMIT 1`);
    return NextResponse.json(rows[0] ?? { ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
