"use client";
import { useEffect, useState } from "react";

type WorkOrder = {
  id: number;
  title: string;
  status: string;
  maintenanceType?: string;
  sector?: string;
  scheduledAt?: string;
  code?: string;
};

const columns = [
  { key: "OPEN", title: "Solicitada / Aberta" },
  { key: "IN_PROGRESS", title: "Em andamento" },
  { key: "COMPLETED", title: "Concluída" },
  { key: "CLOSED", title: "Encerrada" },
];

export default function KanbanBoard() {
  const [data, setData] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/work-orders")
      .then((r) => r.json())
      .then((wo) => setData(wo))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/work-orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const grouped: Record<string, WorkOrder[]> = {};
  columns.forEach((c) => (grouped[c.key] = []));
  data.forEach((w) => {
    if (!grouped[w.status]) grouped[w.status] = [];
    grouped[w.status].push(w);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {columns.map((col) => (
        <div key={col.key} className="bg-white rounded shadow p-3">
          <div className="font-semibold mb-2">{col.title}</div>
          <div className="space-y-2">
            {(grouped[col.key] ?? []).map((w) => (
              <div key={w.id} className="border rounded p-2">
                <div className="text-sm font-medium">#{w.code || w.id} - {w.title}</div>
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-700">
                  {w.maintenanceType && (
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-300">{w.maintenanceType}</span>
                  )}
                  {w.sector && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">{w.sector}</span>
                  )}
                  {w.scheduledAt && (
                    <span className="px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 border border-yellow-200">
                      {new Date(w.scheduledAt).toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {columns
                    .filter((c) => c.key !== w.status)
                    .map((c) => (
                      <button
                        key={c.key}
                        onClick={() => updateStatus(w.id, c.key)}
                        className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                      >
                        Mover para {c.title.split(" ")[0]}
                      </button>
                    ))}
              </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Carregando...</div>}
            {!loading && (grouped[col.key]?.length ?? 0) === 0 && (
              <div className="text-sm text-gray-500">Sem itens</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}