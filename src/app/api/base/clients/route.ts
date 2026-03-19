import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

function normalizeDoc(doc: string): string {
  return (doc || '').replace(/\D+/g, '');
}

async function ensureClientPaymentTermColumn() {
  await prisma.$executeRawUnsafe('ALTER TABLE "Client" ADD COLUMN IF NOT EXISTS "paymentTermId" INTEGER');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "Client_paymentTermId_idx" ON "Client" ("paymentTermId")');
}

async function ensureClientPaymentTermsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ClientPaymentTerm" (
      "id" SERIAL PRIMARY KEY,
      "clientId" INTEGER NOT NULL,
      "paymentTermId" INTEGER NOT NULL,
      "position" INTEGER DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "ClientPaymentTerm_clientId_paymentTermId_key" ON "ClientPaymentTerm" ("clientId","paymentTermId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ClientPaymentTerm_clientId_idx" ON "ClientPaymentTerm" ("clientId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ClientPaymentTerm_paymentTermId_idx" ON "ClientPaymentTerm" ("paymentTermId")');
}

async function resolvePaymentTermId(body: any): Promise<number | null> {
  const num = (v: any): number | null => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'number') return Number.isFinite(v) ? Math.trunc(v) : null;
    const s = String(v).trim();
    if (!s) return null;
    const digits = s.replace(/\D/g, '');
    if (!digits) return null;
    const n = Number(digits);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  };

  const str = (v: any): string | null => {
    if (v === null || v === undefined) return null;
    const s = String(v).trim();
    return s ? s : null;
  };

  const idCandidate =
    num(body?.paymentTermId) ??
    num(body?.paymentTermsId) ??
    num(body?.condPagtoId) ??
    null;
  if (idCandidate) return idCandidate;

  const codeCandidate =
    num(body?.paymentTermsErp) ??
    num(body?.paymentTermCode) ??
    num(body?.paymentTermsCode) ??
    num(body?.condPagtoCode) ??
    num(body?.condPagto) ??
    null;
  if (codeCandidate) {
    const term = await prisma.paymentTerm.findFirst({ where: { code: codeCandidate }, select: { id: true } }).catch(() => null);
    if (term?.id) return term.id;
  }

  const descCandidate =
    str(body?.paymentTermDescription) ??
    str(body?.paymentTermsDescription) ??
    str(body?.condPagtoDescription) ??
    str(body?.condPagtoDesc) ??
    str(body?.paymentTerms) ??
    str(body?.paymentTerm) ??
    null;
  if (descCandidate) {
    const term = await prisma.paymentTerm.findFirst({
      where: { description: { equals: descCandidate, mode: 'insensitive' } },
      select: { id: true },
    }).catch(() => null);
    if (term?.id) return term.id;
  }

  return null;
}

function extractPaymentTermList(body: any): any[] | null {
  const candidates = [
    body?.paymentTermIds,
    body?.paymentTermsIds,
    body?.paymentTermsList,
    body?.paymentTerms,
    body?.condPagtoList,
    body?.condPagtoLista,
    body?.condicoesPagamento,
  ];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return null;
}

async function resolvePaymentTermIdFromAny(v: any): Promise<number | null> {
  if (v === null || v === undefined) return null;
  if (typeof v === 'object') return resolvePaymentTermId(v);

  const s = String(v).trim();
  if (!s) return null;
  const digits = s.replace(/\D/g, '');
  if (!digits) return null;
  const n = Number(digits);
  if (!Number.isFinite(n)) return null;

  const byCode = await prisma.paymentTerm.findFirst({ where: { code: Math.trunc(n) }, select: { id: true } }).catch(() => null);
  if (byCode?.id) return byCode.id;

  const byId = await prisma.paymentTerm.findFirst({ where: { id: Math.trunc(n) }, select: { id: true } }).catch(() => null);
  if (byId?.id) return byId.id;

  return null;
}

