import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcrypt';
import { authenticator } from '../../../../lib/otp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha obrigatórios' }, { status: 400 });
    }

    let user: any = null;
    if (email.includes('@')) {
         user = await prisma.user.findUnique({ where: { email } });
    } else {
         const doc = email.replace(/\D/g, '');
         if (doc) {
             user = await prisma.user.findUnique({ where: { doc } });
         }
    }
    
    // Check for TI static user fallback
    if (!user && email === 'ti@cartonificiovalinhos.com.br' && password === 'Carto123') {
       // TI user doesn't have 2FA required by default unless created and updated
       return NextResponse.json({ required: false });
    }

    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    if (!user.twoFactorRequired) {
      return NextResponse.json({ required: false });
    }

    if (user.twoFactorSecret) {
      return NextResponse.json({ required: true, setup: false });
    }

    // Need setup
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'Cartonificio Valinhos', secret);

    return NextResponse.json({ required: true, setup: true, secret, otpauth });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
