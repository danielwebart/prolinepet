"use client";
import { useEffect, useMemo, useState } from "react";

type Filters = { status: string; from?: string; to?: string };

function exportCSV(rows: any[], filename = "relatorio.csv") {
  const headers = Object.keys(rows[0] || { id: "", title: "", status: "" });
  const csv = [headers.join(",")]
    .concat(rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ status: "" });

  useEffect(() => {
    setLoading(true);
    fetch("/api/work-orders")
      .then((r) => r.json())
      .then((wo) => setData(wo))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return data.filter((w) => {
      if (filters.status && w.status !== filters.status) return false;
      if (filters.from && new Date(w.createdAt) < new Date(filters.from)) return false;
      if (filters.to && new Date(w.createdAt) > new Date(filters.to)) return false;
      return true;
    });
  }, [data, filters]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Relatórios</h1>
        <p className="text-gray-600">Filtre e exporte dados de manutenção.</p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-2">Filtros</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select className="border rounded px-3 py-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Todos os status</option>
            <option value="OPEN">Abertas</option>
            <option value="IN_PROGRESS">Em andamento</option>
            <option value="COMPLETED">Concluídas</option>
            <option value="CLOSED">Encerradas</option>
          </select>
          <input className="border rounded px-3 py-2" type="date" value={filters.from ?? ""} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
          <input className="border rounded px-3 py-2" type="date" value={filters.to ?? ""} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-800 text-white rounded" onClick={() => window.print()}>Imprimir</button>
            <button className="px-4 py-2 bg-gray-100 rounded" onClick={() => exportCSV(filtered)}>Exportar CSV</button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-2">Resultados</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2 border-b">ID</th>
                <th className="p-2 border-b">Título</th>
                <th className="p-2 border-b">Status</th>
                <th className="p-2 border-b">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <tr key={w.id} className="border-b">
                  <td className="p-2">{w.id}</td>
                  <td className="p-2">{w.title}</td>
                  <td className="p-2">{w.status}</td>
                  <td className="p-2">{new Date(w.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={4} className="p-2 text-gray-500">Carregando...</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-2 text-gray-500">Nenhum resultado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}