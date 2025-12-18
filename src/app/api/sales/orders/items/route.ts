import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = Number(body.orderId);
    if (!Number.isFinite(orderId) || orderId <= 0) return NextResponse.json({ error: 'orderId obrigatório' }, { status: 400 });

    const payload: Record<string, any> = {};
    if (body.inventoryItemId !== undefined) payload.inventoryItemId = Number(body.inventoryItemId) || null;
    if (body.sku !== undefined) payload.sku = String(body.sku || '').trim() || null;
    payload.name = String(body.name || 'Produto');
    payload.quantity = Number(body.quantity || 1);
    payload.unit = body.unit ? String(body.unit) : null;
    payload.unitPrice = Number(body.unitPrice || 0);
    payload.discountPct = Number(body.discountPct || 0);
    payload.lineTotal = payload.quantity * payload.unitPrice * (1 - (payload.discountPct || 0) / 100);
    if (body.width !== undefined) payload.width = Number(body.width || 0);
    if (body.length !== undefined) payload.length = Number(body.length || 0);
    if (body.grammage !== undefined) payload.grammage = Number(body.grammage || 0);
    if (body.diameter !== undefined) payload.diameter = Number(body.diameter || 0);
    if (body.tube !== undefined) payload.tube = Number(body.tube || 0);

    const created = await prisma.salesOrderItem.create({
      data: {
        orderId,
        inventoryItemId: payload.inventoryItemId ?? null,
        sku: payload.sku ?? null,
        name: payload.name,
        quantity: payload.quantity,
        unit: payload.unit ?? null,
        unitPrice: payload.unitPrice,
        discountPct: payload.discountPct,
        lineTotal: payload.lineTotal,
        width: payload.width ?? null,
        length: payload.length ?? null,
        grammage: payload.grammage ?? null,
        diameter: payload.diameter ?? null,
        tube: payload.tube ?? null,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
