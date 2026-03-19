"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function togglePaymentStatus(id: number, currentStatus: string) {
  const session = await auth();
  if (!(session?.user as any)?.id) throw new Error("Unauthorized");
  const userId = Number((session?.user as any).id);

  const newStatus = currentStatus === "PENDENTE" ? "PAGO" : "PENDENTE";
  const dataPagamento = newStatus === "PAGO" ? new Date() : null;

  await prisma.gestaoFintiParcela.update({
    where: { id },
    data: {
      status: newStatus,
      dataPagamento,
      atualizadoPorId: userId,
    },
  });

  revalidatePath("/admin/modules/gestao-finti/pagamentos");
}
