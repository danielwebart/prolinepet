"use client";

import { GestaoFintiCategoria, GestaoFintiFornecedor, GestaoFintiCentroCusto } from "@prisma/client";
import { createExpense } from "@/app/admin/modules/gestao-finti/despesas/actions";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";

interface ExpenseFormProps {
  categories: GestaoFintiCategoria[];
  suppliers: GestaoFintiFornecedor[];
  costCenters: GestaoFintiCentroCusto[];
  initialIsTi?: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors ml-auto"
    >
      <Save className="w-4 h-4" />
      {pending ? "Salvando..." : "Salvar Despesa"}
    </button>
  );
}

export function ExpenseForm({ categories, suppliers, costCenters, initialIsTi = false }: ExpenseFormProps) {
  const [type, setType] = useState<"RECURRING" | "OCCASIONAL">("RECURRING");
  const [isTi] = useState(initialIsTi);

  return (
    <form action={createExpense} className="space-y-8 bg-white p-6 rounded-lg shadow border border-slate-200">
      {/* Hidden input for isTi */}
      <input type="hidden" name="isTi" value={isTi ? "true" : "false"} />

      {/* Main Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <input
            type="text"
            name="description"
            required
            className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Ex: Assinatura Adobe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as "RECURRING" | "OCCASIONAL")}
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value="RECURRING">Recorrente (Mensal/Contrato)</option>
              <option value="OCCASIONAL">Eventual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Valor Total</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500">R$</span>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                required
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 pl-8 border"
                placeholder="0,00"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
            <select
              name="categoryId"
              required
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value="">Selecione...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fornecedor</label>
            <select
              name="supplierId"
              required
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value="">Selecione...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Centro de Custo</label>
            <select
              name="costCenterId"
              className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value="">Selecione (Opcional)...</option>
              {costCenters.map((cc) => (
                <option key={cc.id} value={cc.id}>{cc.nome}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Forma de Pagamento</label>
            <input
                type="text"
                name="paymentMethod"
                required
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Ex: Boleto, Cartão Corp..."
            />
        </div>

        {/* Condicional Fields */}
        {type === "RECURRING" ? (
          <div className="bg-slate-50 p-4 rounded-md space-y-4 border border-slate-100">
            <h3 className="font-medium text-slate-900">Detalhes de Recorrência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dia de Vencimento</label>
                <input
                  type="number"
                  name="dueDay"
                  min="1"
                  max="31"
                  required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data Início Contrato</label>
                <input
                  type="date"
                  name="contractStartDate"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim Contrato</label>
                <input
                  type="date"
                  name="contractEndDate"
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
               <div>
                  <label className="flex items-center gap-2 mt-6">
                      <input type="checkbox" name="active" value="true" defaultChecked className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                      <span className="text-sm font-medium text-slate-700">Contrato Ativo</span>
                  </label>
               </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-md space-y-4 border border-slate-100">
            <h3 className="font-medium text-slate-900">Detalhes da Compra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data da Compra</label>
                <input
                  type="date"
                  name="purchaseDate"
                  required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Qtd Parcelas</label>
                <input
                  type="number"
                  name="installments"
                  min="1"
                  defaultValue="1"
                  required
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>
        )}

        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
            <textarea
                name="observations"
                rows={3}
                className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            ></textarea>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
