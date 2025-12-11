import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const order = await prisma.salesOrder.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          inventoryItem: { include: { commercialFamily: true } }
        }
      }
    }
  });
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const allowed: Record<string, any> = {};
    if (typeof body.status === 'string') {
      allowed.status = String(body.status);
    }
    if (typeof body.paymentTerms === 'string') {
      allowed.paymentTerms = String(body.paymentTerms);
    }
    if (typeof body.deliveryDate === 'string') {
      const v = body.deliveryDate.trim();
      allowed.deliveryDate = v ? new Date(v) : null;
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 });
    }

    const updated = await prisma.salesOrder.update({
      where: { id },
      data: allowed,
      include: { items: { include: { inventoryItem: { include: { commercialFamily: true } } } } },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.salesOrder.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
