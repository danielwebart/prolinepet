import { getAssets } from "@/app/admin/modules/gestao-finti/ativos/actions";
import { format } from "date-fns";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const isTi = params.filter === "ti" ? true : undefined;
  const assets = await getAssets(isTi);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Ativos e Depreciação {isTi ? "(TI)" : ""}
        </h1>
        <Link
          href={`/admin/modules/gestao-finti/ativos/new${isTi ? "?isTi=true" : ""}`}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo Ativo
        </Link>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Nome do Ativo</th>
                <th className="px-4 py-3 font-medium">Centro de Custo</th>
                <th className="px-4 py-3 font-medium">Data Aquisição</th>
                <th className="px-4 py-3 font-medium">Valor Aquisição</th>
                <th className="px-4 py-3 font-medium">Vida Útil (meses)</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Nenhum ativo cadastrado.
                  </td>
                </tr>
              ) : (
                assets.map((ativo) => (
                  <tr key={ativo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {ativo.nome}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {ativo.centroCusto?.nome || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {ativo.dataAquisicao
                        ? format(new Date(ativo.dataAquisicao), "dd/MM/yyyy")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(ativo.valorAquisicao))}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {ativo.vidaUtilMeses}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          ativo.status === "ATIVO"
                            ? "bg-green-100 text-green-800"
                            : ativo.status === "INATIVO"
                            ? "bg-gray-100 text-gray-800"
                            : ativo.status === "MANUTENCAO"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ativo.status === "ATIVO"
                          ? "Ativo"
                          : ativo.status === "INATIVO"
                          ? "Inativo"
                          : ativo.status === "MANUTENCAO"
                          ? "Manutenção"
                          : "Baixado"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
