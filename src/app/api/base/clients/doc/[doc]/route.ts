import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

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
    await ensureClientPaymentTermColumn();
    await ensureClientPaymentTermsTable();
    const raw = params.doc ?? '';
    const doc = normalizeDoc(raw);
    if (!doc) return NextResponse.json({ error: 'doc inválido' }, { status: 400 });
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }
    const fields: any = {};
    if (body.doc !== undefined) fields.doc = normalizeDoc(String(body.doc || '')) || null;
    if (body.name !== undefined) fields.name = String(body.name || '').trim();
    if (body.cep !== undefined) fields.cep = String(body.cep || '').trim() || null;
    if (body.logradouro !== undefined) fields.logradouro = String(body.logradouro || '').trim() || null;
    if (body.numero !== undefined) fields.numero = String(body.numero || '').trim() || null;
    if (body.bairro !== undefined) fields.bairro = String(body.bairro || '').trim() || null;
    if (body.cidade !== undefined) fields.cidade = String(body.cidade || '').trim() || null;
    if (body.estado !== undefined) fields.estado = String(body.estado || '').trim() || null;
    const paymentTermIds = await resolvePaymentTermIds(body);
    const listProvided = paymentTermIds !== null;
    const singleProvided = !listProvided && (body.paymentTermId !== undefined || body.paymentTermCode !== undefined || body.condPagto !== undefined || body.condPagtoCode !== undefined);
    if (listProvided) {
      fields.paymentTermId = paymentTermIds[0] ?? null;
    } else if (singleProvided) {
      fields.paymentTermId = await resolvePaymentTermId(body);
    }
    const setCols = Object.keys(fields);
    if (setCols.length === 0) return NextResponse.json({ message: 'Nada para atualizar' }, { status: 400 });
    const data: any = {};
    for (const k of setCols) data[k] = (fields as any)[k];
    const updated = await prisma.$transaction(async (tx) => {
      const row = await tx.client.update({ where: { doc }, data, select: { id: true, doc: true, name: true, cep: true, logradouro: true, numero: true, bairro: true, cidade: true, estado: true, paymentTermId: true } });
      if (listProvided || singleProvided) {
        const syncIds = listProvided ? paymentTermIds : (row.paymentTermId ? [row.paymentTermId] : []);
        await tx.clientPaymentTerm.deleteMany({ where: { clientId: row.id } });
        if (syncIds.length > 0) {
          await tx.clientPaymentTerm.createMany({
            data: syncIds.map((ptId, idx) => ({
              clientId: row.id,
              paymentTermId: ptId,
              position: idx,
            })),
            skipDuplicates: true,
          });
        }
      }
      return row;
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
