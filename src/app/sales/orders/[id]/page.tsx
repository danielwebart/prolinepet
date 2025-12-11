"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type InventoryItem = {
  id: number;
  sku?: string | null;
  name: string;
  unit?: string | null;
  commercialFamily?: { id: number; name: string } | null;
};

type OrderItem = {
  id: number;
  name: string;
  sku?: string | null;
  unit?: string | null;
  quantity: number;
  unitPrice: number;
  discountPct: number;
  width?: number | null;
  length?: number | null;
  grammage?: number | null;
  diameter?: number | null;
  tube?: number | null;
  inventoryItem?: InventoryItem | null;
};

type SalesOrder = {
  id: number;
  code: string;
  orderDate: string;
  customerName: string;
  customerDoc?: string | null;
  paymentTerms?: string | null;
  deliveryDate?: string | null;
  notes?: string | null;
  subtotal: number;
  discountTotal: number;
  total: number;
  items?: OrderItem[];
};

const ICON_BTN = "inline-flex items-center justify-center w-8 h-8 border rounded hover:bg-gray-100";

function familyName(it: OrderItem): string {
  const n = it.inventoryItem?.commercialFamily?.name || "Outras famílias";
  return n.toUpperCase();
}

function statusChipStyle(s?: string): string {
  const v = (s || '').trim();
  switch (v) {
    case 'Orçamento':
    case 'OPEN':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'Aguardando Integração':
      return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'Integrado':
      return 'bg-blue-100 text-blue-800 border border-blue-300';
    case 'Erro na integração':
      return 'bg-red-100 text-red-800 border border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
}

export default function SalesOrderMaintenancePage() {
  const params = useParams() as any;
  const id = Number(params.id);
  const router = useRouter();
  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<OrderItem>>({});
  const [showFeaturesFor, setShowFeaturesFor] = useState<number | null>(null);
  const [hdrDraft, setHdrDraft] = useState<{ paymentTerms?: string; deliveryDate?: string }>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/sales/orders/${id}`, { cache: 'no-store' });
        const data: SalesOrder = await res.json();
        setOrder(data);
        setHdrDraft({
          paymentTerms: data.paymentTerms || '',
          deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().slice(0,10) : ''
        });
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally { setLoading(false); }
    };
    if (Number.isFinite(id)) load();
  }, [id]);

  const fmtCurrency = (n: number | undefined) => (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtNumber = (n: number | undefined) => (n ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const computeWeightKg = (it: OrderItem): number => {
    const fam = familyName(it);
    if (fam === 'CHAPAS') {
      const w = it.width ?? 0; // mm
      const l = it.length ?? 0; // mm
      const g = it.grammage ?? 0; // g/m2
      if (w > 0 && l > 0 && g > 0) {
        const areaM2 = (w / 1000) * (l / 1000);
        const kgPerPiece = areaM2 * (g / 1000);
        return kgPerPiece * (it.quantity || 0);
      }
    }
    return 0;
  };

  const saveHeader = async (partial: { paymentTerms?: string; deliveryDate?: string }) => {
    if (!order) return;
    try {
      const res = await fetch(`/api/sales/orders/${order.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(partial) });
      if (!res.ok) throw new Error('Falha ao salvar cabeçalho');
      const updated: SalesOrder = await res.json();
      setOrder(updated);
      setHdrDraft({
        paymentTerms: updated.paymentTerms || '',
        deliveryDate: updated.deliveryDate ? new Date(updated.deliveryDate).toISOString().slice(0,10) : ''
      });
    } catch (e: any) { alert(e?.message || String(e)); }
  };

  const groups = useMemo(() => {
    const out = new Map<string, OrderItem[]>();
    for (const it of (order?.items || [])) {
      const key = familyName(it);
      const arr = out.get(key) || [];
      arr.push(it);
      out.set(key, arr);
    }
    return Array.from(out.entries());
  }, [order]);

  const startEdit = (it: OrderItem) => {
    setEditingId(it.id);
    setDraft({
      quantity: it.quantity,
      width: it.width ?? undefined,
      length: it.length ?? undefined,
      grammage: it.grammage ?? undefined,
      diameter: it.diameter ?? undefined,
      tube: it.tube ?? undefined,
    });
  };
  const cancelEdit = () => { setEditingId(null); setDraft({}); };
  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`/api/sales/orders/items/${editingId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft)
      });
      if (!res.ok) throw new Error('Falha ao salvar item');
      const updated: any = await res.json();
      setEditingId(null); setDraft({});
      // Refresh
      const r = await fetch(`/api/sales/orders/${id}`, { cache: 'no-store' });
      setOrder(await r.json());
    } catch (e: any) { alert(e?.message || String(e)); }
  };

  const renderActions = (it: OrderItem) => {
    const fam = familyName(it);
    const showFeatures = fam === 'CHAPAS';
    const showEdit = true; // always
    return (
      <div className="flex gap-2">
        {showFeatures && (
          <button className={ICON_BTN} title="Características" aria-label="Características" onClick={() => setShowFeaturesFor(it.id)}>
            {/* gear icon */}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M10.325 4.317a1.5 1.5 0 0 1 3.35 0l.149.894a6.986 6.986 0 0 1 1.808.75l.8-.43a1.5 1.5 0 1 1 1.442 2.636l-.8.43c.314.57.56 1.184.73 1.829l.894.149a1.5 1.5 0 1 1 0 2.99l-.894.149a6.986 6.986 0 0 1-.75 1.808l.43.8a1.5 1.5 0 1 1-2.636 1.442l-.43-.8a6.986 6.986 0 0 1-1.829.73l-.149.894a1.5 1.5 0 1 1-2.99 0l-.149-.894a6.986 6.986 0 0 1-1.808-.75l-.8.43a1.5 1.5 0 1 1-1.442-2.636l.8-.43a6.986 6.986 0 0 1-.73-1.829l-.894-.149a1.5 1.5 0 1 1 0-2.99l.894-.149c.19-.645.436-1.259.75-1.808l-.43-.8a1.5 1.5 0 1 1 2.636-1.442l.43.8c.57-.314 1.184-.56 1.829-.73l.149-.894ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/></svg>
          </button>
        )}
        {showEdit && (
          <button className={ICON_BTN} title="Editar item" aria-label="Editar item" onClick={() => startEdit(it)}>
            {/* pencil icon */}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm18-11.5a1.003 1.003 0 0 0 0-1.42L18.67.97a1.003 1.003 0 0 0-1.42 0l-2.34 2.34 3.75 3.75 2.34-2.34Z"/></svg>
          </button>
        )}
      </div>
    );
  };

  const renderEditFields = (it: OrderItem) => {
    const fam = familyName(it);
    const isCaixas = fam === 'CAIXAS';
    const isChapas = fam === 'CHAPAS';
    const isMiolo = fam === 'MIOLO';
    return (
      <div className="grid grid-cols-6 gap-2 items-center">
        {/* Largura */}
        {isChapas && (
          <div>
            <label className="text-xs text-gray-600">Larg.</label>
            <input type="number" className="w-full px-2 py-1 border rounded" value={draft.width ?? ''} onChange={(e) => setDraft((d) => ({ ...d, width: Number(e.target.value) }))} />
          </div>
        )}
        {/* Comprimento */}
        {isChapas && (
          <div>
            <label className="text-xs text-gray-600">Compr.</label>
            <input type="number" className="w-full px-2 py-1 border rounded" value={draft.length ?? ''} onChange={(e) => setDraft((d) => ({ ...d, length: Number(e.target.value) }))} />
          </div>
        )}
        {/* Gramatura */}
        {isChapas && (
          <div>
            <label className="text-xs text-gray-600">Gram.</label>
            <input type="number" className="w-full px-2 py-1 border rounded" value={draft.grammage ?? ''} onChange={(e) => setDraft((d) => ({ ...d, grammage: Number(e.target.value) }))} />
          </div>
        )}
        {/* Diametro */}
        {isMiolo && (
          <div>
            <label className="text-xs text-gray-600">Diâmetro</label>
            <input type="number" className="w-full px-2 py-1 border rounded" value={draft.diameter ?? ''} onChange={(e) => setDraft((d) => ({ ...d, diameter: Number(e.target.value) }))} />
          </div>
        )}
        {/* Tubete */}
        {isMiolo && (
          <div>
            <label className="text-xs text-gray-600">Tubete</label>
            <input type="number" className="w-full px-2 py-1 border rounded" value={draft.tube ?? ''} onChange={(e) => setDraft((d) => ({ ...d, tube: Number(e.target.value) }))} />
          </div>
        )}
        {/* Quantidade */}
        <div>
          <label className="text-xs text-gray-600">Qtd</label>
          <input type="number" className="w-full px-2 py-1 border rounded" value={draft.quantity ?? ''} onChange={(e) => setDraft((d) => ({ ...d, quantity: Number(e.target.value) }))} />
        </div>
        <div className="col-span-2 flex gap-2">
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={saveEdit}>Salvar</button>
          <button className="px-3 py-1 bg-gray-300 text-gray-900 rounded" onClick={cancelEdit}>Cancelar</button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Manutenção de Pedidos</h1>
          {order && (
            <span className={`text-xs px-2 py-1 rounded ${statusChipStyle(order.status)}`}>
              {order.status === 'OPEN' ? 'Orçamento' : (order.status || '—')}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <a href="/sales/orders/new" className="px-3 py-2 border rounded bg-white hover:bg-gray-50">Novo Pedido</a>
          <button className="px-3 py-2 border rounded" onClick={() => router.back()}>Voltar</button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Carregando…</div>}
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

      {order && (
        <div className="space-y-6">
          {/* Header do pedido (campos como no print) */}
          <div className="border rounded bg-white p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Número</span>
              <div className="font-mono mt-1">{order.code}</div>
            </div>
            <div>
              <span className="text-gray-600">Data</span>
              <div className="mt-1">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</div>
            </div>
            <div>
              <span className="text-gray-600">Cliente</span>
              <input className="mt-1 w-full px-2 py-1 border rounded" value={order.customerName} readOnly />
            </div>
            <div>
              <span className="text-gray-600">Condição de pagamento</span>
              <input className="mt-1 w-full px-2 py-1 border rounded" placeholder="Digite descrição ou código" value={hdrDraft.paymentTerms ?? ''} onChange={(e) => setHdrDraft((d) => ({ ...d, paymentTerms: e.target.value }))} onBlur={() => saveHeader({ paymentTerms: hdrDraft.paymentTerms || '' })} />
            </div>
            <div>
              <span className="text-gray-600">Entrega</span>
              <input type="date" className="mt-1 w-full px-2 py-1 border rounded" value={hdrDraft.deliveryDate ?? ''} onChange={(e) => setHdrDraft((d) => ({ ...d, deliveryDate: e.target.value }))} onBlur={() => saveHeader({ deliveryDate: hdrDraft.deliveryDate || '' })} />
            </div>
          </div>

          {/* Seção Itens + grupos por família */}
          <div className="border rounded bg-white">
            <div className="px-3 py-2 border-b flex items-center">
              <span className="text-sm text-gray-700">Itens</span>
              <button className="ml-auto px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100">Adicionar itens</button>
            </div>
          </div>
          {groups.map(([fam, list]) => (
            <div key={fam} className="border rounded bg-white">
              <div className="p-2 text-xs text-gray-600">{fam}</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">Item</th>
                      <th className="p-2 text-left">SKU</th>
                      <th className="p-2 text-left">UM</th>
                      {fam === 'CHAPAS' && (<><th className="p-2 text-left">Larg.</th><th className="p-2 text-left">Compr.</th><th className="p-2 text-left">Gram.</th></>)}
                      {fam === 'MIOLO' && (<><th className="p-2 text-left">Diâmetro</th><th className="p-2 text-left">Tubete</th></>)}
                      <th className="p-2 text-left">Qtd</th>
                      <th className="p-2 text-left">Peso (KG)</th>
                      <th className="p-2 text-left">Preço</th>
                      <th className="p-2 text-left">Desc (%)</th>
                      <th className="p-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((it) => {
                      const isEditing = editingId === it.id;
                      const famUpper = fam;
                      const showWidthLengthGram = famUpper === 'CHAPAS';
                      const showDiameterTube = famUpper === 'MIOLO';
                      return (
                        <tr key={it.id} className="border-t">
                          <td className="p-2">{it.name}</td>
                          <td className="p-2">{it.sku || '-'}</td>
                          <td className="p-2">{it.unit || '-'}</td>
                          {showWidthLengthGram && (
                            <>
                              <td className="p-2">{isEditing ? (<input type="number" className="w-24 px-2 py-1 border rounded" value={draft.width ?? it.width ?? ''} onChange={(e) => setDraft((d) => ({ ...d, width: Number(e.target.value) }))} />) : (it.width ?? '-')}</td>
                              <td className="p-2">{isEditing ? (<input type="number" className="w-24 px-2 py-1 border rounded" value={draft.length ?? it.length ?? ''} onChange={(e) => setDraft((d) => ({ ...d, length: Number(e.target.value) }))} />) : (it.length ?? '-')}</td>
                              <td className="p-2">{isEditing ? (<input type="number" className="w-24 px-2 py-1 border rounded" value={draft.grammage ?? it.grammage ?? ''} onChange={(e) => setDraft((d) => ({ ...d, grammage: Number(e.target.value) }))} />) : (it.grammage ?? '-')}</td>
                            </>
                          )}
                          {showDiameterTube && (
                            <>
                              <td className="p-2">{isEditing ? (<input type="number" className="w-24 px-2 py-1 border rounded" value={draft.diameter ?? it.diameter ?? ''} onChange={(e) => setDraft((d) => ({ ...d, diameter: Number(e.target.value) }))} />) : (it.diameter ?? '-')}</td>
                              <td className="p-2">{isEditing ? (<input type="number" className="w-24 px-2 py-1 border rounded" value={draft.tube ?? it.tube ?? ''} onChange={(e) => setDraft((d) => ({ ...d, tube: Number(e.target.value) }))} />) : (it.tube ?? '-')}</td>
                            </>
                          )}
                          <td className="p-2">{isEditing ? (<input type="number" className="w-20 px-2 py-1 border rounded" value={draft.quantity ?? it.quantity} onChange={(e) => setDraft((d) => ({ ...d, quantity: Number(e.target.value) }))} />) : it.quantity}</td>
                          <td className="p-2">{fmtNumber(computeWeightKg(it))}</td>
                          <td className="p-2">{it.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td className="p-2">{it.discountPct}%</td>
                          <td className="p-2">
                            {!isEditing ? (
                              renderActions(it)
                            ) : (
                              <div className="flex gap-2">
                                {/* Regras por família: campos adicionais no modo edição */}
                                {renderEditFields(it)}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {(() => {
                const subtotal = list.reduce((s, it) => s + (it.quantity * it.unitPrice), 0);
                const discountTotal = list.reduce((s, it) => s + (it.quantity * it.unitPrice * (it.discountPct / 100)), 0);
                const total = subtotal - discountTotal;
              const totalWeight = list.reduce((s, it) => s + computeWeightKg(it), 0);
                return (
                  <div className="px-3 py-2 text-xs text-gray-700 flex gap-6 justify-end border-t">
                    <span>Subtotal: {fmtCurrency(subtotal)}</span>
                    <span>Descontos: {fmtCurrency(discountTotal)}</span>
                    <span>Total: {fmtCurrency(total)}</span>
                  <span>Total Peso (KG): {fmtNumber(totalWeight)}</span>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* Modal de características (somente CHAPAS) */}
      {showFeaturesFor && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center" onClick={() => setShowFeaturesFor(null)}>
          <div className="bg-white w-full max-w-xl rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b flex items-center">
              <div className="font-semibold">Características do item</div>
              <button className="ml-auto text-gray-500 hover:text-black" onClick={() => setShowFeaturesFor(null)} aria-label="Fechar">×</button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 text-sm">
              {/* Campos de características genéricos (placeholders) */}
              <div>
                <label className="text-xs text-gray-600">Tipo de Onda</label>
                <input className="w-full px-2 py-1 border rounded" placeholder="Ex.: B, C, E" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Qualidade</label>
                <input className="w-full px-2 py-1 border rounded" placeholder="Ex.: Kraft, Reciclado" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-600">Observações</label>
                <textarea className="w-full px-2 py-1 border rounded" rows={3} />
              </div>
            </div>
            <div className="px-4 py-3 border-t text-right">
              <button className="px-3 py-1.5 border rounded hover:bg-gray-100" onClick={() => setShowFeaturesFor(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
