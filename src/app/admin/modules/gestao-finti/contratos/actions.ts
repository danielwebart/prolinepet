"use server";

import { prisma } from "@/lib/prisma";

export async function getContracts(isTi?: boolean) {
  const where: any = {
    tipo: "RECORRENTE",
  };
  if (isTi !== undefined) {
    where.isTi = isTi;
  }

  return await prisma.gestaoFintiDespesa.findMany({
    where,
    include: {
      fornecedor: true,
      categoria: true,
    },
    orderBy: { descricao: 'asc' },
  });
}
