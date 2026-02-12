const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const updated = await prisma.salesOrder.update({
      where: { id: 22 },
      data: { paymentTerms: '[1] À Vista' }
    });
    console.log('Updated order 22:', updated.paymentTerms);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
