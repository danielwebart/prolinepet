"use client";

import { GestaoFintiCentroCusto } from "@prisma/client";
import { createAsset } from "@/app/admin/modules/gestao-finti/ativos/actions";
import { useFormStatus } from "react-dom";

interface AssetFormProps {
  costCenters: GestaoFintiCentroCusto[];
  isTi?: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Salvar Ativo"}
    </button>
  );
}

export function AssetForm({ costCenters, isTi }: AssetFormProps) {
  return (
    <form action={createAsset} className="space-y-6">
      <input type="hidden" name="isTi" value={isTi ? "true" : "false"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Nome do Ativo</label>
          <input
            type="text"
            name="nome"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Ex: Notebook Dell Latitude"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700">Valor de Aquisição</label>
           <div className="relative mt-1 rounded-md shadow-sm">
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
               <span className="text-gray-500 sm:text-sm">R$</span>
             </div>
             <input
               type="number"
               name="valorAquisicao"
               step="0.01"
               min="0"
               required
               className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
               placeholder="0.00"
             />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div>
          <label className="block text-sm font-medium text-slate-700">Descrição</label>
          <input
            type="text"
            name="descricao"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700">Centro de Custo</label>
           <select
             name="centroCustoId"
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
           >
             <option value="">Selecione...</option>
             {costCenters.map((cc) => (
               <option key={cc.id} value={cc.id}>
                 {cc.nome}
               </option>
             ))}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700">Marca</label>
          <input
            type="text"
            name="marca"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Modelo</label>
          <input
            type="text"
            name="modelo"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Número de Série</label>
          <input
            type="text"
            name="numeroSerie"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
           <label className="block text-sm font-medium text-slate-700">Data Aquisição</label>
           <input
             type="date"
             name="dataAquisicao"
             required
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700">Vida Útil (Meses)</label>
           <input
             type="number"
             name="vidaUtilMeses"
             defaultValue={60}
             required
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
           />
        </div>
         <div>
           <label className="block text-sm font-medium text-slate-700">Status</label>
           <select
             name="status"
             defaultValue="ATIVO"
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
           >
             <option value="ATIVO">Ativo</option>
             <option value="INATIVO">Inativo</option>
             <option value="MANUTENCAO">Manutenção</option>
             <option value="BAIXADO">Baixado</option>
           </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium text-slate-700">Localização</label>
           <input
             type="text"
             name="localizacao"
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
           />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700">Responsável</label>
           <input
             type="text"
             name="responsavel"
             className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
           />
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
