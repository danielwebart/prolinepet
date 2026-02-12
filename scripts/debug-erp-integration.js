const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fetch = require('node-fetch'); // Ensure node-fetch is available or use built-in fetch if Node 18+

async function main() {
  try {
    const orderId = 22;
    const order = await prisma.salesOrder.findUnique({
      where: { id: orderId },
      include: {
        entity: true,
        client: true,
        items: {
          include: {
            inventoryItem: true
          }
        }
      }
    });

    if (!order) {
      console.error('Order not found');
      return;
    }

    // Default simulation logic from route.ts
    let paymentTermsErp = 30; 
    // Logic from my previous fix:
    if (order.paymentTerms) {
        const match = order.paymentTerms.match(/^\[(\d+)\]/);
        if (match && match[1]) {
            paymentTermsErp = parseInt(match[1], 10);
        } else {
             const term = await prisma.paymentTerm.findFirst({
                 where: { description: { equals: order.paymentTerms.trim(), mode: 'insensitive' } }
             });
             if (term && term.code) {
                 paymentTermsErp = term.code;
             }
        }
    }
    
    console.log(`Detected Payment Terms Code: ${paymentTermsErp}`);

    const customerDocRaw = order.client?.doc || order.customerDoc || '';
    
    // Simulate with code 1 first (as currently in DB)
    await simulate(order, customerDocRaw, paymentTermsErp, 'TEST - Current DB Value');

    // Simulate with code 30 (Fallback/Previous Default)
    await simulate(order, customerDocRaw, 30, 'TEST - Default 30');

    // Simulate with formatted CNPJ
    await simulate(order, customerDocRaw, paymentTermsErp, 'TEST - Formatted CNPJ', true);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

async function simulate(order, customerDocRaw, paymentTermsErp, label, formatCnpj = false) {
    console.log(`\n--- ${label} (Code: ${paymentTermsErp}) ---`);
    
    const custDoc = formatCnpj ? customerDocRaw : customerDocRaw.replace(/\D/g, '');

    const payload = {
      route: 'prd', // Changed to PRD to match user environment
      module: "mpd",
      version: "v1",
      resource: "simulaImpPedido",
      method: "POST",
      params: {
        order: {
          salesChannel: 1,
          paymentTermsErp: paymentTermsErp,
          branchId: "01",
          id: order.id,
          code: order.code,
          customerDoc: custDoc,
          discountOrd: "0",
          deliveryDate: order.deliveryDate ? order.deliveryDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          observ: order.notes || "Simulação via Script Debug",
          entityDoc: (order.entity?.cnpj || '').replace(/\D/g, '')
        },
        orderitem: order.items.map(item => ({
          orderId: order.id,
          sku: item.sku || item.inventoryItem?.sku || "",
          quantity: item.quantity,
          diameter: item.diameter || 0,
          grammage: item.grammage || 0,
          tube: item.tube || 0,
          width: item.width || 0,
          length: item.length || 0,
          clientOrderNumber: item.clientOrderNumber || "",
          clientOrderItemNumber: item.clientOrderItemNumber || 0,
          deliveryDate: item.itemDeliveryDate ? item.itemDeliveryDate.toISOString().split('T')[0] : "",
          externalResin: item.externalResin || false,
          internalResin: item.internalResin ? "S" : "N"
        }))
      }
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch('http://cvserver13:8484/apiIntegrTotvsDts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from('super:super').toString('base64') // Assuming default auth, or no auth needed? The route doesn't show auth headers.
                // Wait, the route.ts DOES NOT show Authorization header. 
                // Let's check if I missed it in search results.
                // d:\Sites\portalWeb\src\app\api\sales\orders\[id]\simulate-tax\route.ts shows:
                // const response = await fetch('http://cvserver13:8484/apiIntegrTotvsDts/', {
                // headers: { 'Content-Type': 'application/json' }
                // So no auth header.
            },
            body: JSON.stringify(payload)
        });
        
        const text = await response.text();
        console.log('Response Status:', response.status);
        console.log('Response Body:', text);
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

main();
