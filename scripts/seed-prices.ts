
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting price table seed for recent clients...');

    // Get last 5 clients
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log(`Found ${clients.length} recent clients.`);
    const items = await prisma.inventoryItem.findMany();
    console.log(`Found ${items.length} inventory items.`);

    for (const client of clients) {
        console.log(`Processing client: ${client.name} (ID: ${client.id})`);
        let createdCount = 0;
        
        // Batch check to avoid N+1 queries being too slow? 
        // For 1600 items it's okay-ish for a script, but let's optimize slightly by just fetching existing IDs
        const existingLinks = await prisma.clientItem.findMany({
            where: { clientId: client.id },
            select: { inventoryItemId: true }
        });
        const existingIds = new Set(existingLinks.map(l => l.inventoryItemId));

        for (const item of items) {
            if (!existingIds.has(item.id)) {
                await prisma.clientItem.create({
                    data: {
                        clientId: client.id,
                        inventoryItemId: item.id,
                        unit: item.unit || 'UN',
                        unitPrice: 10.00,
                        allowed: true
                    }
                });
                createdCount++;
            }
        }
        console.log(`   -> Linked ${createdCount} new items.`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
