import { getContracts } from "@/app/admin/modules/gestao-finti/contratos/actions";
import { format } from "date-fns";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const isTi = params.filter === "ti" ? true : undefined;
  const contracts = await getContracts(isTi);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Contratos e Recorrentes {isTi ? "(TI)" : ""}
        </h1>
        <Link
          href={`/admin/modules/gestao-finti/despesas/new?type=RECURRING${isTi ? "&isTi=true" : ""}`}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo Contrato
        </Link>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Fornecedor</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Valor Mensal</th>
                <th className="px-4 py-3 font-medium">Início</th>
                <th className="px-4 py-3 font-medium">Fim</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              ) : (
                contracts.map((contrato) => {
                  const isActive = contrato.ativoRecorrente;
                  const isExpired = contrato.dataFimContrato && new Date(contrato.dataFimContrato) < new Date();
                  
                  return (
                    <tr key={contrato.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {contrato.descricao}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {contrato.fornecedor?.nome || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                          {contrato.categoria?.nome || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(Number(contrato.valor))}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {contrato.dataInicioContrato
                          ? format(new Date(contrato.dataInicioContrato), "dd/MM/yyyy")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {contrato.dataFimContrato
                          ? format(new Date(contrato.dataFimContrato), "dd/MM/yyyy")
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {isExpired ? (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            Vencido
                          </span>
                        ) : isActive ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            Inativo
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
