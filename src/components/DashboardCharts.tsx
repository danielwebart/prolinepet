"use client";
import { useEffect, useMemo, useState } from "react";

type WorkOrder = {
  id: number;
  status: string;
  sector?: string | null;
  maintenanceType?: string | null;
  startedAt?: string | null;
  closedAt?: string | null;
  mttr?: number | null;
  maintainedComponents?: any;
  asset?: { id: number; name: string } | null;
};

function formatMinutes(total: number) {
  if (!Number.isFinite(total) || total <= 0) return "-";
  if (total < 60) return `${Math.round(total)} min`;
  const h = Math.floor(total / 60);
  const m = Math.round(total % 60);
  return `${h}h ${m}m`;
}

export default function DashboardCharts() {
  const [wo, setWo] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/work-orders")
      .then(async (r) => {
        if (!r.ok) {
          // Tolerar respostas com erro e sem JSON
          const txt = await r.text().catch(() => "");
          throw new Error(txt || `HTTP ${r.status}`);
        }
        // Evitar falha quando o corpo vem vazio (ex.: 204)
        const txt = await r.text().catch(() => "");
        if (!txt) return [];
        try {
          return JSON.parse(txt);
        } catch {
          return [];
        }
      })
      .then((data) => setWo(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.warn("Falha ao carregar OS para gráficos:", err);
        setWo([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const sectorCounts = useMemo(() => {
    const map = new Map<string, number>();
    wo.forEach((w) => {
      const key = (w.sector || "Sem setor") as string;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [wo]);

  const typeCounts = useMemo(() => {
    const map = new Map<string, number>();
    wo.forEach((w) => {
      const key = (w.maintenanceType || "Sem tipo") as string;
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
  }, [wo]);

  const avgMttr = useMemo(() => {
    let sum = 0;
    let count = 0;
    wo.forEach((w) => {
      if (typeof w.mttr === "number") {
        sum += w.mttr;
        count++;
        return;
      }
      if (w.startedAt && w.closedAt) {
        const s = new Date(w.startedAt).getTime();
        const c = new Date(w.closedAt).getTime();
        const diff = Math.round((c - s) / 60000);
        if (diff > 0) {
          sum += diff;
          count++;
        }
      }
    });
    return count ? sum / count : 0;
  }, [wo]);

  const assetRanking = useMemo(() => {
    const map = new Map<string, number>();
    wo.forEach((w) => {
      const name = w.asset?.name || "Sem equipamento";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [wo]);

  const componentRanking = useMemo(() => {
    const map = new Map<string, number>();
    wo.forEach((w) => {
      const comp = w.maintainedComponents;
      if (!comp) return;
      let arr: any[] = [];
      if (Array.isArray(comp)) {
        arr = comp;
      } else if (typeof comp === "string") {
        // Parse quando armazenado como JSON serializado em String
        try {
          const parsed = JSON.parse(comp);
          if (Array.isArray(parsed)) arr = parsed;
        } catch {}
      }
      arr.forEach((c: any) => {
        const name = typeof c === "string" ? c : c?.name ?? JSON.stringify(c);
        if (!name) return;
        map.set(name, (map.get(name) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [wo]);

  const palette = [
    "#2563eb",
    "#f59e0b",
    "#10b981",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#f97316",
    "#22c55e",
  ];

  const Pie = ({ data }: { data: Array<{ label: string; value: number }> }) => {
    const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
    let current = 0;
    const segments = data.map((d, i) => {
      const start = (current / total) * 100;
      const end = ((current + d.value) / total) * 100;
      current += d.value;
      const color = palette[i % palette.length];
      return `${color} ${start}% ${end}%`;
    });
    const gradient = `conic-gradient(${segments.join(", ")})`;
    return (
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 rounded-full" style={{ background: gradient }} />
        <div className="space-y-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-3 h-3 rounded" style={{ background: palette[i % palette.length] }} />
              <span className="w-40 truncate">{d.label}</span>
              <span className="text-gray-600">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Bar = ({ label, value, max, color }: { label: string; value: number; max: number; color: string }) => (
    <div>
      <div className="flex items-center gap-2">
        <div className="text-sm w-40 truncate" title={label}>{label}</div>
        <div className="flex-1 bg-gray-200 h-3 rounded">
          <div className="h-3 rounded" style={{ width: `${(value / (max || 1)) * 100}%`, background: color }} />
        </div>
        <div className="text-sm w-10 text-right">{value}</div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="bg-white shadow rounded p-4 text-sm text-gray-500">Carregando dados...</div>;
  }

  const maxType = Math.max(...typeCounts.map((d) => d.value), 1);
  const maxAsset = Math.max(...assetRanking.map((d) => d.value), 1);
  const maxComp = Math.max(...componentRanking.map((d) => d.value), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-2">Gráfico de pizza (Setor)</div>
        <Pie data={sectorCounts} />
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-2">Gráfico de barras (Tipo de manutenção)</div>
        <div className="space-y-2">
          {typeCounts.map((d, i) => (
            <Bar key={i} label={d.label} value={d.value} max={maxType} color={palette[i % palette.length]} />
          ))}
          {typeCounts.length === 0 && <div className="text-sm text-gray-500">Sem dados</div>}
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-1">Tempo médio de manutenção</div>
        <div className="text-2xl font-semibold">{formatMinutes(avgMttr)}</div>
        <div className="text-sm text-gray-600">Média entre início e fechamento das OS</div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-2">Ranking por Equipamento</div>
        <div className="space-y-2">
          {assetRanking.map((d, i) => (
            <Bar key={i} label={d.label} value={d.value} max={maxAsset} color={palette[i % palette.length]} />
          ))}
          {assetRanking.length === 0 && <div className="text-sm text-gray-500">Sem dados</div>}
        </div>
        <div className="font-semibold mt-4 mb-2">Ranking por Componente</div>
        <div className="space-y-2">
          {componentRanking.map((d, i) => (
            <Bar key={i} label={d.label} value={d.value} max={maxComp} color={palette[(i + 3) % palette.length]} />
          ))}
          {componentRanking.length === 0 && <div className="text-sm text-gray-500">Sem dados</div>}
        </div>
      </div>
    </div>
  );
}