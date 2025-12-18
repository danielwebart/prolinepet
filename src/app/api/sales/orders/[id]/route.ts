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
      await prisma.$executeRaw(
        Prisma.sql`DELETE FROM "SalesOrderStatusHistory" WHERE "orderId" = ${id} AND "status" = ${allowed.status}`
      );
      // Inserir histórico sem a coluna messages quando estiver vazia para evitar erro de binding
      if (messages.length > 0) {
        await prisma.$executeRaw(
          Prisma.sql`INSERT INTO "SalesOrderStatusHistory" ("orderId", "status", messages) VALUES (${id}, ${allowed.status}, ${messages as any})`
        );
      } else {
        await prisma.$executeRaw(
          Prisma.sql`INSERT INTO "SalesOrderStatusHistory" ("orderId", "status") VALUES (${id}, ${allowed.status})`
        );
      }
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
