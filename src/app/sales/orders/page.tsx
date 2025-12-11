"use client";
import React, { useEffect, useMemo, useState } from "react";

type OrderItem = { id: number; name: string; quantity: number; unitPrice: number; discountPct: number };
type SalesOrder = {
  id: number;
  code: string;
  status: string;
  orderDate: string;
  customerName: string;
  subtotal: number;
  discountTotal: number;
  total: number;
  items?: OrderItem[];
};

export default function SalesOrdersPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("");
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");
  const [selected, setSelected] = useState<SalesOrder | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/sales/orders');
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(String(err?.message || err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const qLower = q.trim().toLowerCase();
    const ds = dateStart ? new Date(dateStart) : null;
    const de = dateEnd ? new Date(dateEnd) : null;
    return (orders || [])
      .filter((o) => (status ? o.status === status : true))
      .filter((o) => {
        if (!qLower) return true;
        return (
          (o.code || '').toLowerCase().includes(qLower) ||
          (o.customerName || '').toLowerCase().includes(qLower)
        );
      })
      .filter((o) => {
        const d = o.orderDate ? new Date(o.orderDate) : null;
        if (!d) return true;
        if (ds && d < ds) return false;
        if (de && d > de) return false;
        return true;
      });
  }, [orders, q, status, dateStart, dateEnd]);

  const statusColor = (s: string) => {
    switch ((s || '').toUpperCase()) {
      case 'OPEN': return 'bg-yellow-100 text-yellow-800';
      case 'FINALIZED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Venda • Consultar pedidos</h1>
      <div className="text-sm text-gray-600">Listagem de pedidos criados pela rotina de Inclusão de Pedidos.</div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-gray-50 p-3 rounded border border-gray-200">
        <div>
          <label className="text-xs text-gray-600">Buscar (Número ou Cliente)</label>
          <input className="w-full mt-1 px-2 py-1.5 border rounded" placeholder="Ex.: PED-0001 ou João" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-600">Situação</label>
          <select className="w-full mt-1 px-2 py-1.5 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Todas</option>
            <option value="OPEN">Não finalizado</option>
            <option value="FINALIZED">Faturado/Finalizado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600">Data inicial</label>
          <input type="date" className="w-full mt-1 px-2 py-1.5 border rounded" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-600">Data final</label>
          <input type="date" className="w-full mt-1 px-2 py-1.5 border rounded" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
        </div>
      </div>

      {/* Listagem */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="px-3 py-2 border-b bg-gray-50 text-sm text-gray-700 flex items-center">
          <span>Listagem de pedidos</span>
          <span className="ml-auto text-xs text-gray-500">{filtered.length} registro(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left px-3 py-2">Número</th>
                <th className="text-left px-3 py-2">Cliente</th>
                <th className="text-left px-3 py-2">Data</th>
                <th className="text-right px-3 py-2">Total</th>
                <th className="text-left px-3 py-2">Situação</th>
                <th className="text-center px-3 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-500">Carregando...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-500">Nenhum pedido encontrado.</td></tr>
              )}
              {!loading && filtered.map((o) => (
                <tr key={o.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs">{o.code || o.id}</td>
                  <td className="px-3 py-2">{o.customerName || '-'}</td>
                  <td className="px-3 py-2">{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : '-'}</td>
                  <td className="px-3 py-2 text-right">{(o.total ?? 0).toLocaleString(undefined, { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded text-xs ${statusColor(o.status)}`}>{o.status || '-'}</span></td>
                  <td className="px-3 py-2 text-center">
                    <button className="px-2 py-1 text-xs border rounded hover:bg-gray-100" onClick={() => setSelected(o)}>Ver itens</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de itens */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" onClick={() => setSelected(null)}>
          <div className="bg-white w-full max-w-2xl rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b flex items-center">
              <div className="font-semibold">Itens do pedido {selected.code || selected.id}</div>
              <button className="ml-auto text-gray-500 hover:text-black" onClick={() => setSelected(null)} aria-label="Fechar">×</button>
            </div>
            <div className="p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-700">
                    <th className="text-left px-2 py-1">Item</th>
                    <th className="text-right px-2 py-1">Qtd</th>
                    <th className="text-right px-2 py-1">Preço</th>
                    <th className="text-right px-2 py-1">Desc (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="px-2 py-1">{it.name}</td>
                      <td className="px-2 py-1 text-right">{it.quantity}</td>
                      <td className="px-2 py-1 text-right">{it.unitPrice.toLocaleString(undefined, { style: 'currency', currency: 'BRL' })}</td>
                      <td className="px-2 py-1 text-right">{it.discountPct}%</td>
                    </tr>
                  ))}
                  {(selected.items || []).length === 0 && (
                    <tr><td colSpan={4} className="px-2 py-2 text-center text-gray-500">Sem itens</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t text-right">
              <button className="px-3 py-1.5 border rounded hover:bg-gray-100" onClick={() => setSelected(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
