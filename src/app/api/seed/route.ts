import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcrypt';

export async function POST() {
  const exists = await prisma.user.findFirst();
  if (exists) return NextResponse.json({ ok: true, message: 'Já existe usuário' });
  const password = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({ data: { email: 'admin@empresa.com', name: 'Admin', password } });
  return NextResponse.json({ ok: true, admin });
}