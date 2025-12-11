import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

async function ensureTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "StandardOccurrence" (
      "id" SERIAL PRIMARY KEY,
      "description" TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "StandardOccurrenceFamily" (
      "occurrenceId" INTEGER NOT NULL,
      "familyId" INTEGER NOT NULL,
      PRIMARY KEY ("occurrenceId", "familyId")
    );
  `);
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await ensureTables();
    const id = Number(params.id);
    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT cf."familyId" AS id, f."description"
      FROM "StandardOccurrenceFamily" cf
      LEFT JOIN "CommercialFamily" f ON f."id"=cf."familyId"
      WHERE cf."occurrenceId"=${id}
      ORDER BY f."description"
    `);
    const items = rows.map((r) => ({ id: Number(r.id), description: String(r.description || '') }));
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await ensureTables();
    const id = Number(params.id);
    const body = await request.json().catch(() => ({}));
    const familyIds: number[] = Array.isArray(body.familyIds) ? body.familyIds.map((n: any) => Number(n)).filter((n) => Number.isFinite(n)) : [];

    await prisma.$executeRawUnsafe(`DELETE FROM "StandardOccurrenceFamily" WHERE "occurrenceId"=${id}`);
    for (const fid of familyIds) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "StandardOccurrenceFamily" ("occurrenceId", "familyId")
        VALUES (${id}, ${fid})
        ON CONFLICT ("occurrenceId", "familyId") DO NOTHING
      `);
    }
    return NextResponse.json({ ok: true, occurrenceId: id, familyIds });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}