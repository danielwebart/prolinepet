import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

function normalizeDoc(doc: string): string {
  return (doc || '').replace(/\D+/g, '');
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ? Number((session?.user as any).id) : null;
    
    // Se não houver usuário logado, retorna lista vazia (ou erro 401 se preferir)
    if (!userId) return NextResponse.json([]);

    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    const esc = q.replace(/'/g, "''");

    // Ajuste nos likes para usar alias 'c' se necessário ou direto
    // Como vamos fazer JOIN, é bom qualificar as colunas para evitar ambiguidade se houver colunas iguais em UserClientRep (ex: id)
    const likeByText = `c."name" ILIKE '%${esc}%' OR c."cidade" ILIKE '%${esc}%' OR c."estado" ILIKE '%${esc}%'`;
    const likeById = `CAST(c."id" AS TEXT) ILIKE '%${esc}%'`;
    const likeByDoc = `c."doc" ILIKE '%${esc}%'`;
    
    const searchClause = q ? `AND (${likeByText} OR ${likeById} OR ${likeByDoc})` : '';

    // Query filtrando por UserClientRep
    const sql = `
      SELECT c."id", c."doc", c."name", c."cep", c."logradouro", c."numero", c."bairro", c."cidade", c."estado",
             c."creditLimit", c."availableLimit", c."titlesDue", c."titlesOverdue"
      FROM "Client" c
      INNER JOIN "UserClientRep" ucr ON c."id" = ucr."clientId"
      WHERE ucr."userId" = ${userId}
      ${searchClause}
      ORDER BY c."name" ASC
    `;

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