import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? Number((session.user as any).id) : null;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const id = Number(params.id);
    
    // Fetch order with related data
    const order = await prisma.salesOrder.findUnique({
      where: { id },
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
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Extract Payment Terms Code (assuming format "[code] description")
    let paymentTermsErp = 30; // Default
    if (order.paymentTerms) {
        const match = order.paymentTerms.match(/^\[(\d+)\]/);
        if (match && match[1]) {
            paymentTermsErp = parseInt(match[1], 10);
        }
    }

    const customerDocRaw = order.client?.doc || order.customerDoc || '';

    // Construct Payload
    const payload = {
      route: "tst",
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
          customerDoc: customerDocRaw.replace(/\D/g, ''),
          discountOrd: "0",
          deliveryDate: order.deliveryDate ? order.deliveryDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          observ: order.notes || "Simulação via Portal",
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
          externalResin: item.externalResin || false,
          internalResin: item.internalResin ? "S" : "N"
        }))
      }
    };

    console.log('Simulate Tax Payload:', JSON.stringify(payload, null, 2));

    // Call External API
    const response = await fetch('http://cvserver13:8484/apiIntegrTotvsDts/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('External API Error:', text);
        return NextResponse.json({ 
            error: `Erro na API externa: ${response.status} - ${text}`,
            payloadSent: payload
        }, { status: response.status });
    }

    const data = await response.json();

    // Parse total with tax from response
    let totalWithTax = 0;
    if (data && data.vltotcomimp !== undefined) {
      totalWithTax = Number(data.vltotcomimp);
    }

    // Atualizar timestamp da última simulação e total com impostos
    await prisma.salesOrder.update({
      where: { id: order.id },
      data: { 
        lastTaxSimulation: new Date(),
        totalWithTax: totalWithTax
      }
    });

    return NextResponse.json(data);

  } catch (err: any) {
    console.error('Simulate Tax Error:', err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
