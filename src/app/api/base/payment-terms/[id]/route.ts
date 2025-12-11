import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const fields: any = {};
    if (body.code !== undefined) fields.code = body.code !== null && body.code !== undefined ? Number(body.code) : null;
    if (body.description !== undefined) fields.description = String(body.description || '').trim();
    if (body.installments !== undefined) fields.installments = body.installments !== null && body.installments !== undefined ? Number(body.installments) : null;
    const setCols = Object.keys(fields);
    if (setCols.length === 0) return NextResponse.json({ message: 'Nada para atualizar' }, { status: 400 });
    const assignments = setCols.map((k) => `${k}=?`).join(', ');
    const values = setCols.map((k) => (fields as any)[k]);
    await prisma.$executeRawUnsafe(`UPDATE "PaymentTerm" SET ${assignments}, updatedAt=CURRENT_TIMESTAMP WHERE id=?`, ...values, id);
    const row: any[] = await prisma.$queryRawUnsafe('SELECT * FROM "PaymentTerm" WHERE id=?', id);
    return NextResponse.json(row[0] ?? { ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.$executeRawUnsafe('DELETE FROM "PaymentTerm" WHERE id=?', id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}