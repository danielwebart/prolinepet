import { NextResponse } from 'next/server';
import { verifyResetCode, clearResetCode } from '../../../../../lib/resetStore';

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

    // Opcional: limpar o código após verificação bem-sucedida
    clearResetCode(email);

    return NextResponse.json({ ok: true, message: 'Código verificado' });
  } catch (err) {
    return NextResponse.json({ message: 'Erro ao verificar código' }, { status: 500 });
  }
}