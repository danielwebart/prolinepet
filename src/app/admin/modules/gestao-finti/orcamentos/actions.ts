"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getCategories() {
  return await prisma.gestaoFintiCategoria.findMany({
    orderBy: { nome: 'asc' },
    where: { ativo: true }
  });
}

export async function getBudgets(year: number, month: number) {
  return await prisma.gestaoFintiOrcamento.findMany({
    where: {
      ano: year,
      mes: month,
    },
  });
}

export async function saveBudgets(year: number, month: number, items: { categoryId: number, amount: number }[]) {
  const session = await auth();
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const userId = Number((session?.user as any).id);

  for (const item of items) {
    await prisma.gestaoFintiOrcamento.upsert({
      where: {
        ano_mes_categoriaId: {
          ano: year,
          mes: month,
          categoriaId: item.categoryId,
        }
      },
      update: {
        valorPlanejado: item.amount,
        atualizadoPorId: userId,
      },
      create: {
        ano: year,
        mes: month,
        categoriaId: item.categoryId,
        valorPlanejado: item.amount,
        criadoPorId: userId,
        atualizadoPorId: userId,
      },
    });
  }

  revalidatePath("/admin/modules/gestao-finti/orcamentos");
}
