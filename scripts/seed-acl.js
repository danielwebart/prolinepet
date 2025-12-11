require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function ensureModule(code, name, description) {
  const m = await prisma.module.upsert({
    where: { code },
    update: { name, description, isActive: true },
    create: { code, name, description, isActive: true },
  });
  return m;
}

async function ensureEntity(cnpj, name) {
  const e = await prisma.entity.upsert({
    where: { cnpj },
    update: { name, isActive: true },
    create: { cnpj, name, isActive: true },
  });
  return e;
}

async function main() {
  try {
    // 1) Módulos
    const base = await ensureModule('BASE', 'Base', 'Módulo Base');
    const maint = await ensureModule('MAINT', 'Manutenção Industrial', 'Manutenção industrial');
    const sales = await ensureModule('SALES', 'Vendas', 'Força de vendas');
    const sac = await ensureModule('SAC', 'SAC', 'Serviço de Atendimento ao Cliente');
    const modules = [base, maint, sales, sac];

    // 2) Entidades
    const cv = await ensureEntity('45.992.476/0001-94', 'Cartonificio Valinhos SA');
    const cvmg = await ensureEntity('45.992.476/0002-75', 'Cartonificio Valinhos SA - MG');
    const entities = [cv, cvmg];

    // 3) Vincular módulos às entidades (EntityModule)
    for (const e of entities) {
      for (const m of modules) {
        await prisma.entityModule.upsert({
          where: { entityId_moduleId: { entityId: e.id, moduleId: m.id } },
          update: {},
          create: { entityId: e.id, moduleId: m.id },
        });
      }
    }

    // 4) Vincular usuários às entidades (UserEntity)
    const users = await prisma.user.findMany({ select: { id: true } });
    for (const u of users) {
      for (const e of entities) {
        await prisma.userEntity.upsert({
          where: { userId_entityId: { userId: u.id, entityId: e.id } },
          update: {},
          create: { userId: u.id, entityId: e.id },
        });
      }
    }

    // 5) Vincular UserEntity aos módulos (UserEntityModule)
    const userEntities = await prisma.userEntity.findMany({ select: { id: true, userId: true, entityId: true } });
    for (const ue of userEntities) {
      for (const m of modules) {
        await prisma.userEntityModule.upsert({
          where: { userEntityId_moduleId: { userEntityId: ue.id, moduleId: m.id } },
          update: { allowed: true },
          create: { userEntityId: ue.id, moduleId: m.id, allowed: true },
        });
      }
    }

    // Resumo
    const modCount = await prisma.module.count();
    const entCount = await prisma.entity.count();
    const emCount = await prisma.entityModule.count();
    const ueCount = await prisma.userEntity.count();
    const uemCount = await prisma.userEntityModule.count();
    console.log('Seed ACL concluído.', { modCount, entCount, emCount, ueCount, uemCount });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });