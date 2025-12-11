import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../lib/auth';
import { prisma } from '../../../../../../lib/prisma';

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


export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = Number(params.id) || null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const eid = Number(params.id);
    const body = await request.json();
    const moduleId = Number(body.moduleId);
    const linked = Boolean(body.linked);
    if (!eid || !moduleId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    const existing: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "EntityModule" WHERE "entityId"=${eid} AND "moduleId"=${moduleId}`);
    if (linked) {
      if (existing.length === 0) {
        await prisma.$executeRawUnsafe(`INSERT INTO "EntityModule" ("entityId", "moduleId") VALUES (${eid}, ${moduleId})`);
      }
    } else {
      if (existing.length > 0) {
        // Remover primeiro os programas vinculados a este EntityModule para evitar violação de FK
        const emId = Number(existing[0]?.id);
        if (emId) {
          await prisma.$executeRawUnsafe(`DELETE FROM "EntityModuleProgram" WHERE "entityModuleId"=${emId}`);
          await prisma.$executeRawUnsafe(`DELETE FROM "EntityModule" WHERE "id"=${emId}`);
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// Operações em lote: vincular todos ou desvincular todos os módulos da entidade
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = Number(params.id) || null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const eid = Number(params.id);
    if (!eid) return NextResponse.json({ error: 'ID da entidade inválido' }, { status: 400 });

    const body = await request.json();
    const action = String(body?.action || '').toLowerCase();

    if (action === 'link_all') {
      // Vincula todos os módulos ativos à entidade (evitando duplicidades)
      await prisma.$executeRawUnsafe(`
        INSERT INTO "EntityModule" ("entityId", "moduleId")
        SELECT ${eid}, m."id" FROM "Module" m
        WHERE m."isActive"=true AND NOT EXISTS (
          SELECT 1 FROM "EntityModule" em WHERE em."entityId"=${eid} AND em."moduleId"=m."id"
        )
      `);
      return NextResponse.json({ ok: true, action: 'link_all' });
    }

    if (action === 'unlink_all') {
      // Remove vínculos de programas primeiro para evitar violação de FK
      await prisma.$executeRawUnsafe(`
        DELETE FROM "EntityModuleProgram"
        WHERE "entityModuleId" IN (SELECT "id" FROM "EntityModule" WHERE "entityId"=${eid})
      `);
      // Agora remove todos os vínculos de módulos da entidade
      await prisma.$executeRawUnsafe(`
        DELETE FROM "EntityModule" WHERE "entityId"=${eid}
      `);
      return NextResponse.json({ ok: true, action: 'unlink_all' });
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

// Lista todos os módulos ativos e indica se estão vinculados à entidade
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = Number(params.id) || null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const eid = Number(params.id);
    if (!eid) return NextResponse.json({ error: 'ID da entidade inválido' }, { status: 400 });

    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT m."id" AS id, m."code" AS code, m."name" AS name,
        CASE WHEN EXISTS (
          SELECT 1 FROM "EntityModule" em WHERE em."entityId"=${eid} AND em."moduleId"=m."id"
        ) THEN 1 ELSE 0 END AS linked
      FROM "Module" m
      WHERE m."isActive"=true
      ORDER BY m."name"
    `);

    const modules = rows.map(r => ({
      id: Number(r.id),
      code: String(r.code),
      name: String(r.name),
      linked: Number(r.linked) === 1,
    }));

    return NextResponse.json({ modules });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}