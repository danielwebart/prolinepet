import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

function toDateOrNull(v: any): Date | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const activeEntityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!activeEntityId) return NextResponse.json({ error: 'Entidade ativa não definida' }, { status: 400 });

    const body: any = await request.json().catch(() => ({}));
    const items = Array.isArray(body.items) ? body.items : [];
    const created = await prisma.complaint.create({
      data: {
        code: body.code ? String(body.code) : null,
        entityId: Number(activeEntityId),
        createdById: uid,
        division: body.division ? String(body.division) : null,
        type: body.type ? String(body.type) : null,
        phase: body.phase ? String(body.phase) : null,
        dueDate: toDateOrNull(body.dueDate),
        canceled: Boolean(body.canceled),
        cancelReason: body.cancelReason ? String(body.cancelReason) : null,
        dateSac: toDateOrNull(body.dateSac),
        dateReceived: toDateOrNull(body.dateReceived),
        counterpartyType: body.counterpartyType ? String(body.counterpartyType) : null,
        counterpartyCode: body.counterpartyCode ? String(body.counterpartyCode) : null,
        counterpartyName: body.counterpartyName ? String(body.counterpartyName) : null,
        city: body.city ? String(body.city) : null,
        uf: body.uf ? String(body.uf) : null,
        contactName: body.contactName ? String(body.contactName) : null,
        contactPhone: body.contactPhone ? String(body.contactPhone) : null,
        contactEmail: body.contactEmail ? String(body.contactEmail) : null,
        representativeName: body.representativeName ? String(body.representativeName) : null,
        representativeEmail: body.representativeEmail ? String(body.representativeEmail) : null,
        carrier: body.carrier ? String(body.carrier) : null,
        freightType: body.freightType ? String(body.freightType) : null,
        attendant: body.attendant ? String(body.attendant) : null,
        reference: body.reference ? String(body.reference) : null,
        classification: body.classification ? String(body.classification) : null,
        occurrencePattern: body.occurrencePattern ? String(body.occurrencePattern) : null,
        occurrenceCode: body.occurrenceCode ? String(body.occurrenceCode) : null,
        occurrenceText: body.occurrenceText ? String(body.occurrenceText) : null,
        items: items.length
          ? {
              createMany: {
                data: items.map((it: any) => ({
                  invoiceNumber: it.invoiceNumber ? String(it.invoiceNumber) : null,
                  sft: it.sft ? String(it.sft) : null,
                  orderNumber: it.orderNumber ? String(it.orderNumber) : null,
                  spd: it.spd ? String(it.spd) : null,
                  emissionDate: toDateOrNull(it.emissionDate),
                  description: it.description ? String(it.description) : null,
                  uom: it.uom ? String(it.uom) : null,
                  unitPrice: Number(it.unitPrice ?? 0),
                  qtyInvoiced: Number(it.qtyInvoiced ?? 0),
                  divergenceQty: Number(it.divergenceQty ?? 0),
                  divergenceValue: Number(it.divergenceValue ?? 0),
                  divergencePercent: Number(it.divergencePercent ?? 0),
                  totalPercent: Number(it.totalPercent ?? 0),
                })),
              },
            }
          : undefined,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const complaints = await prisma.complaint.findMany({
      take: 100,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        code: true,
        counterpartyName: true,
        division: true,
        type: true,
        phase: true,
        dateSac: true,
        dateReceived: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ ok: true, complaints });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
