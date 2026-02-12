
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.clientItem.count();
    console.log(`ClientItem count: ${count}`);
    
    if (count > 0) {
      const first = await prisma.clientItem.findFirst();
      console.log('Sample:', first);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
