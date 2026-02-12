
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- UserEntityModulePrograms ---');
  const uemps = await prisma.userEntityModuleProgram.findMany({ take: 10 });
  console.log(JSON.stringify(uemps, null, 2));

  console.log('\n--- Programs ---');
  const programs = await prisma.program.findMany({ take: 5 });
  console.log(JSON.stringify(programs, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
