import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// PATCH: Ajusta FKs para ON DELETE CASCADE em Postgres
export async function PATCH() {
  try {
    // Verificar se constraint existe
    const check: any[] = await prisma.$queryRawUnsafe(`
      SELECT tc.constraint_name
      FROM information_schema.table_constraints tc
      WHERE tc.table_name='UserEntityModuleProgram' AND tc.constraint_type='FOREIGN KEY'
    `);

    // Remover e recriar a FK para cascata (idempotente)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "UserEntityModuleProgram" DROP CONSTRAINT IF EXISTS "UserEntityModuleProgram_userEntityModuleId_fkey"`);
    } catch {}
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "UserEntityModuleProgram"
      ADD CONSTRAINT "UserEntityModuleProgram_userEntityModuleId_fkey"
      FOREIGN KEY ("userEntityModuleId") REFERENCES "UserEntityModule"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
    `);

    return NextResponse.json({ ok: true, adjusted: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}