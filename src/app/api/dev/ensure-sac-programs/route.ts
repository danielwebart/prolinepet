import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Dev utility: garante o módulo SAC e cria/atualiza os programas
// "Manutenção de Reclamação", "Consulta Reclamação" e "Cadastro de Reclamação",
// vinculando-os às entidades existentes (EntityModule/EntityModuleProgram).
// Idempotente: cria somente quando necessário e corrige moduleId se estiver diferente.
export async function POST() {
  try {
    // 1) Garantir módulo SAC
    const sac = await prisma.module.upsert({
      where: { code: 'SAC' },
      update: { name: 'SAC', description: 'Serviço de Atendimento ao Cliente', isActive: true },
      create: { code: 'SAC', name: 'SAC', description: 'Serviço de Atendimento ao Cliente', isActive: true },
    });

    // 2) Garantir programas do SAC
    const ensureProgram = async (code: string, name: string, moduleId: number) => {
      const existing = await prisma.program.findUnique({ where: { code } });
      if (!existing) return prisma.program.create({ data: { code, name, moduleId, isActive: true } });
      if (existing.moduleId !== moduleId) {
        return prisma.program.update({ where: { code }, data: { moduleId } });
      }
      return existing;
    };

    // Convenção de códigos segue padrões existentes (UPPERCASE + underscores)
    const p1 = await ensureProgram('SAC_COMPLAINT_MAINTENANCE', 'Manutenção de Reclamação', sac.id);
    const p2 = await ensureProgram('SAC_COMPLAINT_SEARCH', 'Consulta Reclamação', sac.id);
    const p3 = await ensureProgram('SAC_COMPLAINT_CREATE', 'Cadastro de Reclamação', sac.id);
    const p4 = await ensureProgram('SAC_STANDARD_OCCURRENCE', 'Ocorrência Padrão', sac.id);

    const programs = [p1, p2, p3, p4];

    // 3) Vincular módulo SAC às entidades existentes
    const entities = await prisma.entity.findMany();
    let entityModuleLinked = 0;
    for (const e of entities) {
      await prisma.entityModule.upsert({
        where: { entityId_moduleId: { entityId: e.id, moduleId: sac.id } },
        update: {},
        create: { entityId: e.id, moduleId: sac.id },
      });
      entityModuleLinked++;
    }

    // 4) Vincular programas ao EntityModule (permitidos por padrão)
    const sacEMs = await prisma.entityModule.findMany({ where: { moduleId: sac.id } });
    let entityModuleProgramsLinked = 0;
    for (const em of sacEMs) {
      for (const p of programs) {
        await prisma.entityModuleProgram.upsert({
          where: { entityModuleId_programId: { entityModuleId: em.id, programId: p.id } },
          update: { allowed: true },
          create: { entityModuleId: em.id, programId: p.id, allowed: true },
        });
        entityModuleProgramsLinked++;
      }
    }

    return NextResponse.json({
      ok: true,
      module: { id: sac.id, code: sac.code, name: sac.name },
      programs: programs.map((p) => ({ id: p.id, code: p.code, name: p.name })),
      stats: { entities: entities.length, entityModuleLinked, entityModuleProgramsLinked },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

// Permitir disparo via GET em ambiente de desenvolvimento
export async function GET() {
  return POST();
}