import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

function normalizeDoc(doc: string): string {
  return (doc || '').replace(/\D+/g, '');
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user ? Number((session.user as any).id) : null;
    if (!userId) return NextResponse.json([]);

    const url = new URL(request.url);
    const requestedDocRaw = url.searchParams.get('doc');
    const requestedDoc = requestedDocRaw ? normalizeDoc(requestedDocRaw) : undefined;

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { salesRepAdmin: true } });
    const hasLinks = Boolean(await prisma.userClientRep.findFirst({ where: { userId }, select: { id: true } }));
    const shouldRestrict = Boolean(user?.salesRepAdmin) || hasLinks;

    let where: any = requestedDoc ? { customerDoc: requestedDoc } : undefined;

    if (shouldRestrict) {
      const links = await prisma.userClientRep.findMany({
        where: { userId },
        select: { client: { select: { doc: true } } }
      });
      const allowedDocs = Array.from(
        new Set(
          links
            .map((l) => normalizeDoc(String(l.client?.doc || '')))
            .filter((d) => d.length > 0)
        )
      );

      if (allowedDocs.length === 0) return NextResponse.json([]);

      if (requestedDoc) {
        if (!allowedDocs.includes(requestedDoc)) return NextResponse.json([]);
        where = { customerDoc: requestedDoc };
      } else {
        where = { customerDoc: { in: allowedDocs } };
      }
    }

    const data = await prisma.salesOrder.findMany({
      where,
      include: {
        items: {
          include: {
            inventoryItem: {
              include: { commercialFamily: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err: any) {
    const message = err?.message || 'Erro ao listar pedidos';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const session = await getServerSession(authOptions);
  const createdById = session?.user ? Number((session.user as any).id) : undefined;

  let entityId: number | undefined;
  if (createdById) {
    const u = await prisma.user.findUnique({ where: { id: createdById }, select: { lastEntityId: true } });
    if (u?.lastEntityId) entityId = u.lastEntityId;
  }

  const {
    customerName,
    customerDoc,
    paymentTerms,
    carrier,
    deliveryDate,
    notes,
    items,
  } = body || {};

  if (!customerName) {
    return NextResponse.json({ error: 'customerName é obrigatório' }, { status: 400 });
  }

  const normalizedItems = (Array.isArray(items) ? items : []).map((it: any) => {
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
      width: it.width ? Number(it.width) : undefined,
      length: it.length ? Number(it.length) : undefined,
      grammage: it.grammage ? Number(it.grammage) : undefined,
      diameter: it.diameter ? Number(it.diameter) : undefined,
      tube: it.tube ? Number(it.tube) : undefined,
      clientOrderNumber: it.clientOrderNumber || undefined,
      clientOrderItemNumber: it.clientOrderItemNumber ? Number(it.clientOrderItemNumber) : undefined,
      itemDeliveryDate: it.itemDeliveryDate ? new Date(it.itemDeliveryDate) : undefined,
      internalResin: !!it.internalResin,
      externalResin: !!it.externalResin,
      creases: it.creases || undefined,
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
      entityId,
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