async function resolvePaymentTermIds(body: any): Promise<number[] | null> {
  const list = extractPaymentTermList(body);
  if (!list) return null;
  const out: number[] = [];
  const seen = new Set<number>();
  for (const it of list) {
    const id = await resolvePaymentTermIdFromAny(it);
    if (id && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

export async function GET(request: Request) {
  try {
    await ensureClientPaymentTermColumn();
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ? Number((session?.user as any).id) : null;
    
    // Se não houver usuário logado, retorna lista vazia (ou erro 401 se preferir)
    if (!userId) return NextResponse.json([]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isSalesAdmin: true }
    });
    const isSalesAdmin = Boolean(user?.isSalesAdmin);

    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();
    const esc = q.replace(/'/g, "''");

    // Ajuste nos likes para usar alias 'c' se necessário ou direto
    // Como vamos fazer JOIN, é bom qualificar as colunas para evitar ambiguidade se houver colunas iguais em UserClientRep (ex: id)
    const likeByText = `c."name" ILIKE '%${esc}%' OR c."cidade" ILIKE '%${esc}%' OR c."estado" ILIKE '%${esc}%'`;
    const likeById = `CAST(c."id" AS TEXT) ILIKE '%${esc}%'`;
    const likeByDoc = `c."doc" ILIKE '%${esc}%'`;
    
    const searchClause = q ? `AND (${likeByText} OR ${likeById} OR ${likeByDoc})` : '';

    const sql = isSalesAdmin
      ? `
        SELECT c."id", c."doc", c."name", c."cep", c."logradouro", c."numero", c."bairro", c."cidade", c."estado",
               c."creditLimit", c."availableLimit", c."titlesDue", c."titlesOverdue",
               c."paymentTermId", pt."code" AS "paymentTermCode", pt."description" AS "paymentTermDescription"
        FROM "Client" c
        LEFT JOIN "PaymentTerm" pt ON pt."id" = c."paymentTermId"
        WHERE 1=1
        ${searchClause}
        ORDER BY c."name" ASC
      `
      : `
        SELECT c."id", c."doc", c."name", c."cep", c."logradouro", c."numero", c."bairro", c."cidade", c."estado",
               c."creditLimit", c."availableLimit", c."titlesDue", c."titlesOverdue",
               c."paymentTermId", pt."code" AS "paymentTermCode", pt."description" AS "paymentTermDescription"
        FROM "Client" c
        INNER JOIN "UserClientRep" ucr ON c."id" = ucr."clientId"
        LEFT JOIN "PaymentTerm" pt ON pt."id" = c."paymentTermId"
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
    await ensureClientPaymentTermColumn();
    await ensureClientPaymentTermsTable();
    const body = await request.json();
    const doc = normalizeDoc(String(body?.doc || '')) || null;
    const name = String(body?.name || '').trim();
    const cep = String(body?.cep || '').trim() || null;
    const logradouro = String(body?.logradouro || '').trim() || null;
    const numero = String(body?.numero || '').trim() || null;
    const bairro = String(body?.bairro || '').trim() || null;
    const cidade = String(body?.cidade || '').trim() || null;
    const estado = String(body?.estado || '').trim() || null;
    const paymentTermIds = await resolvePaymentTermIds(body);
    const listProvided = paymentTermIds !== null;
    const paymentTermId = listProvided ? (paymentTermIds[0] ?? null) : await resolvePaymentTermId(body);
    if (!name) return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });

    const syncPaymentTermIds = listProvided ? paymentTermIds : (paymentTermId ? [paymentTermId] : null);

    const esc = (s: string | null) => s === null ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`;
    const paymentTermIdSql = paymentTermId ? String(paymentTermId) : 'NULL';
    const paymentTermUpdateSql = listProvided
      ? `"paymentTermId"=EXCLUDED."paymentTermId",`
      : `"paymentTermId"=COALESCE(EXCLUDED."paymentTermId","Client"."paymentTermId"),`;
    const insertSql = `INSERT INTO "Client" ("doc","name","cep","logradouro","numero","bairro","cidade","estado","paymentTermId","updatedAt")
      VALUES (${esc(doc)}, ${esc(name)}, ${esc(cep)}, ${esc(logradouro)}, ${esc(numero)}, ${esc(bairro)}, ${esc(cidade)}, ${esc(estado)}, ${paymentTermIdSql}, CURRENT_TIMESTAMP)
      ON CONFLICT ("doc") DO UPDATE SET
        "name"=EXCLUDED."name",
        "cep"=EXCLUDED."cep",
        "logradouro"=EXCLUDED."logradouro",
        "numero"=EXCLUDED."numero",
        "bairro"=EXCLUDED."bairro",
        "cidade"=EXCLUDED."cidade",
        "estado"=EXCLUDED."estado",
        ${paymentTermUpdateSql}
        "updatedAt"=CURRENT_TIMESTAMP
      RETURNING "id","doc","name","cep","logradouro","numero","bairro","cidade","estado","paymentTermId"`;

    const created = await prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRawUnsafe<any[]>(insertSql);
      const row = rows[0];
      if (row?.id && syncPaymentTermIds !== null) {
        await tx.clientPaymentTerm.deleteMany({ where: { clientId: row.id } });
        if (syncPaymentTermIds.length > 0) {
          await tx.clientPaymentTerm.createMany({
            data: syncPaymentTermIds.map((id, idx) => ({
              clientId: row.id,
              paymentTermId: id,
              position: idx,
            })),
            skipDuplicates: true,
          });
        }
      }
      return row;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
