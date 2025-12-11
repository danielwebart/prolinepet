import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET() {
  const data = await prisma.salesOrder.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const session = await getServerSession(authOptions);
  const createdById = session?.user ? Number((session.user as any).id) : undefined;

  const {
    customerName,
    customerDoc,
    paymentTerms,
    carrier,
    deliveryDate,
    notes,
    items,
  } = body || {};

  if (!customerName || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'customerName e items são obrigatórios' }, { status: 400 });
  }

  const normalizedItems = items.map((it: any) => {
    const qty = Number(it.quantity || 1);
    const price = Number(it.unitPrice || 0);
    const disc = Number(it.discountPct || 0);
    const lineTotal = qty * price * (1 - disc / 100);
    return {
      inventoryItemId: it.inventoryItemId ? Number(it.inventoryItemId) : undefined,
      sku: it.sku || undefined,
      name: String(it.name || it.productName || 'Produto'),
      quantity: qty,
      unit: it.unit || undefined,
      unitPrice: price,
      discountPct: disc,
      lineTotal,
    };
  });

  const subtotal = normalizedItems.reduce((acc: number, i: any) => acc + i.quantity * i.unitPrice, 0);
  const discountTotal = normalizedItems.reduce((acc: number, i: any) => acc + (i.quantity * i.unitPrice * (i.discountPct || 0) / 100), 0);
  const total = normalizedItems.reduce((acc: number, i: any) => acc + i.lineTotal, 0);

  const code = `ORD-${Date.now()}`;

  const created = await prisma.salesOrder.create({
    data: {
      code,
      customerName,
      customerDoc: customerDoc || undefined,
      paymentTerms: paymentTerms || undefined,
      carrier: carrier || undefined,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      notes: notes || undefined,
      createdById: createdById,
      subtotal,
      discountTotal,
      total,
      items: { create: normalizedItems },
    },
    include: { items: true },
  });

  return NextResponse.json(created, { status: 201 });
}
