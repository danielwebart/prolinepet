import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

function normalizeDoc(doc: string): string {
  return (doc || '').replace(/\D+/g, '');
}

export async function GET(_: Request, { params }: { params: { doc: string } }) {
  try {
    const raw = params.doc ?? '';
    const doc = normalizeDoc(raw);
    if (!doc) return NextResponse.json({ error: 'doc inválido' }, { status: 400 });
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT "id","doc","name","cep","logradouro","numero","bairro","cidade","estado" FROM "Client" WHERE "doc"='${doc}' LIMIT 1`);
    const item = rows[0] ?? null;
    if (!item) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { doc: string } }) {
  try {
    const raw = params.doc ?? '';
    const doc = normalizeDoc(raw);
    if (!doc) return NextResponse.json({ error: 'doc inválido' }, { status: 400 });
    const body = await request.json();
    const fields: any = {};
    if (body.doc !== undefined) fields.doc = normalizeDoc(String(body.doc || '')) || null;
    if (body.name !== undefined) fields.name = String(body.name || '').trim();
    if (body.cep !== undefined) fields.cep = String(body.cep || '').trim() || null;
    if (body.logradouro !== undefined) fields.logradouro = String(body.logradouro || '').trim() || null;
    if (body.numero !== undefined) fields.numero = String(body.numero || '').trim() || null;
    if (body.bairro !== undefined) fields.bairro = String(body.bairro || '').trim() || null;
    if (body.cidade !== undefined) fields.cidade = String(body.cidade || '').trim() || null;
    if (body.estado !== undefined) fields.estado = String(body.estado || '').trim() || null;
    const setCols = Object.keys(fields);
    if (setCols.length === 0) return NextResponse.json({ message: 'Nada para atualizar' }, { status: 400 });
    const data: any = {};
    for (const k of setCols) data[k] = (fields as any)[k];
    const updated = await prisma.client.update({ where: { doc }, data });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
