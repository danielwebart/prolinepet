import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PaymentTerm" (
      "id" SERIAL PRIMARY KEY,
      "code" INTEGER UNIQUE,
      "description" TEXT NOT NULL,
      "installments" INTEGER DEFAULT 1,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "PaymentTerm_description_idx" ON "PaymentTerm" ("description");');
}

export async function GET(request: Request) {
  try {
    await ensureTable();
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    let rows: any[];
    if (q) {
      rows = await prisma.$queryRawUnsafe(
        `SELECT id, code, description, installments FROM "PaymentTerm" WHERE LOWER(description) LIKE '%${q.replace(/'/g, "''")}%' OR CAST(code AS TEXT) LIKE '%${q.replace(/'/g, "''")}%' ORDER BY description`
      );
    } else {
      rows = await prisma.$queryRawUnsafe('SELECT id, code, description, installments FROM "PaymentTerm" ORDER BY description');
    }
    const items = rows.map((r) => ({ id: Number(r.id), code: r.code ? Number(r.code) : null, description: String(r.description), installments: Number(r.installments || 1) }));
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = await request.json();
    const code = body.code !== undefined && body.code !== null ? Number(body.code) : null;
    const description = String(body.description || '').trim();
    const installments = body.installments !== undefined && body.installments !== null ? Number(body.installments) : 1;
    if (!description) return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 });
    // Inserir usando SQL compatível com Postgres e retornar o registro criado
    const esc = (s: string) => s.replace(/'/g, "''");
    const codeSql = code === null ? 'NULL' : String(code);
    const rows: any[] = await prisma.$queryRawUnsafe(
      `INSERT INTO "PaymentTerm" ("code", "description", "installments", "createdAt")
       VALUES (${codeSql}, '${esc(description)}', ${installments}, NOW())
       RETURNING "id", "code", "description", "installments"`
    );
    const r = rows[0];
    return NextResponse.json({ id: Number(r.id), code: r.code != null ? Number(r.code) : null, description: String(r.description), installments: Number(r.installments || 1) });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}