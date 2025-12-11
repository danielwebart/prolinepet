"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Client = { id: number; doc?: string | null; name: string; cep?: string | null; logradouro?: string | null; numero?: string | null; bairro?: string | null; cidade?: string | null; estado?: string | null };
type OrderItem = { id: number; sku?: string | null; name: string; unit?: string | null; quantity: number; unitPrice: number; discountPct: number };
type SalesOrder = { id: number; code: string; orderDate: string; customerName: string; customerDoc?: string | null; total: number; items?: OrderItem[] };

export default function ClientDetailsPage() {
  const params = useParams() as any;
  const id = Number(params.id);
  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/base/clients?q=${encodeURIComponent(String(id))}`, { cache: 'no-store' });
        const arr: Client[] = await res.json();
        const c = (arr || []).find((x) => Number(x.id) === id) || null;
        setClient(c);
        if (c?.doc) {
          const ro = await fetch(`/api/sales/orders?doc=${encodeURIComponent(c.doc)}`, { cache: 'no-store' });
          const list: SalesOrder[] = await ro.json();
          setOrders(Array.isArray(list) ? list : []);
        } else {
          setOrders([]);
        }
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally { setLoading(false); }
    };
    if (Number.isFinite(id)) load();
  }, [id]);

  const linkedItems = useMemo(() => {
    const map = new Map<string, { name: string; sku?: string | null; unit?: string | null; qty: number }>();
    for (const o of orders) {
      for (const it of o.items || []) {
        const key = `${it.sku || ''}|${it.name}|${it.unit || ''}`;
        const prev = map.get(key);
        map.set(key, { name: it.name, sku: it.sku || null, unit: it.unit || null, qty: (prev?.qty || 0) + Number(it.quantity || 0) });
      }
    }
    return Array.from(map.values());
  }, [orders]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Cliente • Detalhes</h1>
        <button className="px-3 py-2 border rounded" onClick={() => router.back()}>Voltar</button>
      </div>
      {loading && <div className="text-sm text-gray-600">Carregando…</div>}
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
      {client && (
        <div className="border rounded bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><span className="text-gray-600">CPF/CNPJ:</span> <span className="font-medium">{client.doc || '-'}</span></div>
            <div><span className="text-gray-600">Nome:</span> <span className="font-medium">{client.name}</span></div>
            <div><span className="text-gray-600">Cidade:</span> <span className="font-medium">{client.cidade || '-'}</span></div>
            <div><span className="text-gray-600">UF:</span> <span className="font-medium">{client.estado || '-'}</span></div>
          </div>
        </div>
      )}

      <div className="border rounded bg-white">
        <div className="p-2 text-xs text-gray-600">Pedidos do Cliente</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Código</th>
              <th className="p-2 text-left">Data</th>
              <th className="p-2 text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.code}</td>
                <td className="p-2">{new Date(o.orderDate).toLocaleDateString('pt-BR')}</td>
                <td className="p-2">{o.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td className="p-3 text-gray-500" colSpan={3}>Sem pedidos</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border rounded bg-white">
        <div className="p-2 text-xs text-gray-600">Itens vinculados ao cliente</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">SKU</th>
              <th className="p-2 text-left">Un.</th>
              <th className="p-2 text-left">Qtd total</th>
            </tr>
          </thead>
          <tbody>
            {linkedItems.map((it, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.sku || '-'}</td>
                <td className="p-2">{it.unit || '-'}</td>
                <td className="p-2">{it.qty}</td>
              </tr>
            ))}
            {linkedItems.length === 0 && (
              <tr><td className="p-3 text-gray-500" colSpan={4}>Sem itens</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}