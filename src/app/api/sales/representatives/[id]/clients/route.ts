import { NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id);
    if (!userId) return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
    const sql = `SELECT c."id", c."doc", c."name", c."cep", c."logradouro", c."numero", c."bairro", c."cidade", c."estado"
                 FROM "UserClientRep" ucr
                 JOIN "Client" c ON c."id" = ucr."clientId"
                 WHERE ucr."userId" = ${userId}
                 ORDER BY c."name" ASC`;
    const clients = await prisma.$queryRawUnsafe<any[]>(sql);
    return NextResponse.json(clients);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id);
    if (!userId) return NextResponse.json({ error: 'userId inválido' }, { status: 400 });
    const body = await request.json().catch(() => ({} as any));
    const clientIds: number[] = Array.isArray(body?.clientIds) ? (body.clientIds as any[]).map((x) => Number(x)).filter((n) => !!n) : [];
    const action: string = String(body?.action || '').toLowerCase();
    if (!clientIds.length) return NextResponse.json({ error: 'clientIds vazio' }, { status: 400 });
    if (!['link', 'unlink'].includes(action)) return NextResponse.json({ error: 'action inválido' }, { status: 400 });

    if (action === 'link') {
      for (const cid of clientIds) {
        const sql = `INSERT INTO "UserClientRep" ("userId","clientId") VALUES (${userId}, ${cid})
                     ON CONFLICT ("userId","clientId") DO NOTHING`;
        await prisma.$executeRawUnsafe(sql);
      }
      return NextResponse.json({ ok: true, linked: clientIds.length });
    } else {
      for (const cid of clientIds) {
        const sql = `DELETE FROM "UserClientRep" WHERE "userId"=${userId} AND "clientId"=${cid}`;
        await prisma.$executeRawUnsafe(sql);
      }
      return NextResponse.json({ ok: true, unlinked: clientIds.length });
    }
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}