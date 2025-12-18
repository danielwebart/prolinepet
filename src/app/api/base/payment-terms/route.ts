import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    
    // Fetch all and filter in memory for simplicity and support for partial code match
    // PaymentTerms are usually few in number
    const all = await prisma.paymentTerm.findMany({
      orderBy: { description: 'asc' }
    });
    
    let items = all;
    if (q) {
      items = all.filter(item => 
        item.description.toLowerCase().includes(q) || 
        (item.code !== null && String(item.code).includes(q))
      );
    }
    
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body.code !== undefined && body.code !== null ? Number(body.code) : null;
    const description = String(body.description || '').trim();
    const installments = body.installments !== undefined && body.installments !== null ? Number(body.installments) : 1;
    
    if (!description) return NextResponse.json({ error: 'Descrição é obrigatória' }, { status: 400 });

    const created = await prisma.paymentTerm.create({
      data: {
        code,
        description,
        installments
      }
    });
    
    return NextResponse.json(created);
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
