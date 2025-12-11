import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { setResetCode } from '../../../../lib/resetStore';

function generateCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return String(n);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    if (!email) return NextResponse.json({ message: 'E-mail é obrigatório' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'E-mail não cadastrado' }, { status: 404 });
    }

    const code = generateCode();
    // TTL de 10 minutos
    setResetCode(email, code, 10 * 60 * 1000);

    // Envio de e-mail: aqui apenas registramos no log.
    console.log(`[Forgot Password] Código ${code} enviado para ${email}`);

    return NextResponse.json({ ok: true, message: 'Código enviado' });
  } catch (err) {
    return NextResponse.json({ message: 'Erro ao solicitar código' }, { status: 500 });
  }
}