import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import { isProgramAllowed } from '../../../../lib/isProgramAllowed';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = (session as any)?.entityId ?? (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const entities = await prisma.entity.findMany({ select: { id: true, cnpj: true, name: true, isActive: true }, orderBy: { name: 'asc' } });
    return NextResponse.json({ entities });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const entityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    const allowed = await isProgramAllowed(uid, entityId, 'ADMIN_ENTITIES');
    if (!allowed) return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    const body = await request.json();
    const cnpj = String(body.cnpj || '').trim();
    const name = String(body.name || '').trim();
    if (!cnpj || !name) return NextResponse.json({ error: 'CNPJ e Nome obrigatórios' }, { status: 400 });
    const exists = await prisma.entity.findUnique({ where: { cnpj }, select: { id: true } });
    if (exists) return NextResponse.json({ error: 'CNPJ já cadastrado' }, { status: 409 });
    const created = await prisma.entity.create({ data: { cnpj, name, isActive: true }, select: { id: true } });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
