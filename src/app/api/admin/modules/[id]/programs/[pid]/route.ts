import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../../lib/auth';
import { prisma } from '../../../../../../../lib/prisma';

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

// DELETE /api/admin/modules/:id/programs/:pid
// Remove o programa indicado e todos os vínculos com entidades e usuários
export async function DELETE(_req: Request, { params }: { params: { id: string; pid: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const activeEntityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, activeEntityId, 'ADMIN_MODULES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const moduleId = Number(params.id);
    const programId = Number(params.pid);
    if (!moduleId || Number.isNaN(moduleId)) return NextResponse.json({ error: 'ID de módulo inválido' }, { status: 400 });
    if (!programId || Number.isNaN(programId)) return NextResponse.json({ error: 'ID de programa inválido' }, { status: 400 });

    const prog: any[] = await prisma.$queryRawUnsafe(`SELECT "id", "moduleId" FROM "Program" WHERE "id"=${programId} LIMIT 1`);
    if (prog.length === 0) return NextResponse.json({ error: 'Programa não encontrado' }, { status: 404 });
    if (Number(prog[0].moduleId) !== moduleId) return NextResponse.json({ error: 'Programa não pertence ao módulo informado' }, { status: 400 });

    // Remover vínculos de usuário para este programa
    await prisma.$executeRawUnsafe(`DELETE FROM "UserEntityModuleProgram" WHERE "programId"=${programId}`);
    // Remover vínculos de entidade/módulo para este programa
    await prisma.$executeRawUnsafe(`DELETE FROM "EntityModuleProgram" WHERE "programId"=${programId}`);
    // Remover o programa
    await prisma.$executeRawUnsafe(`DELETE FROM "Program" WHERE "id"=${programId}`);

    return NextResponse.json({ ok: true, deletedId: programId });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string; pid: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const activeEntityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, activeEntityId, 'ADMIN_MODULES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });

    const moduleId = Number(params.id);
    const programId = Number(params.pid);
    if (!moduleId || Number.isNaN(moduleId)) return NextResponse.json({ error: 'ID de módulo inválido' }, { status: 400 });
    if (!programId || Number.isNaN(programId)) return NextResponse.json({ error: 'ID de programa inválido' }, { status: 400 });

    const body = await request.json();
    const name = String(body.name || '').trim();
    const description = body.description ? String(body.description).trim() : null;
    if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });

    const prog: any[] = await prisma.$queryRawUnsafe(`SELECT "id", "moduleId" FROM "Program" WHERE "id"=${programId} LIMIT 1`);
    if (prog.length === 0) return NextResponse.json({ error: 'Programa não encontrado' }, { status: 404 });
    if (Number(prog[0].moduleId) !== moduleId) return NextResponse.json({ error: 'Programa não pertence ao módulo informado' }, { status: 400 });

    await prisma.$executeRawUnsafe(`UPDATE "Program" SET "name"='${name.replace(/'/g, "''")}', "description"=${description ? `'${description.replace(/'/g, "''")}'` : 'NULL'} WHERE "id"=${programId}`);
    return NextResponse.json({ ok: true, id: programId });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}