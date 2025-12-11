import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../../lib/prisma';

function normalizeDoc(doc: string): string { return (doc || '').replace(/\D+/g, ''); }
function normalizeCnpj(cnpj: string): string { return (cnpj || '').replace(/\D+/g, ''); }

// GET: Lista módulos vinculados à entidade (apenas os vinculados) e flag se estão vinculados ao usuário
export async function GET(request: Request, { params }: { params: { id: string; eid: string } }) {
  try {
    const url = new URL(request.url);
    const userDoc = normalizeDoc(String(url.searchParams.get('userDoc') || ''));
    const entityCnpj = normalizeCnpj(String(url.searchParams.get('entityCnpj') || ''));
    let userId = Number(params.id);
    let entityId = Number(params.eid);
    if (!userId && userDoc) {
      const uRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "doc"='${userDoc}' LIMIT 1`);
      userId = Number(uRow[0]?.id || 0);
    }
    if (!entityId && entityCnpj) {
      const eRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Entity" WHERE regexp_replace("cnpj", '\\D', '', 'g')='${entityCnpj}' LIMIT 1`);
      entityId = Number(eRow[0]?.id || 0);
    }
    if (!userId || !entityId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });

    // Obter id de UserEntity (se existir)
    const ueRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    const userEntityId: number | null = ueRow[0]?.id ?? null;

    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT m."id", m."code", m."name",
             CASE WHEN uem."id" IS NULL THEN 0 ELSE 1 END AS "userLinked"
      FROM "EntityModule" em
      INNER JOIN "Module" m ON m."id" = em."moduleId"
      LEFT JOIN "UserEntityModule" uem ON uem."moduleId" = m."id" AND uem."userEntityId" ${userEntityId ? `= ${userEntityId}` : 'IS NULL'}
      WHERE em."entityId" = ${entityId}
      ORDER BY m."id" ASC
    `);
    const safeRows = rows.map((r: any) => ({
      id: Number(r.id),
      code: String(r.code),
      name: String(r.name),
      userLinked: Number(r.userLinked),
    }));
    return NextResponse.json({ modules: safeRows });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// PUT: Vincula/Desvincula módulo ao usuário dentro da entidade
export async function PUT(request: Request, { params }: { params: { id: string; eid: string } }) {
  try {
    let userId = Number(params.id);
    let entityId = Number(params.eid);
    const body = await request.json();
    const userDoc = body?.userDoc ? normalizeDoc(String(body.userDoc)) : '';
    const entityCnpj = body?.entityCnpj ? normalizeCnpj(String(body.entityCnpj)) : '';
    if (!userId && userDoc) {
      const uRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "doc"='${userDoc}' LIMIT 1`);
      userId = Number(uRow[0]?.id || 0);
    }
    if (!entityId && entityCnpj) {
      const eRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Entity" WHERE regexp_replace("cnpj", '\\D', '', 'g')='${entityCnpj}' LIMIT 1`);
      entityId = Number(eRow[0]?.id || 0);
    }
    if (!userId || !entityId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    const moduleId = Number(body?.moduleId);
    const linked = Boolean(body?.linked);
    if (!moduleId) return NextResponse.json({ error: 'moduleId inválido' }, { status: 400 });

    // Garantir UserEntity
    const ueRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    let userEntityId: number | undefined = ueRow[0]?.id;
    if (!userEntityId) {
      if (!linked) return NextResponse.json({ ok: true }); // nada a excluir
      await prisma.$executeRawUnsafe(`INSERT INTO "UserEntity" ("userId", "entityId") VALUES (${userId}, ${entityId})`);
      const ueRow2: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
      userEntityId = ueRow2[0]?.id;
    }
    if (!userEntityId) return NextResponse.json({ error: 'Falha UserEntity' }, { status: 500 });

    const uemRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntityModule" WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId} LIMIT 1`);
    if (linked) {
      if (uemRow.length === 0) {
        await prisma.$executeRawUnsafe(`INSERT INTO "UserEntityModule" ("userEntityId", "moduleId", "allowed") VALUES (${userEntityId}, ${moduleId}, TRUE)`);
      } else {
        await prisma.$executeRawUnsafe(`UPDATE "UserEntityModule" SET "allowed"=TRUE WHERE "id"=${uemRow[0].id}`);
      }
    } else {
      // Remover quaisquer programas dependentes do vínculo (via subconsulta) antes de remover o vínculo
      await prisma.$executeRawUnsafe(`
        DELETE FROM "UserEntityModuleProgram"
        WHERE "userEntityModuleId" IN (
          SELECT "id" FROM "UserEntityModule"
          WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId}
        )
      `);
      await prisma.$executeRawUnsafe(`
        DELETE FROM "UserEntityModule"
        WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId}
      `);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// PATCH: Operações em lote para módulos do usuário dentro da entidade
export async function PATCH(request: Request, { params }: { params: { id: string; eid: string } }) {
  try {
    let userId = Number(params.id);
    let entityId = Number(params.eid);
    const body = await request.json().catch(() => ({} as any));
    const action = String(body?.action || '').toLowerCase();
    const userDoc = body?.userDoc ? normalizeDoc(String(body.userDoc)) : '';
    const entityCnpj = body?.entityCnpj ? normalizeCnpj(String(body.entityCnpj)) : '';
    if (!userId && userDoc) {
      const uRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "doc"='${userDoc}' LIMIT 1`);
      userId = Number(uRow[0]?.id || 0);
    }
    if (!entityId && entityCnpj) {
      const eRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Entity" WHERE regexp_replace("cnpj", '\\D', '', 'g')='${entityCnpj}' LIMIT 1`);
      entityId = Number(eRow[0]?.id || 0);
    }
    if (!userId || !entityId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });

    // Garantir UserEntity quando necessário
    const ueRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    let userEntityId: number | undefined = ueRow[0]?.id;
    if (!userEntityId && action === 'link_all') {
      await prisma.$executeRawUnsafe(`INSERT INTO "UserEntity" ("userId", "entityId") VALUES (${userId}, ${entityId})`);
      const ueRow2: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
      userEntityId = ueRow2[0]?.id;
    }

    if (!userEntityId) {
      // Para unlink_all sem vínculo, nada a fazer
      return NextResponse.json({ ok: true, action });
    }

    if (action === 'link_all') {
      // Vincula todos os módulos da entidade ao usuário (evitando duplicidade)
      await prisma.$executeRawUnsafe(`
        INSERT INTO "UserEntityModule" ("userEntityId", "moduleId", "allowed")
        SELECT ${userEntityId}, em."moduleId", TRUE FROM "EntityModule" em
        WHERE em."entityId"=${entityId}
        AND NOT EXISTS (
          SELECT 1 FROM "UserEntityModule" uem WHERE uem."userEntityId"=${userEntityId} AND uem."moduleId"=em."moduleId"
        )
      `);
      return NextResponse.json({ ok: true, action: 'link_all' });
    }

    if (action === 'unlink_all') {
      // Remove vínculos de programas primeiro, depois módulos, somente para módulos da entidade
      await prisma.$executeRawUnsafe(`
        DELETE FROM "UserEntityModuleProgram"
        WHERE "userEntityModuleId" IN (
          SELECT uem."id" FROM "UserEntityModule" uem
          JOIN "EntityModule" em ON em."moduleId"=uem."moduleId"
          WHERE uem."userEntityId"=${userEntityId} AND em."entityId"=${entityId}
        )
      `);
      await prisma.$executeRawUnsafe(`
        DELETE FROM "UserEntityModule"
        WHERE "userEntityId"=${userEntityId}
        AND "moduleId" IN (SELECT "moduleId" FROM "EntityModule" WHERE "entityId"=${entityId})
      `);
      return NextResponse.json({ ok: true, action: 'unlink_all' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
