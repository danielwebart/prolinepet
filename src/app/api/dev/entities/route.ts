import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT id, cnpj, name, "isActive"
      FROM "Entity"
      ORDER BY name
    `);
    return NextResponse.json({ entities: rows });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}