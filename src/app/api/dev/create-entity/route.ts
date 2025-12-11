import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// POST: { cnpj: string, name: string }
// Cria a entidade (idempotente) e vincula:
// - Todos os módulos ativos à entidade (EntityModule)
// - Todos os programas ativos de cada módulo como permitidos (EntityModuleProgram.allowed=true)
// - Todos os usuários à entidade, definindo lastEntityId
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const cnpj = String((body as any)?.cnpj || '').trim();
    const name = String((body as any)?.name || '').trim();
    if (!cnpj || !name) {
      return NextResponse.json({ ok: false, error: 'CNPJ e Nome obrigatórios' }, { status: 400 });
    }

    // 1) Criar/atualizar entidade via Prisma (evita problemas de case em Postgres)
    const entity = await prisma.entity.upsert({
      where: { cnpj },
      update: { name, isActive: true },
      create: { cnpj, name, isActive: true },
      select: { id: true }
    });
    const entityId = entity.id;

    // 2) Vincular módulos ativos à entidade
    const modules = await prisma.module.findMany({ where: { isActive: true }, select: { id: true } });
    let entityModuleLinked = 0;
    for (const m of modules) {
      const em = await prisma.entityModule.upsert({
        where: { entityId_moduleId: { entityId, moduleId: m.id } },
        update: {},
        create: { entityId, moduleId: m.id },
        select: { id: true }
      });
      entityModuleLinked++;
      // 3) Vincular programas ativos como permitidos
      const programs = await prisma.program.findMany({ where: { moduleId: m.id, isActive: true }, select: { id: true } });
      for (const p of programs) {
        await prisma.entityModuleProgram.upsert({
          where: { entityModuleId_programId: { entityModuleId: em.id, programId: p.id } },
          update: { allowed: true },
          create: { entityModuleId: em.id, programId: p.id, allowed: true }
        });
      }
    }

    // 4) Vincular todos os usuários à entidade e definir lastEntityId
    const users = await prisma.user.findMany({ select: { id: true } });
    let userLinked = 0;
    for (const u of users) {
      await prisma.userEntity.upsert({
        where: { userId_entityId: { userId: u.id, entityId } },
        update: {},
        create: { userId: u.id, entityId }
      });
      // Atualiza coluna com Prisma (case correto)
      // Atualiza diretamente por SQL para evitar problemas de tipos gerados
      await prisma.$executeRawUnsafe(`UPDATE "User" SET "lastEntityId"=${entityId} WHERE "id"=${u.id}`);
      userLinked++;
    }

    return NextResponse.json({ ok: true, entityId, created: true, entityModuleLinked, userLinked });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}