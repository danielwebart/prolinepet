import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// Upsert vínculo de item para cliente (usado pelo ERP)
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = Number(params.id);
    if (!Number.isFinite(clientId) || clientId <= 0) return NextResponse.json({ error: 'clientId inválido' }, { status: 400 });

    const rawBody = await request.json();
    const items = Array.isArray(rawBody) ? rawBody : [rawBody];
    const results = [];

    for (const body of items) {
      try {
        let inventoryItemId = Number(body.inventoryItemId);

        // Se não veio ID, tenta buscar pelo código (sku)
        if ((!inventoryItemId || isNaN(inventoryItemId)) && (body.itemCode || body.sku)) {
          const code = String(body.itemCode || body.sku);
          const item = await prisma.inventoryItem.findFirst({
            where: { sku: code }
          });
          if (item) {
            inventoryItemId = item.id;
          } else {
             results.push({ error: `Item com código '${code}' não encontrado`, success: false });
             continue;
          }
        }

        const unit = body.unit ? String(body.unit) : null;
        const unitPrice = Number(body.unitPrice ?? 0);
        const allowed = body.allowed === false ? false : true;

        if (!Number.isFinite(inventoryItemId) || inventoryItemId <= 0) {
            results.push({ error: 'inventoryItemId inválido', success: false });
            continue;
        }

        const existing = await prisma.clientItem.findFirst({ where: { clientId, inventoryItemId } });
        const row = existing
          ? await prisma.clientItem.update({ where: { id: existing.id }, data: { unit, unitPrice, allowed } })
          : await prisma.clientItem.create({ data: { clientId, inventoryItemId, unit, unitPrice, allowed } });
        
        results.push({ ...row, success: true });
      } catch (innerErr: any) {
        results.push({ error: String(innerErr?.message || innerErr), success: false });
      }
    }

    return NextResponse.json(Array.isArray(rawBody) ? results : results[0], { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// Remover vínculo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = Number(params.id);
    const url = new URL(request.url);
    const inventoryItemId = Number(url.searchParams.get('inventoryItemId'));
    if (!Number.isFinite(clientId) || clientId <= 0) return NextResponse.json({ error: 'clientId inválido' }, { status: 400 });
    if (!Number.isFinite(inventoryItemId) || inventoryItemId <= 0) return NextResponse.json({ error: 'inventoryItemId inválido' }, { status: 400 });

    const existing = await prisma.clientItem.findFirst({ where: { clientId, inventoryItemId } });
    if (!existing) return NextResponse.json({ error: 'Vínculo não encontrado' }, { status: 404 });
    await prisma.clientItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}


