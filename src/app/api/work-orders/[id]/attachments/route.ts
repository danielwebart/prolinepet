import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const workOrderId = Number(params.id);
  const items = await prisma.attachment.findMany({ where: { workOrderId }, orderBy: { uploadedAt: 'desc' } });
  return NextResponse.json(items);
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const workOrderId = Number(params.id);
  const body = await request.json();
  const { fileName, url, mimeType } = body;
  if (!fileName || !url) {
    return NextResponse.json({ error: 'fileName e url são obrigatórios' }, { status: 400 });
  }
  const created = await prisma.attachment.create({
    data: { fileName, url, mimeType, workOrderId }
  });
  return NextResponse.json(created, { status: 201 });
}