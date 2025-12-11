require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function ensureProgram(code, name, moduleId, description = null) {
  const existing = await prisma.program.findUnique({ where: { code } });
  if (!existing) {
    return prisma.program.create({ data: { code, name, description, moduleId, isActive: true } });
  }
  const needsUpdate = existing.moduleId !== moduleId || existing.name !== name || existing.description !== description || existing.isActive !== true;
  if (needsUpdate) {
    return prisma.program.update({ where: { code }, data: { name, description, moduleId, isActive: true } });
  }
  return existing;
}

async function main() {
  try {
    // Fetch module IDs by code
    const [base, maint, sales, sac] = await Promise.all([
      prisma.module.findUnique({ where: { code: 'BASE' } }),
      prisma.module.findUnique({ where: { code: 'MAINT' } }),
      prisma.module.findUnique({ where: { code: 'SALES' } }),
      prisma.module.findUnique({ where: { code: 'SAC' } }),
    ]);

    if (!base || !maint || !sales || !sac) {
      throw new Error('Módulos necessários não encontrados (BASE/MAINT/SALES/SAC). Rode scripts/seed-acl.js primeiro.');
    }

    // Define programs per module (consistent with app routes/components)
    const defs = [
      // MAINT
      { code: 'DASHBOARD', name: 'Dashboard', moduleId: maint.id },
      { code: 'ASSETS', name: 'Ativos', moduleId: maint.id },
      { code: 'WORK_ORDERS', name: 'Ordens de Serviço', moduleId: maint.id },
      { code: 'INVENTORY', name: 'Inventário', moduleId: maint.id },
      { code: 'REPORTS', name: 'Relatórios', moduleId: maint.id },
      // ADMIN
      { code: 'USERS', name: 'Usuários', moduleId: base.id },
      { code: 'SETTINGS', name: 'Configurações', moduleId: base.id },
      { code: 'ADMIN_ENTITIES', name: 'Cadastro de Entidade', moduleId: base.id },
      { code: 'ADMIN_MODULES', name: 'Cadastro de Módulo', moduleId: base.id },
      // SALES
      { code: 'SALES_CREATE_ORDER', name: 'Inclusão de Pedidos', moduleId: sales.id },
      { code: 'SALES_ORDER_SEARCH', name: 'Consulta de Pedidos', moduleId: sales.id },
      { code: 'SALES_CLIENT_SEARCH', name: 'Consulta de Clientes', moduleId: sales.id },
      { code: 'SALES_PRODUCTION_SCHEDULE', name: 'Agenda Produção', moduleId: sales.id },
      { code: 'SALES_REPRESENTATIVE', name: 'Representante', moduleId: sales.id },
      // BASE
      { code: 'CLIENTS', name: 'Clientes', moduleId: base.id },
      { code: 'PAYMENT_TERMS', name: 'Condição de Pagamento', moduleId: base.id },
      { code: 'COMMERCIAL_FAMILY', name: 'Família Comercial', moduleId: base.id },
      // SAC
      { code: 'SAC_COMPLAINT_MAINTENANCE', name: 'Manutenção de Reclamação', moduleId: sac.id },
      { code: 'SAC_COMPLAINT_SEARCH', name: 'Consulta Reclamação', moduleId: sac.id },
      { code: 'SAC_COMPLAINT_CREATE', name: 'Cadastro de Reclamação', moduleId: sac.id },
      { code: 'SAC_STANDARD_OCCURRENCE', name: 'Ocorrência Padrão', moduleId: sac.id },
    ];

    // Upsert programs
    const programs = [];
    for (const d of defs) {
      const p = await ensureProgram(d.code, d.name, d.moduleId);
      programs.push(p);
    }

    // Link to EntityModuleProgram (allowed=true)
    const entityModules = await prisma.entityModule.findMany({ select: { id: true, moduleId: true } });
    for (const em of entityModules) {
      const modProgs = programs.filter(p => p.moduleId === em.moduleId);
      for (const p of modProgs) {
        await prisma.entityModuleProgram.upsert({
          where: { entityModuleId_programId: { entityModuleId: em.id, programId: p.id } },
          update: { allowed: true },
          create: { entityModuleId: em.id, programId: p.id, allowed: true },
        });
      }
    }

    // Link to UserEntityModuleProgram (allowed=true) for each UserEntityModule
    const uems = await prisma.userEntityModule.findMany({ select: { id: true, moduleId: true } });
    for (const uem of uems) {
      const modProgs = programs.filter(p => p.moduleId === uem.moduleId);
      for (const p of modProgs) {
        await prisma.userEntityModuleProgram.upsert({
          where: { userEntityModuleId_programId: { userEntityModuleId: uem.id, programId: p.id } },
          update: { allowed: true },
          create: { userEntityModuleId: uem.id, programId: p.id, allowed: true },
        });
      }
    }

    const progCount = await prisma.program.count();
    const empCount = await prisma.entityModuleProgram.count();
    const uempCount = await prisma.userEntityModuleProgram.count();
    console.log('Seed de programas concluído.', { progCount, empCount, uempCount });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });