import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '../../../../lib/prisma';

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

// PATCH: Atualiza dados básicos do usuário
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await ensureUserDocColumn();
    const id = Number(params.id);
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    const body = await request.json().catch(() => ({} as any));
    const update: any = {};
    if (body.name !== undefined) update.name = String(body.name);
    if (body.email !== undefined) update.email = String(body.email);
    if (body.erpIntegrationMode !== undefined) update.erpIntegrationMode = String(body.erpIntegrationMode);
    if (body.password !== undefined && String(body.password).length > 0) {
      update.password = await bcrypt.hash(String(body.password), 10);
    }
    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...update,
        salesRepAdmin: body.salesRepAdmin !== undefined ? Boolean(body.salesRepAdmin) : undefined,
        twoFactorRequired: body.twoFactorRequired !== undefined ? Boolean(body.twoFactorRequired) : undefined,
      },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true, salesRepAdmin: true, twoFactorRequired: true, erpIntegrationMode: true }
    });
  if (body.doc !== undefined) {
    const doc = normalizeDoc(String(body.doc || '')) || null;
    await prisma.$executeRawUnsafe(`UPDATE "User" SET doc=${doc ? `'${doc}'` : 'NULL'} WHERE id=${id}`);
  }
  const finalRow: any[] = await prisma.$queryRawUnsafe(`SELECT id, name, email, doc, "salesRepAdmin", "twoFactorRequired", "erpIntegrationMode", "createdAt", "updatedAt" FROM "User" WHERE id=${id} LIMIT 1`);
    const final = finalRow[0] ?? updated;
    return NextResponse.json(final);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// DELETE: Remove usuário e todos os vínculos relacionados
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!id || Number.isNaN(id)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    // Limpar referências opcionais (ignorar se coluna inexistente)
    try { await prisma.$executeRawUnsafe(`UPDATE "User" SET lastEntityId=NULL WHERE id=${id}`); } catch {}

    // Remover vínculos do usuário com entidades, módulos e programas (ordem: UEMP -> UEM -> UE)
    await prisma.$executeRawUnsafe(`
      DELETE FROM "UserEntityModuleProgram"
      WHERE userEntityModuleId IN (
        SELECT id FROM "UserEntityModule" WHERE userEntityId IN (
          SELECT id FROM "UserEntity" WHERE userId=${id}
        )
      )
    `);
    await prisma.$executeRawUnsafe(`
      DELETE FROM "UserEntityModule"
      WHERE userEntityId IN (
        SELECT id FROM "UserEntity" WHERE userId=${id}
      )
    `);
    await prisma.$executeRawUnsafe(`DELETE FROM "UserEntity" WHERE userId=${id}`);

    // Por fim, remover o próprio usuário
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
