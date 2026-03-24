import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const entities = await prisma.entity.findMany({
      select: { id: true, cnpj: true, name: true, isActive: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ entities });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
