import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const createdById = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = (session as any).activeEntityId ? Number((session as any).activeEntityId) : undefined;
    const body = await request.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json({ error: 'Client ID required' }, { status: 400 });
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    // Get cart items
    const cartItems = await prisma.clientCartItem.findMany({
      where: { clientId },
      include: { inventoryItem: true }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Get last order for payment terms
    const lastOrder = await prisma.salesOrder.findFirst({
      where: { customerDoc: client.doc || undefined },
      orderBy: { createdAt: 'desc' }
    });

    // Prepare items
    const normalizedItems = cartItems.map((it) => {
      const qty = it.quantity;
      const price = it.unitPrice;
      const disc = 0; 
      const lineTotal = qty * price;
      
      return {
        inventoryItemId: it.inventoryItemId,
        sku: it.inventoryItem.sku,
        name: it.inventoryItem.name,
        quantity: qty,
        unit: it.inventoryItem.unit,
        unitPrice: price,
        discountPct: disc,
        lineTotal,
        width: it.inventoryItem.width,
        length: it.inventoryItem.length,
        grammage: it.inventoryItem.grammage,
      };
    });

    const subtotal = normalizedItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
    const discountTotal = 0;
    const total = subtotal;

    // Use a numeric timestamp + random suffix for uniqueness, or just timestamp if sufficient. 
    // Format: ORD-timestamp
    const code = `ORD-${Date.now()}`;

    // Transaction: Create Order, Delete Cart Items
    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.salesOrder.create({
            data: {
                code,
                status: 'Orçamento',
                customerName: client.name,
                customerDoc: client.doc,
                clientId: client.id,
                entityId,
                paymentTerms: lastOrder?.paymentTerms,
                createdById,
                subtotal,
                discountTotal,
                total,
                items: { create: normalizedItems }
            }
        });

        await tx.clientCartItem.deleteMany({
            where: { clientId }
        });

        return order;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
      console.error(e);
      return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
