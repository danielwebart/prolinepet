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

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_MODULES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const mid = Number(params.id);
    if (!mid) return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 });
    const programs = await prisma.$queryRawUnsafe(`SELECT "id", "code", "name", "description", "isActive" FROM "Program" WHERE "moduleId"=${mid} ORDER BY "name"`);
    return NextResponse.json({ programs });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_MODULES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const mid = Number(params.id);
    const body = await request.json();
    const code = String(body.code || '').trim();
    const name = String(body.name || '').trim();
    const description = body.description ? String(body.description).trim() : null;
    if (!mid || !code || !name) return NextResponse.json({ error: 'Parâmetros obrigatórios' }, { status: 400 });
    const exists: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Program" WHERE "code"='${code}'`);
    if (exists.length > 0) return NextResponse.json({ error: 'Código já cadastrado' }, { status: 409 });
      await prisma.$executeRawUnsafe(`INSERT INTO "Program" ("moduleId", "code", "name", "description", "isActive") VALUES (${mid}, '${code}', '${name.replace(/'/g, "''")}', ${description ? `'${description.replace(/'/g, "''")}'` : 'NULL'}, TRUE)`);
    const row: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "Program" WHERE "code"='${code}' LIMIT 1`);
    return NextResponse.json({ ok: true, id: row[0]?.id });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}