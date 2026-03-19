import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

async function ensureCommercialFamilyColumns() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CommercialFamily" (
      "id" SERIAL PRIMARY KEY,
      "description" TEXT NOT NULL,
      "erpCode" TEXT,
      "priceBy" TEXT DEFAULT 'UNIT',
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe('ALTER TABLE "CommercialFamily" ADD COLUMN IF NOT EXISTS "erpCode" TEXT');
  await prisma.$executeRawUnsafe('ALTER TABLE "CommercialFamily" ADD COLUMN IF NOT EXISTS "priceBy" TEXT DEFAULT \'UNIT\'');
  await prisma.$executeRawUnsafe('UPDATE "CommercialFamily" SET "priceBy"=\'UNIT\' WHERE "priceBy" IS NULL');
}

export async function GET(_: Request, { params }: { params: { sku: string } }) {
  try {
    await ensureCommercialFamilyColumns();
    const raw = params.sku ?? '';
    const sku = decodeURIComponent(raw).trim();
    if (!sku) return NextResponse.json({ error: 'SKU obrigatório' }, { status: 400 });
    const item = await prisma.inventoryItem.findUnique({ where: { sku }, include: { commercialFamily: true } });
    if (!item) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { sku: string } }) {
  try {
    const raw = params.sku ?? '';
    const sku = decodeURIComponent(raw).trim();
    if (!sku) return NextResponse.json({ error: 'SKU obrigatório' }, { status: 400 });
    const body = await request.json();
    const exists = await prisma.inventoryItem.findUnique({ where: { sku } });
    if (!exists) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    const data: any = {};
    if (body.name !== undefined) data.name = String(body.name || '').trim();
    if (body.sku !== undefined) data.sku = String(body.sku || '').trim();
    if (body.unit !== undefined) data.unit = String(body.unit || '').trim();
    if (body.width !== undefined) data.width = Number(body.width);
    if (body.length !== undefined) data.length = Number(body.length);
    if (body.grammage !== undefined) data.grammage = Number(body.grammage);
    if (body.commercialFamilyId !== undefined) {
      const cfid = Number(body.commercialFamilyId);
      if (Number.isFinite(cfid) && cfid > 0) {
        const cf = await prisma.commercialFamily.findUnique({ where: { id: cfid } });
        data.commercialFamilyId = cf ? cfid : null;
      } else {
        data.commercialFamilyId = null;
      }
    }
    const updated = await prisma.inventoryItem.update({ where: { sku }, data });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { sku: string } }) {
  try {
    const raw = params.sku ?? '';
    const sku = decodeURIComponent(raw).trim();
    if (!sku) return NextResponse.json({ error: 'SKU obrigatório' }, { status: 400 });
    const exists = await prisma.inventoryItem.findUnique({ where: { sku } });
    if (!exists) return NextResponse.json({ error: 'Item não encontrado' }, { status: 404 });
    await prisma.inventoryItem.delete({ where: { sku } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
