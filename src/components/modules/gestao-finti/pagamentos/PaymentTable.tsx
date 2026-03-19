"use client";

import { formatCurrency } from "@/app/admin/modules/gestao-finti/utils";
import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { togglePaymentStatus } from "@/app/admin/modules/gestao-finti/pagamentos/actions";
import { useTransition } from "react";
import { GestaoFintiParcela, GestaoFintiDespesa, GestaoFintiCategoria, GestaoFintiFornecedor } from "@prisma/client";

type PaymentWithRelations = GestaoFintiParcela & {
  despesa: GestaoFintiDespesa & {
    categoria: GestaoFintiCategoria;
    fornecedor: GestaoFintiFornecedor;
  };
};

interface PaymentTableProps {
  payments: PaymentWithRelations[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggleStatus = (id: number, currentStatus: string) => {
    startTransition(async () => {
      await togglePaymentStatus(id, currentStatus);
    });
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        Nenhum pagamento encontrado.
      </div>
    );
  }

  const getStatusBadge = (payment: PaymentWithRelations) => {
    const isOverdue = payment.status === "PENDENTE" && isBefore(new Date(payment.dataVencimento), startOfDay(new Date()));

    if (payment.status === "PAGO") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <CheckCircle className="h-3 w-3" /> Pago
        </span>
      );
    }
    
    if (isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <AlertCircle className="h-3 w-3" /> Atrasado
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
        <Clock className="h-3 w-3" /> Pendente
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-6 py-3">Vencimento</th>
            <th className="px-6 py-3">Descrição</th>
            <th className="px-6 py-3">Categoria</th>
            <th className="px-6 py-3">Fornecedor</th>
            <th className="px-6 py-3">Valor</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Origem</th>
            <th className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(payment.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">{payment.despesa.descricao}</div>
                {payment.numeroParcela && (
                  <div className="text-xs text-slate-500">
                    Parcela {payment.numeroParcela}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">{payment.despesa.categoria.nome}</td>
              <td className="px-6 py-4">{payment.despesa.fornecedor.nome}</td>
              <td className="px-6 py-4 font-medium text-slate-900">
                {formatCurrency(Number(payment.valor))}
              </td>
              <td className="px-6 py-4">{getStatusBadge(payment)}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  payment.despesa.isTi 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-slate-100 text-slate-800"
                }`}>
                  {payment.despesa.isTi ? 'TI' : 'GLOBAL'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleStatus(payment.id, payment.status)}
                  disabled={isPending}
                  className="text-blue-600 hover:text-blue-900 font-medium disabled:opacity-50"
                >
                  {payment.status === "PENDENTE" ? "Baixar" : "Estornar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
