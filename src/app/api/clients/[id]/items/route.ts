import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// Upsert vínculo de item para cliente (usado pelo ERP)
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const clientId = Number(params.id);
    if (!Number.isFinite(clientId) || clientId <= 0) return NextResponse.json({ error: 'clientId inválido' }, { status: 400 });

    const rawBody = await request.json();
    const isArrayPayload = Array.isArray(rawBody);
    const items = isArrayPayload ? rawBody : [rawBody];
    const results: any[] = [];

    if (isArrayPayload) {
      const withId: any[] = [];
      const withSku: { body: any; sku: string }[] = [];
      for (const body of items) {
        const inventoryItemId = Number(body?.inventoryItemId);
        if (Number.isFinite(inventoryItemId) && inventoryItemId > 0) {
          withId.push({ body, inventoryItemId });
          continue;
        }
        const sku = String(body?.itemCode || body?.sku || '').trim();
        if (!sku) return NextResponse.json({ error: 'inventoryItemId ou sku/itemCode é obrigatório' }, { status: 400 });
        withSku.push({ body, sku });
      }

      const skuList = Array.from(new Set(withSku.map((x) => x.sku)));
      const skuMap = new Map<string, number>();
      if (skuList.length) {
        const found = await prisma.inventoryItem.findMany({
          where: { sku: { in: skuList } },
          select: { id: true, sku: true },
        });
        for (const it of found) {
          if (it.sku) skuMap.set(it.sku, it.id);
        }
      }

      const normalized = new Map<number, any>();
      for (const { body, inventoryItemId } of withId) normalized.set(inventoryItemId, body);
      for (const { body, sku } of withSku) {
        const invId = skuMap.get(sku);
        if (!invId) return NextResponse.json({ error: `Item com código '${sku}' não encontrado` }, { status: 400 });
        normalized.set(invId, body);
      }

      const keepIds = Array.from(normalized.keys());
      const unlinkedCount = await prisma.$transaction(async (tx) => {
        for (const [inventoryItemId, body] of Array.from(normalized.entries())) {
          const unit = body.unit ? String(body.unit) : null;
          const unitPrice = Number(body.unitPrice ?? 0);
          const allowed = body.allowed === false ? false : true;

          const itemUpdate: any = {};
          if (body.width !== undefined) itemUpdate.width = Number(body.width);
          if (body.length !== undefined) itemUpdate.length = Number(body.length);
          if (body.grammage !== undefined) itemUpdate.grammage = Number(body.grammage);
          if (Object.keys(itemUpdate).length > 0) {
            await tx.inventoryItem.update({ where: { id: inventoryItemId }, data: itemUpdate });
          }

          const row = await tx.clientItem.upsert({
            where: { clientId_inventoryItemId: { clientId, inventoryItemId } },
            update: { unit, unitPrice, allowed },
            create: { clientId, inventoryItemId, unit, unitPrice, allowed },
          });
          results.push({ ...row, success: true });
        }

        const del = keepIds.length
          ? await tx.clientItem.deleteMany({ where: { clientId, inventoryItemId: { notIn: keepIds } } })
          : await tx.clientItem.deleteMany({ where: { clientId } });
        return del.count;
      });

      if (results.length) (results[0] as any).unlinkedCount = unlinkedCount;
      else results.push({ success: true, unlinkedCount });

      return NextResponse.json(results, { status: 200 });
    }

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

        // Atualiza dados do item se fornecidos
        const itemUpdate: any = {};
        if (body.width !== undefined) itemUpdate.width = Number(body.width);
        if (body.length !== undefined) itemUpdate.length = Number(body.length);
        if (body.grammage !== undefined) itemUpdate.grammage = Number(body.grammage);
        
        if (Object.keys(itemUpdate).length > 0) {
            await prisma.inventoryItem.update({
                where: { id: inventoryItemId },
                data: itemUpdate
            });
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
