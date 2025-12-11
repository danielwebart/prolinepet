import { NextResponse } from 'next/server';
import { lookupCnpj } from '../../../lib/cnpj';

// GET /api/cnpj?cnpj=00000000000000
// Returns { name } when available; if not, returns { name: null } so UI can allow manual entry.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const cnpj = (url.searchParams.get('cnpj') || '').trim();
  if (!cnpj) return NextResponse.json({ error: 'cnpj ausente' }, { status: 400 });
  const res = await lookupCnpj(cnpj);
  if (!res) return NextResponse.json({ name: null });
  return NextResponse.json({
    name: res.name ?? null,
    logradouro: res.logradouro ?? null,
    numero: res.numero ?? null,
    bairro: res.bairro ?? null,
    cidade: res.cidade ?? null,
    estado: res.estado ?? null,
    cep: res.cep ?? null,
  });
}