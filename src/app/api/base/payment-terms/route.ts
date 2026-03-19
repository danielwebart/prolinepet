import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

async function ensureClientPaymentTermsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "ClientPaymentTerm" (
      "id" SERIAL PRIMARY KEY,
      "clientId" INTEGER NOT NULL,
      "paymentTermId" INTEGER NOT NULL,
      "position" INTEGER DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT NOW(),
      "updatedAt" TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe('CREATE UNIQUE INDEX IF NOT EXISTS "ClientPaymentTerm_clientId_paymentTermId_key" ON "ClientPaymentTerm" ("clientId","paymentTermId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ClientPaymentTerm_clientId_idx" ON "ClientPaymentTerm" ("clientId")');
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "ClientPaymentTerm_paymentTermId_idx" ON "ClientPaymentTerm" ("paymentTermId")');
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim().toLowerCase();
    const clientIdParam = url.searchParams.get('clientId');
    const clientId = clientIdParam ? Number(clientIdParam) : null;

    if (clientIdParam) {
      if (!Number.isFinite(clientId) || (clientId as number) <= 0) return NextResponse.json([]);
      await ensureClientPaymentTermsTable();
      const links = await prisma.clientPaymentTerm.findMany({
        where: { clientId: clientId as number },
        include: { paymentTerm: true },
        orderBy: { position: 'asc' }
      });
      let all = links.map((l) => l.paymentTerm).filter(Boolean);
      if (all.length === 0) {
        const c = await prisma.client.findUnique({
          where: { id: clientId as number },
          select: { paymentTermId: true }
        }).catch(() => null);
        const fallbackId = c?.paymentTermId ? Number(c.paymentTermId) : null;
        if (fallbackId && Number.isFinite(fallbackId) && fallbackId > 0) {
          const term = await prisma.paymentTerm.findUnique({ where: { id: fallbackId } }).catch(() => null);
          if (term) {
            await prisma.clientPaymentTerm.createMany({
              data: [{ clientId: clientId as number, paymentTermId: term.id, position: 0 }],
              skipDuplicates: true
            }).catch(() => {});
            all = [term];
          }
        }
      }
      const items = q
        ? all.filter(item =>
            item.description.toLowerCase().includes(q) ||
            (item.code !== null && String(item.code).includes(q))
          )
        : all;
      return NextResponse.json(items);
    }
    
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
