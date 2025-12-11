import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

// POST: { entityId } -> define entidade ativa gravando em User.lastEntityId
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const body = await request.json();
    const entityId = Number(body.entityId);
    if (!entityId) return NextResponse.json({ error: 'entityId inválido' }, { status: 400 });
    // Verificar vínculo do usuário com a entidade
    const link: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${uid} AND "entityId"=${entityId}`);
    if (link.length === 0) {
      return NextResponse.json({ error: 'Usuário não vinculado à entidade' }, { status: 403 });
    }
    await prisma.$executeRawUnsafe(`UPDATE "User" SET "lastEntityId"=${entityId} WHERE "id"=${uid}`);
    return NextResponse.json({ ok: true, activeEntityId: entityId });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}