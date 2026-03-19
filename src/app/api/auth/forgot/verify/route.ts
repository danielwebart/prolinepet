import { NextResponse } from 'next/server';
import { verifyResetCode } from '../../../../../lib/resetStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const code = String(body?.code || '').trim();
    if (!email || !code) return NextResponse.json({ message: 'Dados incompletos' }, { status: 400 });

    const ok = verifyResetCode(email, code);
    if (!ok) {
      return NextResponse.json({ message: 'Código inválido ou expirado' }, { status: 400 });
    }

    // Não limpar o código aqui, pois será usado na redefinição de senha
    // clearResetCode(email);

    return NextResponse.json({ ok: true, message: 'Código verificado' });
  } catch {
    return NextResponse.json({ message: 'Erro ao verificar código' }, { status: 500 });
  }
}
