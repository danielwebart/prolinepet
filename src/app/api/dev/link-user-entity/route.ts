import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// POST /api/dev/link-user-entity
// Body: { userId: number, entityId: number }
// Vincula (upsert) o usuário à entidade e opcionalmente ajusta lastEntityId
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const userId = Number((body as any)?.userId ?? 0);
    const entityId = Number((body as any)?.entityId ?? 0);
    if (!userId || Number.isNaN(userId) || !entityId || Number.isNaN(entityId)) {
      return NextResponse.json({ ok: false, error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ ok: false, error: `Usuário ${userId} não encontrado` }, { status: 404 });
    const entity = await prisma.entity.findUnique({ where: { id: entityId } });
    if (!entity) return NextResponse.json({ ok: false, error: `Entidade ${entityId} não encontrada` }, { status: 404 });

    const ue = await prisma.userEntity.upsert({
      where: { userId_entityId: { userId, entityId } },
      update: {},
      create: { userId, entityId }
    });

    // Ajusta lastEntityId para facilitar seleção na UI (SQL direto)
    try { await prisma.$executeRawUnsafe(`UPDATE "User" SET "lastEntityId"=${entityId} WHERE "id"=${userId}`); } catch {}

    return NextResponse.json({ ok: true, userId, entityId, userEntityId: ue.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}