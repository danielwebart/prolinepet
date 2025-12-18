import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { Prisma } from '@prisma/client';

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
  const history: any[] = await prisma.$queryRaw(
    Prisma.sql`SELECT id, "status", "changedAt", messages FROM "SalesOrderStatusHistory" WHERE "orderId" = ${id} ORDER BY "changedAt" DESC`
  );
  return NextResponse.json({ ...order, statusHistory: history });
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
    if (typeof body.customerName === 'string') {
      allowed.customerName = String(body.customerName);
    }
    if (typeof body.customerDoc === 'string') {
      allowed.customerDoc = String(body.customerDoc);
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 });
    }

    const updated = await prisma.salesOrder.update({
      where: { id },
      data: allowed,
      include: { items: { include: { inventoryItem: { include: { commercialFamily: true } } } } },
    });

    if (allowed.status) {
      const messages: any[] = Array.isArray(body?.messages) ? body.messages : [];
      // Remove existing history for this status to avoid duplication if that's the intent
      // or simply add new history. The previous logic was DELETE then INSERT.
      // Replicating logic using Prisma Client:
      await prisma.salesOrderStatusHistory.deleteMany({
        where: { orderId: id, status: allowed.status }
      });
      
      await prisma.salesOrderStatusHistory.create({
        data: {
          orderId: id,
          status: allowed.status,
          messages: messages // Prisma handles Json type automatically
        }
      });
    }
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

