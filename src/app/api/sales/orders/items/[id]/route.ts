import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

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

    const keys = Object.keys(allowed);
    if (keys.length === 0) return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 });

    const assignments = keys.map((k) => `"${k}"=?`).join(', ');
    const values = keys.map((k) => allowed[k]);

    await prisma.$executeRawUnsafe(
      `UPDATE "SalesOrderItem" SET ${assignments}, "lineTotal" = ("quantity" * "unitPrice" * (1 - COALESCE("discountPct",0)/100)) WHERE id=?`,
      ...values,
      id
    );

    const row: any[] = await prisma.$queryRawUnsafe(
      `SELECT i.*, inv."commercialFamilyId" FROM "SalesOrderItem" i LEFT JOIN "InventoryItem" inv ON inv.id=i."inventoryItemId" WHERE i.id=?`, id
    );
    return NextResponse.json(row[0] ?? { ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

