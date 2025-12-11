import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

function normalizeDoc(doc: string): string {
  return (doc || '').replace(/\D+/g, '');
}
function normalizeCnpj(cnpj: string): string {
  return (cnpj || '').replace(/\D+/g, '');
}

// GET: Lista todas as entidades com flag se estão vinculadas ao usuário
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const url = new URL(request.url);
    const userDoc = normalizeDoc(String(url.searchParams.get('userDoc') || ''));
    let userId = Number(params.id);
    if (!userId && userDoc) {
      const uRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "doc"='${userDoc}' LIMIT 1`);
      userId = Number(uRow[0]?.id || 0);
    }
    if (!userId) return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
    try {
      const rows: any[] = await prisma.$queryRawUnsafe(`
        SELECT e."id", e."name", e."cnpj",
               CASE WHEN ue."id" IS NULL THEN 0 ELSE 1 END AS "linked"
        FROM "Entity" e
        LEFT JOIN "UserEntity" ue ON ue."entityId" = e."id" AND ue."userId" = ${userId}
        ORDER BY e."id" ASC
      `);
      const safeRows = rows.map((r: any) => ({
        id: Number(r.id),
        name: String(r.name),
        cnpj: String(r.cnpj),
        linked: Number(r.linked),
      }));
      return NextResponse.json({ entities: safeRows });
    } catch (err: any) {
      // Fallback defensivo: se tabela de vínculo não existir ainda, retornar entidades sem vínculo
      console.warn('Fallback GET /api/admin/users/[id]/entities sem JOIN (provável tabela ausente):', err?.message || err);
      const ents: any[] = await prisma.$queryRawUnsafe(`SELECT "id", "name", "cnpj" FROM "Entity" ORDER BY "id" ASC`);
      const safeEnts = ents.map((e: any) => ({ id: Number(e.id), name: String(e.name), cnpj: String(e.cnpj), linked: 0 }));
      return NextResponse.json({ entities: safeEnts });
    }
  } catch (err: any) {
    console.error('GET /api/admin/users/[id]/entities error:', err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// PUT: Vincula/Desvincula entidade ao usuário
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    let userId = Number(params.id);
    const body = await request.json();
    const userDoc = body?.userDoc ? normalizeDoc(String(body.userDoc)) : '';
    if (!userId && userDoc) {
      const uRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "doc"='${userDoc}' LIMIT 1`);
      userId = Number(uRow[0]?.id || 0);
    }
    if (!userId) return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
    let entityId = Number(body?.entityId);
    const entityCnpj = body?.entityCnpj ? normalizeCnpj(String(body.entityCnpj)) : '';
    if (!entityId && entityCnpj) {
      const eRowId: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Entity" WHERE regexp_replace("cnpj", '\\D', '', 'g')='${entityCnpj}' LIMIT 1`);
      entityId = Number(eRowId[0]?.id || 0);
    }
    const linked = Boolean(body?.linked);
    if (!entityId) return NextResponse.json({ error: 'entityId inválido' }, { status: 400 });

    // Verificar existência de entidade
    const eRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Entity" WHERE "id"=${entityId} LIMIT 1`);
    if (eRow.length === 0) return NextResponse.json({ error: 'Entidade não encontrada' }, { status: 404 });

    const existing: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    if (linked) {
      if (existing.length === 0) {
        await prisma.$executeRawUnsafe(`INSERT INTO "UserEntity" ("userId", "entityId") VALUES (${userId}, ${entityId})`);
      }
    } else {
      if (existing.length > 0) {
        await prisma.$executeRawUnsafe(`DELETE FROM "UserEntity" WHERE "id"=${existing[0].id}`);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
