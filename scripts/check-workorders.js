const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.workOrder.count();
    console.log('WorkOrders count:', count);
    const rows = await prisma.workOrder.findMany({
      select: { id: true, title: true, status: true },
      orderBy: { id: 'asc' },
      take: 10,
    });
    console.log('Sample:', rows);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });