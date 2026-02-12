
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Finding a client...');
    const client = await prisma.client.findFirst({
      where: { doc: { not: null } }
    });
    
    if (!client) {
      console.error('No client found');
      return;
    }
    console.log('Client found:', client.name, client.doc);

    console.log('Finding an item...');
    const item = await prisma.inventoryItem.findFirst({
        where: { commercialFamily: { description: { contains: 'CHAPA' } } } // Try to find a sheet for weight calc test
    });

    if (!item) {
        console.error('No item found');
        return;
    }
    console.log('Item found:', item.name, item.sku);

    // 1. Validate Weight Calculation Logic (Frontend logic replicated)
    console.log('--- Testing Weight Calculation ---');
    const width = 1000;
    const length = 2000;
    const grammage = 400; // g/m2
    const qty = 100;
    
    // area = 1 * 2 = 2 m2
    // weight = 2 * 400 * 100 = 80000 g = 80 kg
    const areaM2 = (length / 1000) * (width / 1000);
    const weightKg = (areaM2 * grammage * qty) / 1000;
    console.log(`Calc: ${width}x${length}mm, ${grammage}g, Qty ${qty} => Weight: ${weightKg}kg`);
    if (Math.abs(weightKg - 80) < 0.1) {
        console.log('✅ Weight calculation logic matches expected.');
    } else {
        console.error('❌ Weight calculation logic mismatch!');
    }

    // 2. Test ERP Payload Construction and Call
    console.log('--- Testing ERP Integration Call ---');
    
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const payload = {
      route: "tst", // Default to test
      module: "mpd",
      version: "v1",
      resource: "simulaImpPedido", // Use simulation first
      method: "POST",
      params: {
        order: {
          salesChannel: 1,
          paymentTermsErp: 30, // Default
          branchId: "01",
          id: 0, 
          code: "TEST-SCRIPT", 
          customerDoc: (client.doc || '').replace(/\D/g, ''),
          discountOrd: "0",
          deliveryDate: deliveryDate.toISOString().split('T')[0],
          observ: "Teste Script Trae",
          entityDoc: "" // Assuming empty for test
        },
        orderitem: [
            {
                orderId: 0,
                sku: item.sku || "",
                quantity: qty,
                diameter: 0,
                grammage: grammage,
                tube: 0,
                width: width,
                length: length,
                clientOrderNumber: "",
                clientOrderItemNumber: 0,
                deliveryDate: deliveryDate.toISOString().split('T')[0],
                externalResin: "N", // Testing the fix
                internalResin: "N"
            }
        ]
      }
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    console.log('Sending to ERP...');
    const response = await fetch('http://cvserver13:8484/apiIntegrTotvsDts/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    console.log('Response Status:', response.status);
    console.log('Response Body:', text);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
