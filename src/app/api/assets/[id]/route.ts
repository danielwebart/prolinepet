import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Normaliza textos com acentuação quebrada (mesma lógica do /api/assets)
function fixString(s: string | null | undefined): string | null {
  if (!s) return s ?? null;
  let t = String(s);
  try { t = Buffer.from(t, 'latin1').toString('utf8'); } catch {}
  t = t.replace(/[\u0000-\u001F]/g, '').replace(/\s+/g, ' ').trim();
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
    .replace(/ElÃ©rica/g, 'Elétrica')
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
    .replace(/Painï¿½is/g, 'Painéis');
  return t;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const a = await prisma.asset.findUnique({ where: { id } });
  if (!a) return NextResponse.json(null);
  const asset = {
    ...a,
    name: fixString(a.name),
    code: fixString(a.code),
    location: fixString(a.location),
    description: fixString(a.description),
    manufacturer: fixString(a.manufacturer),
    model: fixString(a.model),
  };
  return NextResponse.json(asset);
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const data = await request.json();
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.code !== undefined) updateData.code = data.code || null;
  if (data.location !== undefined) updateData.location = data.location || null;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.manufacturer !== undefined) updateData.manufacturer = data.manufacturer || null;
  if (data.model !== undefined) updateData.model = data.model || null;
  if (data.year !== undefined) updateData.year = data.year ? Number(data.year) : null;
  if (data.criticality !== undefined) updateData.criticality = data.criticality || null;
  if (data.parentId !== undefined) updateData.parentId = data.parentId ? Number(data.parentId) : null;
  const updated = await prisma.asset.update({ where: { id }, data: updateData });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.asset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}