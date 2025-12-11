import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Dev utility: garante módulo SALES e programa SALES_REPRESENTATIVE,
// vinculando-os a todas as entidades e a todos os usuários (ACL completa).
// Idempotente: cria/atualiza somente quando necessário.
export async function POST() {
  try {
    // 1) Garantir módulo SALES
    const sales = await prisma.module.upsert({
      where: { code: 'SALES' },
      update: { name: 'Vendas', description: 'Força de vendas', isActive: true },
      create: { code: 'SALES', name: 'Vendas', description: 'Força de vendas', isActive: true }
    });

    // 2) Garantir programa SALES_REPRESENTATIVE no módulo SALES
    const ensureProgram = async (code: string, name: string, moduleId: number) => {
      const existing = await prisma.program.findUnique({ where: { code } });
      if (!existing) return prisma.program.create({ data: { code, name, moduleId, isActive: true } });
      if (existing.moduleId !== moduleId) {
        return prisma.program.update({ where: { code }, data: { moduleId } });
      }
      return existing;
    };
    const repProg = await ensureProgram('SALES_REPRESENTATIVE', 'Representante', sales.id);

    // 3) Vincular módulo SALES a todas as entidades
    const entities = await prisma.entity.findMany();
    let entityModuleLinked = 0;
    for (const e of entities) {
      await prisma.entityModule.upsert({
        where: { entityId_moduleId: { entityId: e.id, moduleId: sales.id } },
        update: {},
        create: { entityId: e.id, moduleId: sales.id },
      });
      entityModuleLinked++;
    }

    // 4) Vincular programa Representante ao EntityModule (permitido por padrão)
    const salesEMs = await prisma.entityModule.findMany({ where: { moduleId: sales.id } });
    let entityModuleProgramsLinked = 0;
    for (const em of salesEMs) {
      await prisma.entityModuleProgram.upsert({
        where: { entityModuleId_programId: { entityModuleId: em.id, programId: repProg.id } },
        update: { allowed: true },
        create: { entityModuleId: em.id, programId: repProg.id, allowed: true },
      });
      entityModuleProgramsLinked++;
    }

    // 5) Vincular todos os usuários às entidades e permitir módulo/programa
    const users = await prisma.user.findMany();
    let userEntityLinked = 0;
    let userEntityModuleLinked = 0;
    let userProgramLinked = 0;
    for (const u of users) {
      for (const e of entities) {
        const ue = await prisma.userEntity.upsert({
          where: { userId_entityId: { userId: u.id, entityId: e.id } },
          update: {},
          create: { userId: u.id, entityId: e.id },
        });
        userEntityLinked++;
        const uem = await prisma.userEntityModule.upsert({
          where: { userEntityId_moduleId: { userEntityId: ue.id, moduleId: sales.id } },
          update: { allowed: true },
          create: { userEntityId: ue.id, moduleId: sales.id, allowed: true },
        });
        userEntityModuleLinked++;
        await prisma.userEntityModuleProgram.upsert({
          where: { userEntityModuleId_programId: { userEntityModuleId: uem.id, programId: repProg.id } },
          update: { allowed: true },
          create: { userEntityModuleId: uem.id, programId: repProg.id, allowed: true },
        });
        userProgramLinked++;
      }
    }

    return NextResponse.json({
      ok: true,
      module: { id: sales.id, code: sales.code },
      program: repProg.code,
      stats: {
        entities: entities.length,
        users: users.length,
        entityModuleLinked,
        entityModuleProgramsLinked,
        userEntityLinked,
        userEntityModuleLinked,
        userProgramLinked,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}