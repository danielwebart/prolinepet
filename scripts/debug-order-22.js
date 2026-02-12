const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const order = await prisma.salesOrder.findUnique({
      where: { id: 22 },
      include: {
        items: true,
        client: true,
        entity: true
      }
    });
    console.log(JSON.stringify(order, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
