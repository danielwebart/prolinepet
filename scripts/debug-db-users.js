
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Users ---');
  const users = await prisma.user.findMany({ take: 5 });
  console.log(JSON.stringify(users, null, 2));

  console.log('\n--- UserEntityModules ---');
  const uems = await prisma.userEntityModule.findMany({ take: 5 });
  console.log(JSON.stringify(uems, null, 2));
  
  console.log('\n--- UserEntities ---');
  const ues = await prisma.userEntity.findMany({ take: 5 });
  console.log(JSON.stringify(ues, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
