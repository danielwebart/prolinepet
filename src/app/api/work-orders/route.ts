import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const assetIdParam = url.searchParams.get('assetId');
  const sectorParam = url.searchParams.get('sector');
  const fromParam = url.searchParams.get('from');
  const toParam = url.searchParams.get('to');
  const typeParam = url.searchParams.get('maintenanceType');
  const statusParam = url.searchParams.get('status');
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as string | undefined;
  const userId = session?.user ? Number((session.user as any).id) : undefined;
  const where: any = {};
  if (assetIdParam) {
    const assetId = Number(assetIdParam);
    if (!Number.isNaN(assetId)) where.assetId = assetId;
  }
  if (sectorParam) {
    where.sector = sectorParam;
  }
  if (typeParam) {
    where.maintenanceType = typeParam;
  }
  if (statusParam) {
    where.status = statusParam;
  }
  const scheduledFilter: any = {};
  if (fromParam) {
    const d = new Date(fromParam);
    if (!Number.isNaN(d.getTime())) scheduledFilter.gte = d;
  }
  if (toParam) {
    const d = new Date(toParam);
    if (!Number.isNaN(d.getTime())) scheduledFilter.lte = d;
  }
  if (scheduledFilter.gte || scheduledFilter.lte) {
    where.scheduledAt = scheduledFilter;
  }
  // Restrições de visualização para Técnico
  if (role === 'TECH') {
    if (where.assetId) {
      // No contexto de histórico por ativo: técnico vê apenas encerradas, e quaisquer atribuídas a ele
      const data = await prisma.workOrder.findMany({
        where: {
          AND: [
            { assetId: where.assetId },
            sectorParam ? ({ sector: sectorParam } as any) : {},
            typeParam ? ({ maintenanceType: typeParam } as any) : {},
            statusParam ? { status: statusParam } : {},
            scheduledFilter.gte || scheduledFilter.lte ? ({ scheduledAt: scheduledFilter } as any) : {},
          ],
          OR: [
            { status: 'CLOSED' },
            userId ? ({ assignedUserId: userId } as any) : ({ assignedUserId: -1 } as any),
          ],
        },
        include: { asset: true, attachments: true },
        orderBy: { id: 'asc' },
      });
      return NextResponse.json(data);
    } else {
      // Sem assetId: técnico só vê OS atribuídas a ele
      const data = await prisma.workOrder.findMany({
        where: {
          AND: [
            userId ? ({ assignedUserId: userId } as any) : ({ assignedUserId: -1 } as any),
            sectorParam ? ({ sector: sectorParam } as any) : {},
            typeParam ? ({ maintenanceType: typeParam } as any) : {},
            statusParam ? { status: statusParam } : {},
            scheduledFilter.gte || scheduledFilter.lte ? ({ scheduledAt: scheduledFilter } as any) : {},
          ],
        },
        include: { asset: true, attachments: true },
        orderBy: { id: 'asc' },
      });
      return NextResponse.json(data);
    }
  }
  const data = await prisma.workOrder.findMany({ where, include: { asset: true, attachments: true }, orderBy: { id: 'asc' } });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
  const body = await request.json();
  const {
      title,
      status,
      assetId,
      rootAssetId,
      description,
      materials,
      scheduledAt,
      sector,
      maintenanceType,
      assignedUserId,
      openedAt,
      assetCondition,
      personnelCount,
      estimatedDurationMinutes,
      tasks,
    } = body;

    // Validações mínimas
    if (!title || String(title).trim().length === 0) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
    }

    // Normalizações de tipos
    const scheduledAtValue: Date | undefined = (() => {
      if (!scheduledAt) return undefined;
      const d = new Date(scheduledAt);
      return Number.isNaN(d.getTime()) ? undefined : d;
    })();
    const openedAtValue: Date | undefined = (() => {
      if (openedAt) {
        const d = new Date(openedAt);
        if (!Number.isNaN(d.getTime())) return d;
      }
      return new Date();
    })();
    const assetIdNum = assetId !== undefined && assetId !== null ? Number(assetId) : undefined;
    const assignedUserIdNum = assignedUserId !== undefined && assignedUserId !== null ? Number(assignedUserId) : undefined;
    const rootAssetIdNum = rootAssetId !== undefined && rootAssetId !== null ? Number(rootAssetId) : undefined;
    const personnelCountNum = personnelCount !== undefined && personnelCount !== null ? Number(personnelCount) : undefined;
    const estimatedDurationNum = estimatedDurationMinutes !== undefined && estimatedDurationMinutes !== null ? Number(estimatedDurationMinutes) : undefined;

    // Normalizar tasks: aceitar array de strings ou string simples
    const tasksString: string | null | undefined = (() => {
      if (Array.isArray(tasks)) {
        const clean = tasks.map((t: any) => String(t).trim()).filter(Boolean);
        return clean.length ? clean.join('\n') : null;
      }
      if (typeof tasks === 'string') {
        const s = tasks.trim();
        return s.length ? s : null;
      }
      return null;
    })();

    const createData: any = {
      title: String(title),
      status: status || 'OPEN',
      description: description ?? null,
      materials: materials ?? null,
      scheduledAt: scheduledAtValue,
      sector: sector ?? null,
      maintenanceType: maintenanceType ?? null,
      openedAt: openedAtValue,
      assetCondition: assetCondition ?? null,
      personnelCount: personnelCountNum ?? null,
      estimatedDurationMinutes: estimatedDurationNum ?? null,
      tasks: tasksString ?? null,
    };

    // Defesa: remover quaisquer chaves indevidas vindas do body
    if ('assetId' in createData) delete (createData as any).assetId;

    // Conectar relações explicitamente para compatibilidade com diferentes gerações do client
    if (assetIdNum && !Number.isNaN(assetIdNum)) {
      createData.asset = { connect: { id: assetIdNum } };
    }
    // Não incluir assignedUserId/rootAssetId no create inicialmente para evitar validação do client
    // Caso venham no body, aplicaremos via SQL após a criação bem-sucedida.

    // Log do payload final para diagnóstico
    console.log('POST /api/work-orders payload:', createData);

    // Tentativa resiliente: remove chaves inválidas reportadas pelo Prisma e re‑tenta
    const maxRetries = 6;
    let attempt = 0;
    while (true) {
      try {
        const created = await prisma.workOrder.create({ data: createData });
        // Pós-criação: aplicar campos que o Prisma Client atual não reconhece
        try {
          if (assignedUserIdNum && !Number.isNaN(assignedUserIdNum)) {
            await prisma.$executeRawUnsafe(
              'UPDATE "WorkOrder" SET "assignedUserId"=? WHERE "id"=?',
              assignedUserIdNum,
              (created as any).id
            );
          }
          if (rootAssetIdNum !== undefined && rootAssetIdNum !== null && !Number.isNaN(rootAssetIdNum)) {
            await prisma.$executeRawUnsafe(
              'UPDATE "WorkOrder" SET "rootAssetId"=? WHERE "id"=?',
              rootAssetIdNum,
              (created as any).id
            );
          }
        } catch (postErr: any) {
          console.warn('Falha ao aplicar campos pós-criação:', String(postErr?.message || postErr));
        }
        // Retornar registro atualizado
        const refreshed = await prisma.workOrder.findUnique({ where: { id: (created as any).id } });
        return NextResponse.json(refreshed ?? created, { status: 201 });
      } catch (errAny: any) {
        const msg = String(errAny?.message || errAny);
        const m = msg.match(/Unknown argument `([^`]+)`/);
        if (m && attempt < maxRetries) {
          const badKey = m[1];
          if (badKey in createData) {
            console.warn('Removendo argumento inválido do create:', badKey);
            delete (createData as any)[badKey];
            attempt++;
            continue; // re‑tenta
          }
          // Argumento inválido pode ser de relação; remova o bloco relacional
          if (badKey === 'asset') {
            // remove relação e tenta via FK direta, se disponível
            delete (createData as any).asset;
            if (assetIdNum && !Number.isNaN(assetIdNum)) {
              (createData as any).assetId = assetIdNum;
            }
            attempt++;
            continue;
          }
          if (badKey === 'assignedUserId' || badKey === 'assignedTo' || badKey === 'rootAssetId') {
            // remover qualquer campo de atribuição/raiz desconhecido e re‑tentar
            delete (createData as any).assignedUserId;
            delete (createData as any).assignedTo;
            delete (createData as any).rootAssetId;
            attempt++;
            continue;
          }
        }
        // Não foi possível corrigir; propague erro
        console.error('Erro ao criar OS (final):', errAny);
        return NextResponse.json({ error: msg }, { status: 500 });
      }
    }
  } catch (err: any) {
    console.error('Erro ao criar OS:', err);
    const message = String(err?.message || err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}