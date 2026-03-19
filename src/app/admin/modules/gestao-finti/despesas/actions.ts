"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { addMonths, setDate, isAfter, startOfDay } from "date-fns";
import { auth } from "@/lib/auth";

// --- EXPENSES ---

const expenseSchema = z.object({
  descricao: z.string().min(3, "Descrição é obrigatória"),
  tipo: z.enum(["RECORRENTE", "OCASIONAL"]),
  valor: z.coerce.number().min(0.01, "Valor deve ser maior que zero"),
  categoriaId: z.coerce.number().min(1, "Categoria é obrigatória"),
  fornecedorId: z.coerce.number().min(1, "Fornecedor é obrigatório"),
  centroCustoId: z.coerce.number().optional(),
  formaPagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  diaVencimento: z.coerce.number().min(1).max(31).optional(),
  qtdParcelas: z.coerce.number().min(1).optional(),
  dataCompra: z.string().optional(),
  isTi: z.coerce.boolean().optional(),
  // Contract fields
  dataInicioContrato: z.string().optional(),
  dataFimContrato: z.string().optional(),
  indiceReajuste: z.string().optional(),
  percentualReajuste: z.coerce.number().optional(),
  ativoRecorrente: z.coerce.boolean().optional(),
  observacoes: z.string().optional(),
});

export async function createExpense(formData: FormData) {
  const session = await auth();
  if (!(session?.user as any)?.id) {
    throw new Error("Usuário não autenticado");
  }
  const userId = Number((session?.user as any).id);

  const rawData = {
    descricao: formData.get("description"),
    tipo: formData.get("type") === "RECURRING" ? "RECORRENTE" : "OCASIONAL", // Map types
    valor: formData.get("amount"),
    categoriaId: formData.get("categoryId"),
    fornecedorId: formData.get("supplierId"),
    centroCustoId: formData.get("costCenterId") || undefined,
    formaPagamento: formData.get("paymentMethod"),
    diaVencimento: formData.get("dueDay") || undefined,
    qtdParcelas: formData.get("installments") || undefined,
    dataCompra: formData.get("purchaseDate") || undefined,
    isTi: formData.get("isTi") === "true",
    dataInicioContrato: formData.get("contractStartDate") || undefined,
    dataFimContrato: formData.get("contractEndDate") || undefined,
    indiceReajuste: formData.get("readjustmentIndex") || undefined,
    percentualReajuste: formData.get("readjustmentRate") || undefined,
    ativoRecorrente: formData.get("active") === "true",
    observacoes: formData.get("observations") || undefined,
  };

  const validatedData = expenseSchema.parse(rawData);
  const { tipo, valor, qtdParcelas = 1, dataCompra, diaVencimento } = validatedData;

  await prisma.$transaction(async (tx) => {
    // 1. Create Expense
    const expenseData: any = {
      descricao: validatedData.descricao,
      tipo: validatedData.tipo,
      valor: validatedData.valor,
      categoriaId: validatedData.categoriaId,
      fornecedorId: validatedData.fornecedorId,
      formaPagamento: validatedData.formaPagamento,
      isTi: validatedData.isTi || false,
      ativoRecorrente: validatedData.ativoRecorrente !== undefined ? validatedData.ativoRecorrente : true,
      observacoes: validatedData.observacoes,
      criadoPorId: userId,
      atualizadoPorId: userId,
    };

    if (validatedData.centroCustoId) {
      expenseData.centroCustoId = validatedData.centroCustoId;
    }

    if (validatedData.diaVencimento) expenseData.diaVencimento = validatedData.diaVencimento;
    if (validatedData.qtdParcelas) expenseData.qtdParcelas = validatedData.qtdParcelas;
    if (validatedData.dataCompra) expenseData.dataCompra = new Date(validatedData.dataCompra);
    if (validatedData.dataInicioContrato) expenseData.dataInicioContrato = new Date(validatedData.dataInicioContrato);
    if (validatedData.dataFimContrato) expenseData.dataFimContrato = new Date(validatedData.dataFimContrato);
    if (validatedData.indiceReajuste) expenseData.indiceReajuste = validatedData.indiceReajuste;
    if (validatedData.percentualReajuste) expenseData.percentualReajuste = validatedData.percentualReajuste;

    const expense = await tx.gestaoFintiDespesa.create({
      data: expenseData
    });

    // 2. Generate Payments (Parcelas)
    if (tipo === "OCASIONAL" && dataCompra) {
        const pDate = new Date(dataCompra);
        const installmentAmount = Number((valor / (qtdParcelas || 1)).toFixed(2));

        for (let i = 0; i < (qtdParcelas || 1); i++) {
          const dueDate = addMonths(pDate, i);

          await tx.gestaoFintiParcela.create({
            data: {
              despesaId: expense.id,
              valor: installmentAmount,
              dataVencimento: dueDate,
              numeroParcela: i + 1,
              status: "PENDENTE",
              mesCompetencia: dueDate.getMonth() + 1,
              anoCompetencia: dueDate.getFullYear(),
              criadoPorId: userId,
              atualizadoPorId: userId,
            },
          });
        }
      } else if (tipo === "RECORRENTE" && diaVencimento) {
        // Create ONE payment for the NEXT due date
        const today = startOfDay(dataCompra ? new Date(dataCompra) : new Date());
        let nextDue = setDate(today, diaVencimento);

        // If today is past the due day, move to next month
        if (isAfter(today, nextDue)) {
          nextDue = addMonths(nextDue, 1);
        }

        await tx.gestaoFintiParcela.create({
          data: {
            despesaId: expense.id,
            valor: valor,
            dataVencimento: nextDue,
            status: "PENDENTE",
            mesCompetencia: nextDue.getMonth() + 1,
            anoCompetencia: nextDue.getFullYear(),
            criadoPorId: userId,
            atualizadoPorId: userId,
          },
        });
      }
  });

  revalidatePath("/admin/modules/gestao-finti/despesas");
  redirect("/admin/modules/gestao-finti/despesas");
}

export async function deleteExpense(id: number) {
    const session = await auth();
    if (!(session?.user as any)?.id) throw new Error("Unauthorized");
    
    await prisma.gestaoFintiDespesa.delete({
        where: { id }
    });
    
    revalidatePath("/admin/modules/gestao-finti/despesas");
}
