import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// POST /api/dev/link-user-all-entities
// Vincula o usuário informado a todas as entidades cadastradas
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const userId = Number((body as any)?.userId ?? 0);
    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json({ ok: false, error: 'userId inválido' }, { status: 400 });
    }

    // Confirmar que o usuário existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ ok: false, error: `Usuário ${userId} não encontrado` }, { status: 404 });
    }

    const entities = await prisma.entity.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
    let created = 0;
    for (const e of entities) {
      try {
        // upsert por (userId, entityId)
        await prisma.userEntity.upsert({
          where: { userId_entityId: { userId, entityId: e.id } },
          update: {},
          create: { userId, entityId: e.id }
        });
        created++;
      } catch (err) {
        // Ignorar erros pontuais; o índice único previne duplicatas
      }
    }

    // Opcional: tentar ajustar lastEntityId via SQL bruto, mas não é obrigatório
    // Ignorar silenciosamente se a coluna não existir
    const firstEntityId = entities[0]?.id ?? null;
    if (firstEntityId != null) {
      try {
        await prisma.$executeRawUnsafe(`UPDATE "User" SET lastEntityId=${firstEntityId} WHERE id=${userId}`);
      } catch {}
    }

    return NextResponse.json({ ok: true, userId, totalEntities: entities.length, linkedCount: created });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}