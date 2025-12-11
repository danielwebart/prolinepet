import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

async function ensureTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "StandardOccurrence" (
      "id" SERIAL PRIMARY KEY,
      "description" TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "StandardOccurrence_description_idx" ON "StandardOccurrence" ("description");');
}

export async function GET(request: Request) {
  try {
    await ensureTable();
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    let rows: any[];
    if (q) {
      const esc = q.replace(/'/g, "''");
      rows = await prisma.$queryRawUnsafe(`
        SELECT id, description FROM "StandardOccurrence"
        WHERE LOWER(description) LIKE '%${esc}%'
        ORDER BY description
      `);
    } else {
      rows = await prisma.$queryRawUnsafe('SELECT id, description FROM "StandardOccurrence" ORDER BY description');
    }
    const items = rows.map((r) => ({ id: Number(r.id), description: String(r.description) }));
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
    if (!description) return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 });
    const esc = description.replace(/'/g, "''");
    const rows: any[] = await prisma.$queryRawUnsafe(`
      INSERT INTO "StandardOccurrence" ("description", "createdAt")
      VALUES ('${esc}', NOW())
      RETURNING id, description
    `);
    const r = rows[0];
    return NextResponse.json({ id: Number(r.id), description: String(r.description) });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}