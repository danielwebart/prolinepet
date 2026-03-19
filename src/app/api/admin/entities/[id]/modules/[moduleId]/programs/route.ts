import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../../../lib/auth';
import { prisma } from '../../../../../../../../lib/prisma';

async function isProgramAllowed(uid: number, entityId: number | null, programCode: string) {
  if (!entityId) return false;
  const modRow: any[] = await prisma.$queryRawUnsafe(`SELECT m."id" FROM "Program" p JOIN "Module" m ON m."id"=p."moduleId" WHERE p."code"='${programCode}' LIMIT 1`);
  const moduleId = modRow[0]?.id;
  if (!moduleId) return false;
  const ue: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${uid} AND "entityId"=${entityId}`);
  if (ue.length === 0) return false;
  const ueId = ue[0].id;
  const uem: any[] = await prisma.$queryRawUnsafe(`SELECT "allowed" FROM "UserEntityModule" WHERE "userEntityId"=${ueId} AND "moduleId"=${moduleId}`);
  const moduleAllowed = uem.length === 0 ? true : uem.some((r: any) => Number(r.allowed) === 1);
  if (!moduleAllowed) return false;
  const progRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Program" WHERE "code"='${programCode}' LIMIT 1`);
  const programId = progRow[0]?.id;
  if (!programId) return false;
  const up: any[] = await prisma.$queryRawUnsafe(`
    SELECT uemp."allowed" FROM "UserEntityModuleProgram" uemp
    JOIN "UserEntityModule" uem ON uem."id"=uemp."userEntityModuleId"
    WHERE uem."userEntityId"=${ueId} AND uem."moduleId"=${moduleId} AND uemp."programId"=${programId}
  `);
  const programAllowed = up.length === 0 ? true : up.some((r: any) => Number(r.allowed) === 1);
  return programAllowed;
}

export async function GET(_: Request, { params }: { params: { id: string; moduleId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = (session as any)?.entityId ?? (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const eid = Number(params.id);
    const mid = Number(params.moduleId);
    if (!eid || !mid) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    const emRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "EntityModule" WHERE "entityId"=${eid} AND "moduleId"=${mid} LIMIT 1`);
    const linked = emRow.length > 0;
    const emId = linked ? Number(emRow[0].id) : null;
    const rows: any[] = linked
      ? await prisma.$queryRawUnsafe(`
          SELECT p."id" AS id, p."code" AS code, p."name" AS name,
            COALESCE((SELECT emp."allowed" FROM "EntityModuleProgram" emp WHERE emp."entityModuleId"=${emId} AND emp."programId"=p."id"), FALSE) AS allowed
          FROM "Program" p
          WHERE p."moduleId"=${mid}
          ORDER BY p."name"
        `)
      : await prisma.$queryRawUnsafe(`
          SELECT p."id" AS id, p."code" AS code, p."name" AS name, FALSE AS allowed
          FROM "Program" p
          WHERE p."moduleId"=${mid}
          ORDER BY p."name"
        `);
    const programs = rows.map(r => ({
      id: Number(r.id),
      code: String(r.code),
      name: String(r.name),
      allowed: Number(r.allowed),
    }));
    return NextResponse.json({ programs });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string; moduleId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = Number(params.id) || null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const eid = Number(params.id);
    const mid = Number(params.moduleId);
    const body = await request.json();
    const programId = Number(body.programId);
    const enabled = Boolean(body.allowed);
    if (!eid || !mid || !programId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    const emRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "EntityModule" WHERE "entityId"=${eid} AND "moduleId"=${mid} LIMIT 1`);
    if (emRow.length === 0) return NextResponse.json({ error: 'Módulo não vinculado à entidade' }, { status: 400 });
    const emId = emRow[0].id;
    const exists: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "EntityModuleProgram" WHERE "entityModuleId"=${emId} AND "programId"=${programId}`);
    if (exists.length === 0) {
      if (enabled) {
        await prisma.$executeRawUnsafe(`INSERT INTO "EntityModuleProgram" ("entityModuleId", "programId", "allowed") VALUES (${emId}, ${programId}, TRUE)`);
      }
    } else {
      await prisma.$executeRawUnsafe(`UPDATE "EntityModuleProgram" SET "allowed"=${enabled ? 'TRUE' : 'FALSE'} WHERE "entityModuleId"=${emId} AND "programId"=${programId}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// Operações em lote nos programas do módulo selecionado
export async function PATCH(request: Request, { params }: { params: { id: string; moduleId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = Number(params.id) || null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const eid = Number(params.id);
    const mid = Number(params.moduleId);
    if (!eid || !mid) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });

    const body = await request.json();
    const action = String(body?.action || '').toLowerCase();

    const emRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "EntityModule" WHERE "entityId"=${eid} AND "moduleId"=${mid} LIMIT 1`);
    if (emRow.length === 0) return NextResponse.json({ error: 'Módulo não vinculado à entidade' }, { status: 400 });
    const emId = Number(emRow[0].id);

    if (action === 'allow_all') {
      // Insere permissões faltantes e ativa todas as existentes
      await prisma.$executeRawUnsafe(`
        INSERT INTO "EntityModuleProgram" ("entityModuleId", "programId", "allowed")
        SELECT ${emId}, p."id", TRUE FROM "Program" p
        WHERE p."moduleId"=${mid}
          AND NOT EXISTS (
            SELECT 1 FROM "EntityModuleProgram" emp
            WHERE emp."entityModuleId"=${emId} AND emp."programId"=p."id"
          )
      `);
      await prisma.$executeRawUnsafe(`UPDATE "EntityModuleProgram" SET "allowed"=TRUE WHERE "entityModuleId"=${emId}`);
      return NextResponse.json({ ok: true, action: 'allow_all' });
    }

    if (action === 'deny_all') {
      await prisma.$executeRawUnsafe(`UPDATE "EntityModuleProgram" SET "allowed"=FALSE WHERE "entityModuleId"=${emId}`);
      return NextResponse.json({ ok: true, action: 'deny_all' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}