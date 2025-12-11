import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

function esc(s: string | null | undefined) {
  return (s ?? '').replace(/'/g, "''");
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const activeEntityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    if (!activeEntityId) return NextResponse.json({ error: 'Entidade ativa não definida' }, { status: 400 });

    const body: any = await request.json().catch(() => ({}));

    // Inserir cabeçalho na tabela "Complaint" via SQL bruto para evitar necessidade de gerar client
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Complaint" (
        "code", "entityId", "createdById",
        "division", "type", "phase", "dueDate", "canceled", "cancelReason",
        "dateSac", "dateReceived",
        "counterpartyType", "counterpartyCode", "counterpartyName", "city", "uf",
        "contactName", "contactPhone", "contactEmail",
        "representativeName", "representativeEmail", "carrier", "freightType",
        "attendant", "reference", "classification", "occurrencePattern", "occurrenceCode", "occurrenceText",
        "createdAt", "updatedAt"
      ) VALUES (
        ${body.code ? `'${esc(body.code)}'` : 'NULL'}, ${Number(activeEntityId)}, ${uid},
        ${body.division ? `'${esc(body.division)}'` : 'NULL'}, ${body.type ? `'${esc(body.type)}'` : 'NULL'}, ${body.phase ? `'${esc(body.phase)}'` : 'NULL'}, ${body.dueDate ? `'${esc(body.dueDate)}'` : 'NULL'}, ${body.canceled ? 'TRUE' : 'FALSE'}, ${body.cancelReason ? `'${esc(body.cancelReason)}'` : 'NULL'},
        ${body.dateSac ? `'${esc(body.dateSac)}'` : 'NULL'}, ${body.dateReceived ? `'${esc(body.dateReceived)}'` : 'NULL'},
        ${body.counterpartyType ? `'${esc(body.counterpartyType)}'` : 'NULL'}, ${body.counterpartyCode ? `'${esc(body.counterpartyCode)}'` : 'NULL'}, ${body.counterpartyName ? `'${esc(body.counterpartyName)}'` : 'NULL'}, ${body.city ? `'${esc(body.city)}'` : 'NULL'}, ${body.uf ? `'${esc(body.uf)}'` : 'NULL'},
        ${body.contactName ? `'${esc(body.contactName)}'` : 'NULL'}, ${body.contactPhone ? `'${esc(body.contactPhone)}'` : 'NULL'}, ${body.contactEmail ? `'${esc(body.contactEmail)}'` : 'NULL'},
        ${body.representativeName ? `'${esc(body.representativeName)}'` : 'NULL'}, ${body.representativeEmail ? `'${esc(body.representativeEmail)}'` : 'NULL'}, ${body.carrier ? `'${esc(body.carrier)}'` : 'NULL'}, ${body.freightType ? `'${esc(body.freightType)}'` : 'NULL'},
        ${body.attendant ? `'${esc(body.attendant)}'` : 'NULL'}, ${body.reference ? `'${esc(body.reference)}'` : 'NULL'}, ${body.classification ? `'${esc(body.classification)}'` : 'NULL'}, ${body.occurrencePattern ? `'${esc(body.occurrencePattern)}'` : 'NULL'}, ${body.occurrenceCode ? `'${esc(body.occurrenceCode)}'` : 'NULL'}, ${body.occurrenceText ? `'${esc(body.occurrenceText)}'` : 'NULL'},
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `);

    const row: any[] = await prisma.$queryRawUnsafe(`
      SELECT "id" FROM "Complaint" ORDER BY "id" DESC LIMIT 1
    `);
    const complaintId = Number(row[0]?.id ?? 0);

    const items = Array.isArray(body.items) ? body.items : [];
    for (const it of items) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "ComplaintItem" (
          "complaintId", "invoiceNumber", "sft", "orderNumber", "spd", "emissionDate", "description", "uom",
          "unitPrice", "qtyInvoiced", "divergenceQty", "divergenceValue", "divergencePercent", "totalPercent"
        ) VALUES (
          ${complaintId},
          ${it.invoiceNumber ? `'${esc(it.invoiceNumber)}'` : 'NULL'}, ${it.sft ? `'${esc(it.sft)}'` : 'NULL'}, ${it.orderNumber ? `'${esc(it.orderNumber)}'` : 'NULL'}, ${it.spd ? `'${esc(it.spd)}'` : 'NULL'}, ${it.emissionDate ? `'${esc(it.emissionDate)}'` : 'NULL'}, ${it.description ? `'${esc(it.description)}'` : 'NULL'}, ${it.uom ? `'${esc(it.uom)}'` : 'NULL'},
          ${Number(it.unitPrice ?? 0)}, ${Number(it.qtyInvoiced ?? 0)}, ${Number(it.divergenceQty ?? 0)}, ${Number(it.divergenceValue ?? 0)}, ${Number(it.divergencePercent ?? 0)}, ${Number(it.totalPercent ?? 0)}
        )
      `);
    }

    return NextResponse.json({ ok: true, id: complaintId });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT
        c."id", c."code", c."counterpartyName", c."division", c."type", c."phase",
        c."dateSac", c."dateReceived", c."createdAt"
      FROM "Complaint" c
      ORDER BY c."id" DESC
      LIMIT 100
    `);
    return NextResponse.json({ ok: true, complaints: rows });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}