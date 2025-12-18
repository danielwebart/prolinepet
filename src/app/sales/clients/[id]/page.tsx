"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Client = { id: number; doc?: string | null; name: string; cep?: string | null; logradouro?: string | null; numero?: string | null; bairro?: string | null; cidade?: string | null; estado?: string | null };
type OrderItem = { id: number; sku?: string | null; name: string; unit?: string | null; quantity: number; unitPrice: number; discountPct: number };
type SalesOrder = { id: number; code: string; orderDate: string; customerName: string; customerDoc?: string | null; total: number; items?: OrderItem[] };
type LinkedItem = { id: number; name: string; sku?: string | null; unit?: string | null; unitPrice?: number };
type CartItem = { id: number; inventoryItemId: number; name: string; sku?: string | null; unit?: string | null; quantity: number; unitPrice: number };

export default function ClientDetailsPage() {
  const params = useParams() as any;
  const id = Number(params.id);
  const [client, setClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [linkedItems, setLinkedItems] = useState<LinkedItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const refreshCart = async () => {
    if (!client) return;
    const r = await fetch(`/api/clients/${client.id}/cart`, { cache: 'no-store' });
    if (r.ok) {
      const arr: CartItem[] = await r.json();
      setCartItems(Array.isArray(arr) ? arr : []);
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/base/clients?q=${encodeURIComponent(String(id))}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Falha ao carregar cliente');
        const arr: Client[] = await res.json();
        const c = (arr || []).find((x) => Number(x.id) === id) || null;
        setClient(c);
        if (c?.doc) {
          const ro = await fetch(`/api/sales/orders?doc=${encodeURIComponent(c.doc)}`, { cache: 'no-store' });
          if (ro.ok) {
            const list: SalesOrder[] = await ro.json();
            setOrders(Array.isArray(list) ? list : []);
          } else {
            setOrders([]);
          }
          const li = await fetch(`/api/clients/items/by-doc/${encodeURIComponent(c.doc)}`, { cache: 'no-store' });
          if (li.ok) {
            const linked: LinkedItem[] = await li.json();
            setLinkedItems(Array.isArray(linked) ? linked : []);
          } else {
            setLinkedItems([]);
          }
        } else {
          setOrders([]);
          setLinkedItems([]);
        }
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally { setLoading(false); }
    };
    if (Number.isFinite(id)) load();
  }, [id]);

  useEffect(() => {
    if (client) {
        refreshCart();
    }
  }, [client]);

  const addToCart = async (inventoryItemId: number) => {
    if (!client) return;
    try {
      const res = await fetch(`/api/clients/${client.id}/cart/items`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ inventoryItemId, quantity: 1 }) });
      if (!res.ok) throw new Error('Falha ao adicionar ao carrinho');
      await refreshCart();
      setShowCart(true);
    } catch (e: any) { alert(e?.message || String(e)); }
  };

  const updateCartQty = async (inventoryItemId: number, quantity: number) => {
    if (!client) return;
    const res = await fetch(`/api/clients/${client.id}/cart/items/${inventoryItemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quantity }) });
    if (res.ok) await refreshCart();
  };

  const removeFromCart = async (inventoryItemId: number) => {
    if (!client) return;
    const res = await fetch(`/api/clients/${client.id}/cart/items/${inventoryItemId}`, { method: 'DELETE' });
    if (res.ok) await refreshCart();
  };

  const generateOrder = async () => {
    if (!client) return;
    if (!confirm('Deseja gerar um pedido com os itens do carrinho?')) return;
    
    try {
        const res = await fetch('/api/sales/orders/from-cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId: client.id })
        });
        
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Erro ao gerar pedido');
        }
        
        const newOrder = await res.json();
        alert(`Pedido ${newOrder.code} gerado com sucesso!`);
        
        // Refresh cart and orders
        await refreshCart();
        // Reload orders
        if (client.doc) {
            const ro = await fetch(`/api/sales/orders?doc=${encodeURIComponent(client.doc)}`, { cache: 'no-store' });
            if (ro.ok) {
                const list: SalesOrder[] = await ro.json();
                setOrders(Array.isArray(list) ? list : []);
            }
        }
        
    } catch (e: any) {
        alert(e.message);
    }
  };

  const cartCount = cartItems.length;

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
          <div className="flex items-start justify-between gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-600">CPF/CNPJ:</span> <span className="font-medium">{client.doc || '-'}</span></div>
              <div><span className="text-gray-600">Nome:</span> <span className="font-medium">{client.name}</span></div>
              <div><span className="text-gray-600">Cidade:</span> <span className="font-medium">{client.cidade || '-'}</span></div>
              <div><span className="text-gray-600">UF:</span> <span className="font-medium">{client.estado || '-'}</span></div>
            </div>
            <button
              className="relative inline-flex items-center justify-center p-2 border rounded bg-white hover:bg-gray-50 transition-colors"
              title="Carrinho do cliente"
              aria-label="Carrinho do cliente"
              onClick={() => { setShowCart((v) => !v); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-white">
                    {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {showCart && (
        <div className="border rounded bg-white">
          <div className="flex justify-between items-center p-3 bg-gray-50 border-b">
            <span className="text-sm font-semibold text-gray-700">Carrinho do cliente</span>
            {cartItems.length > 0 && (
                <button 
                    onClick={generateOrder}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                >
                    Gerar Pedido
                </button>
            )}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left">Item</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Un.</th>
                <th className="p-2 text-left">Qtd</th>
                <th className="p-2 text-left">Preço Unit R$</th>
                <th className="p-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((it) => (
                <tr key={it.inventoryItemId} className="border-t">
                  <td className="p-2">{it.name}</td>
                  <td className="p-2">{it.sku || '-'}</td>
                  <td className="p-2">{it.unit || '-'}</td>
                  <td className="p-2">
                    <input type="number" className="w-20 px-2 py-1 border rounded" value={it.quantity} onChange={(e) => updateCartQty(it.inventoryItemId, Number(e.target.value))} />
                  </td>
                  <td className="p-2">{(it.unitPrice ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="p-2">
                    <button className="px-2 py-1 text-xs border rounded" onClick={() => removeFromCart(it.inventoryItemId)}>Excluir</button>
                  </td>
                </tr>
              ))}
              {cartItems.length === 0 && (
                <tr><td className="p-3 text-gray-500" colSpan={6}>Carrinho vazio</td></tr>
              )}
            </tbody>
          </table>
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
              <th className="p-2 text-left">Preço Unit R$</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {linkedItems.map((it, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.sku || '-'}</td>
                <td className="p-2">{it.unit || '-'}</td>
                <td className="p-2">{(it.unitPrice ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="p-2">
                  <button className="inline-flex items-center justify-center w-8 h-8 border rounded hover:bg-gray-100" title="Adicionar ao carrinho" aria-label="Adicionar ao carrinho" onClick={() => addToCart(it.id)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM6.2 6l-.9-2H1V2h4.1l1.7 4H21l-2 7H8.1l-1 2H19v2H6a1 1 0 0 1-.9-.6L2 6h4.2Z"/></svg>
                  </button>
                </td>
              </tr>
            ))}
            {linkedItems.length === 0 && (
              <tr><td className="p-3 text-gray-500" colSpan={5}>Sem itens</td></tr>
            )}
          </tbody>
        </table>
      </div>

      
    </div>
  );
}