import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

async function ensureTable() {
  // Criar a tabela/índice caso não existam (sem consultar regclass para evitar erro de desserialização)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CommercialFamily" (
      "id" SERIAL PRIMARY KEY,
      "description" TEXT NOT NULL,
      "erpCode" TEXT,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP
    );
  `);
  // Garantir coluna existente em bancos já criados
  await prisma.$executeRawUnsafe('ALTER TABLE "CommercialFamily" ADD COLUMN IF NOT EXISTS "erpCode" TEXT');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "CommercialFamily_description_idx" ON "CommercialFamily" ("description");');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "CommercialFamily_erpCode_idx" ON "CommercialFamily" ("erpCode");');
}

export async function GET(request: Request) {
  try {
    await ensureTable();
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    let rows: any[];
    if (q) {
      const esc = q.replace(/'/g, "''");
      rows = await prisma.$queryRawUnsafe(
        `SELECT id, description, "erpCode" FROM "CommercialFamily" WHERE LOWER(description) LIKE '%${esc}%' ORDER BY description`
      );
    } else {
      rows = await prisma.$queryRawUnsafe('SELECT id, description, "erpCode" FROM "CommercialFamily" ORDER BY description');
    }
    const items = rows.map((r) => ({ id: Number(r.id), description: String(r.description), erpCode: r.erpCode != null ? String(r.erpCode) : null }));
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = await request.json();
    const description = String(body.description || '').trim();
    const erpCodeRaw = body.erpCode;
    const erpCode = erpCodeRaw === undefined || erpCodeRaw === null ? null : String(erpCodeRaw).trim();
    if (!description) return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 });
    const esc = description.replace(/'/g, "''");
    const erpEsc = erpCode === null ? null : erpCode.replace(/'/g, "''");
    const rows: any[] = await prisma.$queryRawUnsafe(
      `INSERT INTO "CommercialFamily" ("description", "erpCode", "createdAt") VALUES ('${esc}', ${erpEsc === null ? 'NULL' : `'${erpEsc}'`}, NOW()) RETURNING id, description, "erpCode"`
    );
    const r = rows[0];
    return NextResponse.json({ id: Number(r.id), description: String(r.description), erpCode: r.erpCode != null ? String(r.erpCode) : null });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}