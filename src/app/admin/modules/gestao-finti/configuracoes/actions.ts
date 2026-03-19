"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createCategory(nome: string, isTi: boolean) {
  const session = await auth();
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const userId = Number((session?.user as any).id);

  await prisma.gestaoFintiCategoria.create({
    data: {
      nome,
      isTi,
      criadoPorId: userId,
      atualizadoPorId: userId,
    },
  });

  revalidatePath("/admin/modules/gestao-finti/configuracoes");
  revalidatePath("/admin/modules/gestao-finti/despesas/new");
}

export async function createSupplier(nome: string, documento: string, isTi: boolean) {
  const session = await auth();
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const userId = Number((session?.user as any).id);

  await prisma.gestaoFintiFornecedor.create({
    data: {
      nome,
      documento: documento || null,
      isTi,
      criadoPorId: userId,
      atualizadoPorId: userId,
    },
  });

  revalidatePath("/admin/modules/gestao-finti/configuracoes");
  revalidatePath("/admin/modules/gestao-finti/despesas/new");
}

export async function createCostCenter(nome: string, descricao: string) {
  const session = await auth();
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const userId = Number((session?.user as any).id);

  await prisma.gestaoFintiCentroCusto.create({
    data: {
      nome,
      descricao: descricao || null,
      criadoPorId: userId,
      atualizadoPorId: userId,
    },
  });

  revalidatePath("/admin/modules/gestao-finti/configuracoes");
  revalidatePath("/admin/modules/gestao-finti/despesas/new");
}
