import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcrypt';
import { authenticator } from '../../../../lib/otp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, secret, token } = body;

    if (!email || !password || !secret || !token) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    const isValid = await authenticator.verify({ token, secret });
    if (!isValid) {
      return NextResponse.json({ error: 'Código inválido' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
