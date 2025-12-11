import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../../../../../lib/prisma';

function normalizeDoc(doc: string): string { return (doc || '').replace(/\D+/g, ''); }
function normalizeCnpj(cnpj: string): string { return (cnpj || '').replace(/\D+/g, ''); }

// GET: Lista programas vinculados à entidade/módulo e flag se estão permitidos ao usuário
export async function GET(request: Request, { params }: { params: { id: string; eid: string; mid: string } }) {
  try {
    const url = new URL(request.url);
    const userDoc = normalizeDoc(String(url.searchParams.get('userDoc') || ''));
    const entityCnpj = normalizeCnpj(String(url.searchParams.get('entityCnpj') || ''));
    let userId = Number(params.id);
    let entityId = Number(params.eid);
    const moduleId = Number(params.mid);
    if (!userId && userDoc) {
      const uRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "User" WHERE "doc"='${userDoc}' LIMIT 1`);
      userId = Number(uRow[0]?.id || 0);
    }
    if (!entityId && entityCnpj) {
      const eRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Entity" WHERE regexp_replace("cnpj", '\\D', '', 'g')='${entityCnpj}' LIMIT 1`);
      entityId = Number(eRow[0]?.id || 0);
    }
    if (!userId || !entityId || !moduleId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });

    // Obter UEM (UserEntityModule) se existir
    const ueRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    const userEntityId: number | null = ueRow[0]?.id ?? null;
    let uemId: number | null = null;
    if (userEntityId) {
      const uemRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntityModule" WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId} LIMIT 1`);
      uemId = uemRow[0]?.id ?? null;
    }

    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT p."id", p."code", p."name",
             CASE WHEN uemp."id" IS NULL THEN 0 ELSE 1 END AS allowed
      FROM "EntityModuleProgram" emp
      INNER JOIN "Program" p ON p."id" = emp."programId"
      LEFT JOIN "UserEntityModuleProgram" uemp ON uemp."programId" = p."id" AND uemp."userEntityModuleId" ${uemId ? `= ${uemId}` : 'IS NULL'}
      WHERE emp."entityModuleId" IN (
        SELECT em."id" FROM "EntityModule" em WHERE em."entityId"=${entityId} AND em."moduleId"=${moduleId}
      )
      ORDER BY p."id" ASC
    `);
    const safeRows = rows.map((r: any) => ({
      id: Number(r.id),
      code: String(r.code),
      name: String(r.name),
      allowed: Number(r.allowed),
    }));
    return NextResponse.json({ programs: safeRows });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// PUT: Vincula/Desvincula/Permite programa ao usuário para entidade/módulo
export async function PUT(request: Request, { params }: { params: { id: string; eid: string; mid: string } }) {
  try {
    let userId = Number(params.id);
    let entityId = Number(params.eid);
    const moduleId = Number(params.mid);
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
    if (!userId || !entityId || !moduleId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    const programId = Number(body?.programId);
    const allowed = Boolean(body?.allowed);
    if (!programId) return NextResponse.json({ error: 'programId inválido' }, { status: 400 });

    // Garantir UserEntity e UserEntityModule
    const ueRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    let userEntityId: number | undefined = ueRow[0]?.id;
    if (!userEntityId) {
      if (!allowed) return NextResponse.json({ ok: true }); // nada a excluir
      await prisma.$executeRawUnsafe(`INSERT INTO "UserEntity" ("userId", "entityId") VALUES (${userId}, ${entityId})`);
      const ueRow2: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
      userEntityId = ueRow2[0]?.id;
    }
    if (!userEntityId) return NextResponse.json({ error: 'Falha UserEntity' }, { status: 500 });

    const uemRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntityModule" WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId} LIMIT 1`);
    let uemId: number | undefined = uemRow[0]?.id;
    if (!uemId) {
      if (!allowed) return NextResponse.json({ ok: true });
      await prisma.$executeRawUnsafe(`INSERT INTO "UserEntityModule" ("userEntityId", "moduleId", "allowed") VALUES (${userEntityId}, ${moduleId}, TRUE)`);
      const uemRow2: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntityModule" WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId} LIMIT 1`);
      uemId = uemRow2[0]?.id;
    }
    if (!uemId) return NextResponse.json({ error: 'Falha UserEntityModule' }, { status: 500 });

    const uempRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntityModuleProgram" WHERE "userEntityModuleId"=${uemId} AND "programId"=${programId} LIMIT 1`);
    if (allowed) {
      if (uempRow.length === 0) {
      await prisma.$executeRawUnsafe(`INSERT INTO "UserEntityModuleProgram" ("userEntityModuleId", "programId", "allowed") VALUES (${uemId}, ${programId}, TRUE)`);
      } else {
      await prisma.$executeRawUnsafe(`UPDATE "UserEntityModuleProgram" SET "allowed"=TRUE WHERE "id"=${uempRow[0].id}`);
      }
    } else {
      if (uempRow.length > 0) {
        await prisma.$executeRawUnsafe(`DELETE FROM "UserEntityModuleProgram" WHERE "id"=${uempRow[0].id}`);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// PATCH: Operações em lote para programas do usuário dentro da entidade/módulo
export async function PATCH(request: Request, { params }: { params: { id: string; eid: string; mid: string } }) {
  try {
    let userId = Number(params.id);
    let entityId = Number(params.eid);
    const moduleId = Number(params.mid);
    const body = await request.json().catch(() => ({} as any));
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
    if (!userId || !entityId || !moduleId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    const action = String(body?.action || '').toLowerCase();

    // Garantir UserEntity
    const ueRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    let userEntityId: number | undefined = ueRow[0]?.id;
    if (!userEntityId && action === 'link_all') {
      await prisma.$executeRawUnsafe(`INSERT INTO "UserEntity" ("userId", "entityId") VALUES (${userId}, ${entityId})`);
      const ueRow2: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
      userEntityId = ueRow2[0]?.id;
    }
    if (!userEntityId) return NextResponse.json({ ok: true, action });

    // Garantir UserEntityModule
    const uemRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntityModule" WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId} LIMIT 1`);
    let uemId: number | undefined = uemRow[0]?.id;
    if (!uemId && action === 'link_all') {
      await prisma.$executeRawUnsafe(`INSERT INTO "UserEntityModule" ("userEntityId", "moduleId", "allowed") VALUES (${userEntityId}, ${moduleId}, TRUE)`);
      const uemRow2: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntityModule" WHERE "userEntityId"=${userEntityId} AND "moduleId"=${moduleId} LIMIT 1`);
      uemId = uemRow2[0]?.id;
    }
    if (!uemId) return NextResponse.json({ ok: true, action });

    if (action === 'link_all') {
      // Vincula todos os programas do módulo ao usuário (seguindo os programas da entidade/módulo)
      await prisma.$executeRawUnsafe(`
        INSERT INTO "UserEntityModuleProgram" ("userEntityModuleId", "programId", "allowed")
        SELECT ${uemId}, emp."programId", 1 FROM "EntityModuleProgram" emp
        WHERE emp."entityModuleId" IN (
          SELECT em."id" FROM "EntityModule" em WHERE em."entityId"=${entityId} AND em."moduleId"=${moduleId}
        )
        AND NOT EXISTS (
          SELECT 1 FROM "UserEntityModuleProgram" uemp WHERE uemp."userEntityModuleId"=${uemId} AND uemp."programId"=emp."programId"
        )
      `);
      return NextResponse.json({ ok: true, action: 'link_all' });
    }

    if (action === 'unlink_all') {
      // Remove todos os programas vinculados ao usuário para este módulo
      await prisma.$executeRawUnsafe(`DELETE FROM "UserEntityModuleProgram" WHERE "userEntityModuleId"=${uemId}`);
      return NextResponse.json({ ok: true, action: 'unlink_all' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
