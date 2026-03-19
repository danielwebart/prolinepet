"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getAssets(isTi?: boolean) {
  const where: any = {};
  if (isTi !== undefined) {
    where.isTi = isTi;
  }
  
  return await prisma.gestaoFintiAtivo.findMany({
    where,
    include: {
      centroCusto: true,
    },
    orderBy: { nome: 'asc' },
  });
}

export async function getCostCenters() {
  return await prisma.gestaoFintiCentroCusto.findMany({
    where: { ativo: true },
    orderBy: { nome: 'asc' },
  });
}

export async function createAsset(formData: FormData) {
  const session = await auth();
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const userId = Number((session?.user as any).id);

  const nome = formData.get("nome") as string;
  const valorAquisicao = formData.get("valorAquisicao") ? parseFloat(formData.get("valorAquisicao") as string) : 0;
  const dataAquisicao = new Date(formData.get("dataAquisicao") as string);
  const vidaUtilMeses = formData.get("vidaUtilMeses") ? parseInt(formData.get("vidaUtilMeses") as string) : 0;
  const centroCustoId = formData.get("centroCustoId") ? Number(formData.get("centroCustoId")) : null;
  const isTi = formData.get("isTi") === "true";
  
  // Optional fields
  const descricao = formData.get("descricao") as string || null;
  const numeroSerie = formData.get("numeroSerie") as string || null;
  const modelo = formData.get("modelo") as string || null;
  const marca = formData.get("marca") as string || null;
  const localizacao = formData.get("localizacao") as string || null;
  const responsavel = formData.get("responsavel") as string || null;

  await prisma.gestaoFintiAtivo.create({
    data: {
      nome,
      valorAquisicao,
      dataAquisicao,
      vidaUtilMeses,
      centroCustoId,
      isTi,
      descricao,
      numeroSerie,
      modelo,
      marca,
      localizacao,
      responsavel,
      status: "ATIVO",
      criadoPorId: userId,
      atualizadoPorId: userId,
    },
  });

  revalidatePath("/admin/modules/gestao-finti/ativos");
  redirect("/admin/modules/gestao-finti/ativos");
}
