import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const allowed: Record<string, any> = {};
    if (body.quantity !== undefined) allowed.quantity = Number(body.quantity);
    if (body.width !== undefined) allowed.width = Number(body.width);
    if (body.length !== undefined) allowed.length = Number(body.length);
    if (body.grammage !== undefined) allowed.grammage = Number(body.grammage);
    if (body.diameter !== undefined) allowed.diameter = Number(body.diameter);
    if (body.tube !== undefined) allowed.tube = Number(body.tube);
    if (body.discountPct !== undefined) allowed.discountPct = Number(body.discountPct);
    if (body.clientOrderNumber !== undefined) allowed.clientOrderNumber = String(body.clientOrderNumber);
    if (body.internalResin !== undefined) allowed.internalResin = Boolean(body.internalResin);
    if (body.externalResin !== undefined) allowed.externalResin = Boolean(body.externalResin);
    if (body.creases !== undefined) allowed.creases = body.creases;

    const keys = Object.keys(allowed);
    if (keys.length === 0) return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 });

    const assignments = keys.map((k) => Prisma.sql`"${Prisma.raw(k)}" = ${allowed[k]}`);
    await prisma.$executeRaw(
      Prisma.sql`UPDATE "SalesOrderItem" SET ${Prisma.join(assignments, ', ')} , "lineTotal" = ("quantity" * "unitPrice" * (1 - COALESCE("discountPct",0)/100)) WHERE id = ${id}`
    );

    const row: any[] = await prisma.$queryRaw(
      Prisma.sql`SELECT i.*, inv."commercialFamilyId" FROM "SalesOrderItem" i LEFT JOIN "InventoryItem" inv ON inv.id=i."inventoryItemId" WHERE i.id=${id}`
    );
    return NextResponse.json(row[0] ?? { ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);

    await prisma.$transaction(async (tx) => {
      const item = await tx.salesOrderItem.findUnique({
        where: { id },
        select: { orderId: true }
      });

      if (!item) {
        throw new Error('Item não encontrado');
      }

      await tx.salesOrderItem.delete({
        where: { id }
      });

      // Recalcular totais do pedido
      const remainingItems = await tx.salesOrderItem.findMany({
        where: { orderId: item.orderId }
      });

      const subtotal = remainingItems.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
      const discountTotal = remainingItems.reduce((acc, it) => acc + (it.quantity * it.unitPrice * (it.discountPct / 100)), 0);
      const total = subtotal - discountTotal;

      await tx.salesOrder.update({
        where: { id: item.orderId },
        data: {
          subtotal,
          discountTotal,
          total
        }
      });
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Erro ao excluir item:', err);
    const status = err.message === 'Item não encontrado' ? 404 : 500;
    return NextResponse.json({ error: String(err?.message || err) }, { status });
  }
}
