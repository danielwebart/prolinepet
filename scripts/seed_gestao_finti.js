
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do módulo Gestão FinTI...');

  // 1. Criar ou atualizar Módulo
  const moduleCode = 'GESTAO_FINTI';
  let module = await prisma.module.findUnique({
    where: { code: moduleCode },
  });

  if (!module) {
    console.log(`Criando módulo ${moduleCode}...`);
    module = await prisma.module.create({
      data: {
        code: moduleCode,
        name: 'Gestão FinTI',
        description: 'Módulo de Gestão Financeira e TI',
        isActive: true,
        showDashboardTab: false,
      },
    });
  } else {
    console.log(`Módulo ${moduleCode} já existe.`);
  }

  // 2. Criar Programas
  const programs = [
    { code: 'DESPESAS', name: 'Despesas', description: 'Gestão de Despesas', showInMenu: true },
    { code: 'PAGAMENTOS', name: 'Pagamentos', description: 'Gestão de Pagamentos', showInMenu: true },
    { code: 'ANALISE', name: 'Análise', description: 'Análise Financeira', showInMenu: true },
    { code: 'ORCAMENTOS', name: 'Orçamentos', description: 'Gestão de Orçamentos', showInMenu: true },
    { code: 'ATIVOS', name: 'Ativos', description: 'Gestão de Ativos', showInMenu: true },
    { code: 'CONTRATOS', name: 'Contratos', description: 'Gestão de Contratos', showInMenu: true },
    { code: 'CONFIGURACOES', name: 'Configurações', description: 'Configurações do Módulo', showInMenu: true },
  ];

  for (const prog of programs) {
    const existingProgram = await prisma.program.findUnique({
      where: { code: prog.code },
    });

    if (!existingProgram) {
      console.log(`Criando programa ${prog.code}...`);
      await prisma.program.create({
        data: {
          code: prog.code,
          name: prog.name,
          description: prog.description,
          isActive: true,
          showInMenu: prog.showInMenu,
          moduleId: module.id,
        },
      });
    } else {
      console.log(`Programa ${prog.code} já existe.`);
      // Atualizar vínculo se necessário (opcional)
      if (existingProgram.moduleId !== module.id) {
        await prisma.program.update({
          where: { id: existingProgram.id },
          data: { moduleId: module.id },
        });
        console.log(`Programa ${prog.code} vinculado ao módulo correto.`);
      }
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
