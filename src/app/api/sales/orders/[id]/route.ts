import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const order = await prisma.salesOrder.findUnique({ where: { id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
  return NextResponse.json(order);
}