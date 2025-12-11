import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

function normalizeDoc(doc: string): string {
  return (doc || '').replace(/\D+/g, '');
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    const esc = q.replace(/'/g, "''");
    const likeByText = `"name" ILIKE '%${esc}%' OR "cidade" ILIKE '%${esc}%' OR "estado" ILIKE '%${esc}%'`;
    const likeById = `CAST("id" AS TEXT) ILIKE '%${esc}%'`;
    const likeByDoc = `"doc" ILIKE '%${esc}%'`;
    const whereSql = q ? `WHERE (${likeByText} OR ${likeById} OR ${likeByDoc})` : '';
    const sql = `SELECT "id","doc","name","cep","logradouro","numero","bairro","cidade","estado" FROM "Client" ${whereSql} ORDER BY "name" ASC`;
    const clients = await prisma.$queryRawUnsafe<any[]>(sql);
    return NextResponse.json(clients);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const doc = normalizeDoc(String(body?.doc || '')) || null;
    const name = String(body?.name || '').trim();
    const cep = String(body?.cep || '').trim() || null;
    const logradouro = String(body?.logradouro || '').trim() || null;
    const numero = String(body?.numero || '').trim() || null;
    const bairro = String(body?.bairro || '').trim() || null;
    const cidade = String(body?.cidade || '').trim() || null;
    const estado = String(body?.estado || '').trim() || null;
    if (!name) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });

    const esc = (s: string | null) => s === null ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`;
    const insertSql = `INSERT INTO "Client" ("doc","name","cep","logradouro","numero","bairro","cidade","estado","updatedAt")
      VALUES (${esc(doc)}, ${esc(name)}, ${esc(cep)}, ${esc(logradouro)}, ${esc(numero)}, ${esc(bairro)}, ${esc(cidade)}, ${esc(estado)}, CURRENT_TIMESTAMP)
      ON CONFLICT ("doc") DO UPDATE SET
        "name"=EXCLUDED."name",
        "cep"=EXCLUDED."cep",
        "logradouro"=EXCLUDED."logradouro",
        "numero"=EXCLUDED."numero",
        "bairro"=EXCLUDED."bairro",
        "cidade"=EXCLUDED."cidade",
        "estado"=EXCLUDED."estado",
        "updatedAt"=CURRENT_TIMESTAMP
      RETURNING "id","doc","name","cep","logradouro","numero","bairro","cidade","estado"`;
    const rows = await prisma.$queryRawUnsafe<any[]>(insertSql);
    const created = rows[0];
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}