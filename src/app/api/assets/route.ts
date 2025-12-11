import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// Normaliza textos com acentuação quebrada
function fixString(s: string | null | undefined): string | null {
  if (!s) return s ?? null;
  let t = String(s);
  try {
    t = Buffer.from(t, 'latin1').toString('utf8');
  } catch {}
  // Limpeza de artefatos comuns
  t = t
    .replace(/[\u0000-\u001F]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  // Substituições específicas observadas nos dados
  t = t
    .replace(/M�quina/g, 'Máquina')
    .replace(/MÃ¡quina/g, 'Máquina')
    .replace(/F�brica/g, 'Fábrica')
    .replace(/FÃ¡brica/g, 'Fábrica')
    .replace(/\bFabrica\b/g, 'Fábrica')
    .replace(/Produ��o/g, 'Produção')
    .replace(/ProduÃ§Ã£o/g, 'Produção')
    .replace(/El�trica/g, 'Elétrica')
    .replace(/El�trico/g, 'Elétrico')
    .replace(/ElÃ©trica/g, 'Elétrica')
    .replace(/ElÃ©trico/g, 'Elétrico')
    .replace(/m�dulo/g, 'módulo')
    .replace(/M�dulo/g, 'Módulo')
    .replace(/mÃ³dulo/g, 'módulo')
    .replace(/MÃ³dulo/g, 'Módulo')
    .replace(/Pr�-aquecedor/g, 'Pré-aquecedor')
    .replace(/Pr�-Aquecedor/g, 'Pré-Aquecedor')
    .replace(/PrÃ©-Aquecedor/g, 'Pré-Aquecedor')
    .replace(/ondulaï¿½ï¿½o/g, 'ondulação')
    .replace(/fabricaï¿½ï¿½o/g, 'fabricação')
    .replace(/alimentaï¿½ï¿½o/g, 'alimentação')
    .replace(/emenda e ondulaï¿½ï¿½o/g, 'emenda e ondulação')
    .replace(/Saï¿½da/g, 'Saída')
    .replace(/Prï¿½-/g, 'Pré-')
    .replace(/Painï¿½is/g, 'Painéis')
    // Casos restantes com caractere substituto
    .replace(/Servi�os/g, 'Serviços')
    .replace(/integra��o/g, 'integração')
    .replace(/V�lvulas/g, 'Válvulas')
    .replace(/Man�metros/g, 'Manômetros')
    .replace(/V�cuo/g, 'Vácuo')
    // Heurística comum
    .replace(/��o/g, 'ção');
  return t;
}

// Apenas normaliza quando existem artefatos visíveis de encoding quebrado
function normalizeIfBroken(s: string | null | undefined): string | null {
  if (!s) return s ?? null;
  const t = String(s);
  return /Ã|Â|��|ï¿½/.test(t) ? fixString(t) : t;
}

export async function GET() {
  const assets = await prisma.asset.findMany({ include: { workOrders: true } });
  const normalized = assets.map((a) => ({
    ...a,
    name: normalizeIfBroken(a.name),
    code: normalizeIfBroken(a.code),
    location: normalizeIfBroken(a.location),
    description: normalizeIfBroken(a.description),
    manufacturer: normalizeIfBroken(a.manufacturer),
    model: normalizeIfBroken(a.model),
  }));
  return NextResponse.json(normalized);
}

export async function POST(request: Request) {
  const body = await request.json();
  const created = await prisma.asset.create({ data: body });
  return NextResponse.json(created, { status: 201 });
}