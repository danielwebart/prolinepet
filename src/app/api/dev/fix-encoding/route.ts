import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Same normalization used in assets endpoints, applied persistently to DB values
function fixString(input?: string | null): string | null {
  if (!input && input !== '') return null;
  try {
    const buf = Buffer.from(input!, 'latin1');
    let s = buf.toString('utf8');
    // Common replacements seen in migrated data
    s = s
      .replace(/Ã¡/g, 'á')
      .replace(/Ã©/g, 'é')
      .replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã/g, 'Á')
      .replace(/Ã‰/g, 'É')
      .replace(/Ã/g, 'Í')
      .replace(/Ã“/g, 'Ó')
      .replace(/Ãš/g, 'Ú')
      .replace(/Ã£/g, 'ã')
      .replace(/Ã/g, 'Ã')
      .replace(/Ã§/g, 'ç')
      .replace(/Ã/g, 'Ç')
      .replace(/Ã±/g, 'ñ')
      .replace(/Ã/g, 'Ñ')
      .replace(/Ãº/g, 'ú')
      .replace(/Ã“/g, 'Ó')
      .replace(/â/g, '—')
      .replace(/â/g, '–')
      .replace(/â¦/g, '…')
      .replace(/â¢/g, '•')
      .replace(/â/g, '“')
      .replace(/â/g, '”')
      .replace(/â/g, '‘')
      .replace(/â/g, '’')
      .replace(/â/g, '—')
      .replace(/Â°/g, '°')
      .replace(/Âº/g, 'º')
      .replace(/Âª/g, 'ª')
      // Extras com caractere substituto "�" ainda presentes
      .replace(/Servi�os/g, 'Serviços')
      .replace(/integra��o/g, 'integração')
      .replace(/V�lvulas/g, 'Válvulas')
      .replace(/Man�metros/g, 'Manômetros')
      .replace(/V�cuo/g, 'Vácuo')
      .replace(/��o/g, 'ção');
    return s;
  } catch {
    return input ?? null;
  }
}

export async function POST() {
  // This endpoint normalizes string fields with broken accentuation directly in the DB.
  // It is idempotent: it only updates when the normalized value differs.
  const stats = {
    assetsScanned: 0,
    assetsUpdated: 0,
    workOrdersScanned: 0,
    workOrdersUpdated: 0,
    inventoryItemsScanned: 0,
    inventoryItemsUpdated: 0,
    entitiesScanned: 0,
    entitiesUpdated: 0,
  };

  // Assets
  const assets = await prisma.asset.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      location: true,
      description: true,
      manufacturer: true,
      model: true,
    },
  });
  stats.assetsScanned = assets.length;
  for (const a of assets) {
    const updateData: any = {};
    const name = fixString(a.name);
    const code = fixString(a.code);
    const location = fixString(a.location);
    const description = fixString(a.description);
    const manufacturer = fixString(a.manufacturer);
    const model = fixString(a.model);

    if (name !== a.name) updateData.name = name;
    if (code !== a.code) updateData.code = code;
    if (location !== a.location) updateData.location = location;
    if (description !== a.description) updateData.description = description;
    if (manufacturer !== a.manufacturer) updateData.manufacturer = manufacturer;
    if (model !== a.model) updateData.model = model;

    if (Object.keys(updateData).length) {
      await prisma.asset.update({ where: { id: a.id }, data: updateData });
      stats.assetsUpdated++;
    }
  }

  // WorkOrders (title, description)
  const workOrders = await prisma.workOrder.findMany({
    select: { id: true, title: true, description: true },
  });
  stats.workOrdersScanned = workOrders.length;
  for (const w of workOrders) {
    const updateData: any = {};
    const title = fixString(w.title);
    const description = fixString(w.description);
    if (title !== w.title) updateData.title = title;
    if (description !== w.description) updateData.description = description;
    if (Object.keys(updateData).length) {
      await prisma.workOrder.update({ where: { id: w.id }, data: updateData });
      stats.workOrdersUpdated++;
    }
  }

  // InventoryItem (name, sku, unit)
  const items = await prisma.inventoryItem.findMany({
    select: { id: true, name: true, sku: true, unit: true },
  });
  stats.inventoryItemsScanned = items.length;
  for (const it of items) {
    const updateData: any = {};
    const name = fixString(it.name);
    const sku = fixString(it.sku ?? null);
    const unit = fixString(it.unit ?? null);
    if (name !== it.name) updateData.name = name;
    if (sku !== it.sku) updateData.sku = sku ?? undefined;
    if (unit !== it.unit) updateData.unit = unit ?? undefined;
    if (Object.keys(updateData).length) {
      await prisma.inventoryItem.update({ where: { id: it.id }, data: updateData });
      stats.inventoryItemsUpdated++;
    }
  }

  // Entity (name)
  const entities = await prisma.entity.findMany({ select: { id: true, name: true } });
  stats.entitiesScanned = entities.length;
  for (const e of entities) {
    const name = fixString(e.name);
    if (name !== e.name) {
      await prisma.entity.update({ where: { id: e.id }, data: { name } });
      stats.entitiesUpdated++;
    }
  }

  return NextResponse.json({ ok: true, stats });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';