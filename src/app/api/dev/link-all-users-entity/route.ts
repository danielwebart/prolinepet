import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// POST: { entityId?: number }
// Vincula todos os usuários à entidade indicada (padrão: 1)
// e define User.lastEntityId = entityId
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const entityId = Number((body as any)?.entityId ?? 1);
    if (!entityId || Number.isNaN(entityId)) return NextResponse.json({ ok: false, error: 'entityId inválido' }, { status: 400 });

    // Confirmar existência da entidade
    const e: any[] = await prisma.$queryRawUnsafe(`SELECT id FROM "Entity" WHERE id=${entityId} LIMIT 1`);
    if (e.length === 0) return NextResponse.json({ ok: false, error: `Entidade ${entityId} não encontrada` }, { status: 404 });

    const users = await prisma.user.findMany({ select: { id: true } });
    let linked = 0;
    for (const u of users) {
      // Vincular (upsert) UserEntity
      await prisma.userEntity.upsert({
        where: { userId_entityId: { userId: u.id, entityId } },
        update: {},
        create: { userId: u.id, entityId }
      });
      // Definir lastEntityId via SQL direto para evitar erro de tipos
      await prisma.$executeRawUnsafe(`UPDATE "User" SET "lastEntityId"=${entityId} WHERE "id"=${u.id}`);
      linked++;
    }
    return NextResponse.json({ ok: true, entityId, totalUsers: users.length, linked });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}