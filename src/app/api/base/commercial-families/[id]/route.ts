import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await request.json();
    const description = body.description !== undefined ? String(body.description || '').trim() : undefined;
    const erpCodeVal = body.erpCode !== undefined ? (body.erpCode === null ? null : String(body.erpCode).trim()) : undefined;
    if (description === undefined && erpCodeVal === undefined) return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 });
    const esc = description !== undefined ? (description ?? '').replace(/'/g, "''") : undefined;
    const erpEsc = erpCodeVal !== undefined ? (erpCodeVal === null ? null : erpCodeVal.replace(/'/g, "''")) : undefined;
    const setParts: string[] = [];
    if (esc !== undefined) setParts.push(`"description"='${esc}'`);
    if (erpEsc !== undefined) setParts.push(`"erpCode"=${erpEsc === null ? 'NULL' : `'${erpEsc}'`}`);
    setParts.push('"updatedAt"=CURRENT_TIMESTAMP');
    await prisma.$executeRawUnsafe(`UPDATE "CommercialFamily" SET ${setParts.join(', ')} WHERE id=${id}`);
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT id, description, "erpCode" FROM "CommercialFamily" WHERE id=${id} LIMIT 1`);
    return NextResponse.json(rows[0] ?? { ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    // Postgres: usar interpolação numérica segura (id é Number)
    await prisma.$executeRawUnsafe(`DELETE FROM "CommercialFamily" WHERE id=${id}`);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}