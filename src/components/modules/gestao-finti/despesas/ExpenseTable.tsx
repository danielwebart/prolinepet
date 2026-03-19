"use client";

import { formatCurrency } from "@/app/admin/modules/gestao-finti/utils";
import { useTransition } from "react";
import { GestaoFintiDespesa, GestaoFintiCategoria, GestaoFintiFornecedor } from "@prisma/client";
import { deleteExpense } from "@/app/admin/modules/gestao-finti/despesas/actions";

type ExpenseWithRelations = GestaoFintiDespesa & {
  categoria: GestaoFintiCategoria;
  fornecedor: GestaoFintiFornecedor;
};

interface ExpenseTableProps {
  expenses: ExpenseWithRelations[];
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
        startTransition(async () => {
            await deleteExpense(id);
        });
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        Nenhuma despesa cadastrada.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-6 py-3">Descrição</th>
            <th className="px-6 py-3">Tipo</th>
            <th className="px-6 py-3">Categoria</th>
            <th className="px-6 py-3">Fornecedor</th>
            <th className="px-6 py-3">Valor</th>
            <th className="px-6 py-3">Origem</th>
            <th className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">
                {expense.descricao}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  expense.tipo === "RECORRENTE" 
                    ? "bg-blue-100 text-blue-800" 
                    : "bg-purple-100 text-purple-800"
                }`}>
                  {expense.tipo === "RECORRENTE" ? "Recorrente" : "Eventual"}
                </span>
              </td>
              <td className="px-6 py-4">{expense.categoria.nome}</td>
              <td className="px-6 py-4">{expense.fornecedor.nome}</td>
              <td className="px-6 py-4 font-medium text-slate-900">
                {formatCurrency(Number(expense.valor))}
              </td>
              <td className="px-6 py-4">
                 <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  expense.isTi 
                    ? "bg-indigo-100 text-indigo-800" 
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {expense.isTi ? 'TI' : 'GLOBAL'}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(expense.id)}
                  disabled={isPending}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  {isPending ? "Excluindo..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
