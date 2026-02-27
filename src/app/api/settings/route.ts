import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findMany();
    const config: Record<string, string> = {};
    settings.forEach(s => config[s.key] = s.value);
    return NextResponse.json(config);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao carregar configurações' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const keys = Object.keys(body);
    
    // Upsert each key
    for (const key of keys) {
      const value = String(body[key] ?? '');
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
