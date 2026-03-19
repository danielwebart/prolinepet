"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function getDashboardData() {
  const today = new Date();
  const startOfCurrentMonth = startOfMonth(today);
  const endOfCurrentMonth = endOfMonth(today);
  
  const startOfLastMonth = startOfMonth(subMonths(today, 1));
  const endOfLastMonth = endOfMonth(subMonths(today, 1));

  // 1. Total Fixed (Recurring) - Sum of all ACTIVE recurring expenses
  const recurringExpenses = await prisma.gestaoFintiDespesa.findMany({
    where: {
      tipo: "RECORRENTE",
      ativoRecorrente: true,
    },
  });
  const totalFixed = recurringExpenses.reduce((acc, curr) => acc + Number(curr.valor), 0);

  // 2. Occasional Expenses (Payments due this month)
  const occasionalPayments = await prisma.gestaoFintiParcela.findMany({
    where: {
      despesa: {
        tipo: "OCASIONAL",
      },
      dataVencimento: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth,
      },
    },
  });
  const totalOccasional = occasionalPayments.reduce((acc, curr) => acc + Number(curr.valor), 0);

  // 3. Total Current Month
  const totalMonth = totalFixed + totalOccasional;

  // 4. Last Month Comparison
  const lastMonthOccasionalPayments = await prisma.gestaoFintiParcela.findMany({
    where: {
      despesa: {
        tipo: "OCASIONAL",
      },
      dataVencimento: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  });
  const totalOccasionalLastMonth = lastMonthOccasionalPayments.reduce((acc, curr) => acc + Number(curr.valor), 0);
  const totalLastMonth = totalFixed + totalOccasionalLastMonth; // Assuming fixed was same

  // 5. Calculate Trend
  const trend = totalLastMonth === 0 ? 0 : ((totalMonth - totalLastMonth) / totalLastMonth) * 100;

  // 6. Annual Projection (Simple: Current Month * 12)
  const annualProjection = totalMonth * 12;

  // 7. Upcoming Payments (Next 5 - including overdue)
  const rawUpcomingPayments = await prisma.gestaoFintiParcela.findMany({
    where: {
      status: "PENDENTE",
    },
    include: {
      despesa: {
        include: {
          categoria: true,
          fornecedor: true,
        },
      },
    },
    orderBy: {
      dataVencimento: "asc",
    },
    take: 6,
  });

  const upcomingPayments = rawUpcomingPayments.map((payment) => ({
    ...payment,
    valor: Number(payment.valor),
    despesa: {
      ...payment.despesa,
      valor: Number(payment.despesa.valor),
      percentualReajuste: payment.despesa.percentualReajuste ? Number(payment.despesa.percentualReajuste) : null,
    },
  }));

  // 8. Alerts
  const overduePaymentsCount = await prisma.gestaoFintiParcela.count({
    where: {
      status: "PENDENTE",
      dataVencimento: { lt: today },
    },
  });

  return {
    totalFixed,
    totalOccasional,
    totalMonth,
    trend,
    annualProjection,
    upcomingPayments,
    overduePaymentsCount,
  };
}

export async function getChartData() {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const endOfYear = new Date(today.getFullYear(), 11, 31);

  const payments = await prisma.gestaoFintiParcela.findMany({
    where: {
      dataVencimento: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    include: {
      despesa: {
        include: {
          categoria: true,
        },
      },
    },
  });

  // Group by month
  const barData = Array.from({ length: 12 }, (_, i) => {
    const monthPayments = payments.filter((p) => p.dataVencimento.getMonth() === i);
    
    const fixed = monthPayments
      .filter((p) => p.despesa.tipo === "RECORRENTE")
      .reduce((acc, curr) => acc + Number(curr.valor), 0);

    const occasional = monthPayments
      .filter((p) => p.despesa.tipo === "OCASIONAL")
      .reduce((acc, curr) => acc + Number(curr.valor), 0);

    return {
      name: format(new Date(today.getFullYear(), i, 1), "MMM", { locale: ptBR }),
      fixed,
      occasional,
    };
  });

  // Group by Category (Top 5)
  const categoryMap = new Map<string, number>();
  payments.forEach((p) => {
    const catName = p.despesa.categoria.nome;
    const amount = Number(p.valor);
    categoryMap.set(catName, (categoryMap.get(catName) || 0) + amount);
  });

  const categoryData = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return {
    barData,
    categoryData: categoryData.map(d => ({ ...d, value: Number(d.value) })), // Ensure numbers
  };
}
