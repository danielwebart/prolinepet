import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { verifyResetCode, clearResetCode } from '../../../../../lib/resetStore';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const code = String(body?.code || '').trim();
    const password = String(body?.password || '');

    if (!email || !code || !password) {
      return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });
    }

    // Verify code again
    const ok = verifyResetCode(email, code);
    if (!ok) {
      return NextResponse.json({ message: 'Código inválido ou expirado' }, { status: 400 });
    }

    // Update password
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email },
      data: { password: hash }
    });

    // Clear code
    clearResetCode(email);

    return NextResponse.json({ ok: true, message: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Erro ao redefinir senha' }, { status: 500 });
  }
}
