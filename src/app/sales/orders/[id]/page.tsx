"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type InventoryItem = {
  id: number;
  sku?: string | null;
  name: string;
  unit?: string | null;
  commercialFamily?: { id: number; name: string } | null;
  unitPrice?: number | null;
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
  creases?: Record<string, number> | null;
  clientOrderNumber?: string | null;
  internalResin?: boolean;
  externalResin?: boolean;
};

type SalesOrder = {
  id: number;
  code: string;
  status: string;
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

const ICON_BTN = "inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700";

const minChars = 1;

const AsyncSelect = ({ 
  label, 
  value, 
  onChange, 
  onSelectObj,
  fetchUrl, 
  placeholder,
  renderOption,
  getLabel,
  onBlur
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  onSelectObj?: (obj: any) => void;
  fetchUrl: (q: string) => string; 
  placeholder?: string;
  renderOption: (item: any) => React.ReactNode;
  getLabel: (item: any) => string;
  onBlur?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (q: string) => {
    onChange(q);
    if (q.length < minChars) { setOpts([]); return; }
    setLoading(true);
    try {
      const res = await fetch(fetchUrl(q));
      if (res.ok) {
        const data = await res.json();
        setOpts(Array.isArray(data) ? data : []);
        setOpen(true);
      }
    } catch { } finally { setLoading(false); }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <span className="text-gray-600">{label}</span>
      <input 
        className="mt-1 w-full px-2 py-1 border rounded" 
        value={value} 
        onChange={(e) => handleSearch(e.target.value)}
        onBlur={onBlur}
        onFocus={() => { 
           if (value.length >= minChars && opts.length === 0) {
             handleSearch(value);
           }
           setOpen(true); 
        }}
        placeholder={placeholder}
      />
      {open && opts.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto mt-1">
          {opts.map((item, idx) => (
            <li 
              key={idx} 
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                const txt = getLabel(item);
                onChange(txt);
                if (onSelectObj) onSelectObj(item);
                setOpen(false);
              }}
            >
              {renderOption(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

function familyName(it: OrderItem): string {
  let fam = (it.inventoryItem?.commercialFamily?.name || '').trim();
  if (!fam) {
    const name = (it.name || '').toUpperCase();
    if (name.includes('CHAPA') || name.includes('CHAPAS')) fam = 'CHAPAS';
    else if (name.includes('MIOL')) fam = 'MIOLO';
    else fam = 'Outras famílias';
  }
  return fam.toUpperCase();
}

function supportsSheetDims(it: OrderItem): boolean {
  const fam = (it.inventoryItem?.commercialFamily?.name || '').toUpperCase();
  const name = (it.name || '').toUpperCase();
  // Detectar por família OU pelo nome do item
  if (fam.includes('CHAPA') || fam.includes('CHAPAS')) return true;
  if (name.includes('CHAPA') || name.includes('CHAPAS')) return true;
  // Se já existir alguma medida, também habilita
  return (it.width != null) || (it.length != null) || (it.grammage != null);
}

function supportsCoreDims(it: OrderItem): boolean {
  const fam = (it.inventoryItem?.commercialFamily?.name || '').toUpperCase();
  const name = (it.name || '').toUpperCase();
  if (fam.includes('MIOL')) return true;
  if (name.includes('MIOL')) return true;
  return (it.diameter != null) || (it.tube != null);
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

function statusLabelPt(s?: string): string {
  const v = (s || '').trim().toUpperCase();
  switch (v) {
    case 'OPEN':
      return 'Orçamento';
    case 'AGUARDANDO INTEGRAÇÃO':
    case 'AGUARDANDO INTEGRACAO':
    case 'AWAITING INTEGRATION':
      return 'Aguardando Integração';
    case 'INTEGRADO':
    case 'INTEGRATED':
      return 'Integrado';
    case 'ERRO NA INTEGRAÇÃO':
    case 'ERRO NA INTEGRACAO':
    case 'INTEGRATION ERROR':
      return 'Erro na integração';
    case 'EM FILA PRODUÇÃO':
    case 'EM FILA PRODUCAO':
      return 'Em fila produção';
    case 'EM PRODUÇÃO':
    case 'EM PRODUCAO':
      return 'Em produção';
    case 'PRODUZIDO/ESTOCADO':
      return 'Produzido/Estocado';
    case 'FATURADO':
      return 'Faturado';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return s || '—';
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
  const [discountInput, setDiscountInput] = useState('');
  const [showFeaturesFor, setShowFeaturesFor] = useState<number | null>(null);
  const [hdrDraft, setHdrDraft] = useState<{ paymentTerms?: string; deliveryDate?: string; customerName?: string; customerDoc?: string }>({});
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const [addingItems, setAddingItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const searchClientItems = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('q', term);
      
      const res = await fetch(`/api/items?${params.toString()}`);
      if (res.ok) {
        let data = await res.json();
        
        const lower = term.toLowerCase();
        data = data.filter((it: any) => 
          it.name.toLowerCase().includes(lower) || 
          (it.sku && it.sku.toLowerCase().includes(lower))
        );
        
        setSearchResults(data.slice(0, 20));
      }
    } catch (e) {
      console.error(e);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const addItemToOrder = async (item: InventoryItem) => {
    if (!order) return;
    try {
      const payload = {
        orderId: order.id,
        inventoryItemId: item.id,
        name: item.name,
        sku: item.sku,
        unit: item.unit,
        quantity: 1,
        unitPrice: item.unitPrice ?? 0,
        discountPct: 0
      };
      
      const res = await fetch('/api/sales/orders/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Falha ao adicionar item');
      
      setAddingItems(false);
      setSearchTerm('');
      await refreshOrder();
    } catch (e: any) {
      alert(e?.message || String(e));
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/sales/orders/${id}`, { cache: 'no-store' });
        const data: SalesOrder = await res.json();
        setOrder(data);
        setHdrDraft({
          paymentTerms: data.paymentTerms || '',
          deliveryDate: data.deliveryDate ? new Date(data.deliveryDate).toISOString().slice(0,10) : '',
          customerName: data.customerName || '',
          customerDoc: data.customerDoc || ''
        });
      } catch (e: any) {
        setError(e?.message || String(e));
      } finally { setLoading(false); }
    };
    if (Number.isFinite(id)) load();
  }, [id]);

  const fmtCurrency = (n: number | undefined) => (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtNumber = (n: number | undefined) => (n ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n: number | undefined) => Math.round(n ?? 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 });

  const computeWeightKg = (it: OrderItem, useDraft = false): number => {
    // Aplicar fórmula para itens que têm medidas de chapa
    const hasDims = supportsSheetDims(it);
    if (hasDims) {
      const w = (useDraft ? (draft.width ?? it.width) : it.width) ?? 0; // mm
      const l = (useDraft ? (draft.length ?? it.length) : it.length) ?? 0; // mm
      const g = (useDraft ? (draft.grammage ?? it.grammage) : it.grammage) ?? 0; // g/m2
      const q = (useDraft ? (draft.quantity ?? it.quantity) : it.quantity) ?? 0;
      if (w > 0 && l > 0 && g > 0 && q > 0) {
        const areaM2 = (l / 1000) * (w / 1000);
        const weightKg = (areaM2 * g * q) / 1000; // g → kg
        return weightKg;
      }
    }
    return 0;
  };

  const saveHeader = async (partial: { paymentTerms?: string; deliveryDate?: string; customerName?: string; customerDoc?: string }) => {
    if (!order) return;
    try {
      const res = await fetch(`/api/sales/orders/${order.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(partial) });
      if (!res.ok) throw new Error('Falha ao salvar cabeçalho');
      const updated: SalesOrder = await res.json();
      setOrder(updated);
      setHdrDraft({
        paymentTerms: updated.paymentTerms || '',
        deliveryDate: updated.deliveryDate ? new Date(updated.deliveryDate).toISOString().slice(0,10) : '',
        customerName: updated.customerName || '',
        customerDoc: updated.customerDoc || ''
      });
      setIsHeaderEditing(false);
    } catch (e: any) { alert(e?.message || String(e)); }
  };

  const refreshOrder = async () => {
    const r = await fetch(`/api/sales/orders/${id}`, { cache: 'no-store' });
    const data = await r.json();
    setOrder(data);
  };

  const globalItems = order?.items || [];
  const globalSubtotal = globalItems.reduce((s, it) => s + (it.quantity * it.unitPrice), 0);
  const globalDiscount = globalItems.reduce((s, it) => s + (it.quantity * it.unitPrice * (it.discountPct / 100)), 0);
  const globalTotalNoTax = globalSubtotal - globalDiscount;
  const globalWeight = globalItems.reduce((s, it) => s + Math.round(computeWeightKg(it, false)), 0);

  const groups = useMemo(() => {
    const out = new Map<string, OrderItem[]>();
    for (const it of (order?.items || [])) {
      const key = familyName(it);
      const arr = out.get(key) || [];
      arr.push(it);
      out.set(key, arr);
    }
    return Array.from(out.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [order]);

  const startEdit = (it: OrderItem) => {
    setEditingId(it.id);
    setDiscountInput(it.discountPct.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    setDraft({
      quantity: it.quantity,
      discountPct: it.discountPct,
      width: it.width ?? undefined,
      length: it.length ?? undefined,
      grammage: it.grammage ?? undefined,
      diameter: it.diameter ?? undefined,
      tube: it.tube ?? undefined,
      creases: it.creases ?? {},
      clientOrderNumber: it.clientOrderNumber ?? undefined,
      internalResin: it.internalResin ?? false,
      externalResin: it.externalResin ?? false,
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

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Manutenção de Pedidos</h1>
          {order && (
            <span className={`text-xs px-2 py-1 rounded ${statusChipStyle(statusLabelPt(order.status))}`}>
              {statusLabelPt(order.status)}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <a href="/sales/orders/new" className="px-3 py-2 border rounded bg-white hover:bg-gray-50" title="Novo Pedido" aria-label="Novo Pedido">
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7Z"/></svg>
              Novo Pedido
            </span>
          </a>
          <button className="px-3 py-2 border rounded" title="Voltar" aria-label="Voltar" onClick={() => router.back()}>
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"/></svg>
              Voltar
            </span>
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Carregando…</div>}
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}

      {order && (
        <div className="space-y-6">
          {/* Header do pedido com ícones à direita */}
          <div className="border rounded bg-white p-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <div>
                  <span className="text-gray-600">Número</span>
                  <div className="font-mono mt-1">{order.code}</div>
                </div>
                <div>
                  <span className="text-gray-600">Data</span>
                  <div className="mt-1">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</div>
                </div>
                <div className={!isHeaderEditing ? "opacity-75 pointer-events-none" : ""}>
                   <AsyncSelect
                      label="Cliente"
                      value={hdrDraft.customerName ?? ''}
                      onChange={(val) => setHdrDraft((d) => ({ ...d, customerName: val }))}
                      onSelectObj={(item) => {
                         setHdrDraft((d) => ({ ...d, customerName: item.name, customerDoc: item.document }));
                      }}
                      fetchUrl={(q) => `/api/base/clients?q=${q}`}
                      placeholder="Pesquise por nome ou documento"
                      getLabel={(item) => item.name}
                      renderOption={(item) => (
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.document}</div>
                        </div>
                      )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={!isHeaderEditing ? "opacity-75 pointer-events-none" : ""}>
                    <AsyncSelect
                      label="Condição de pagamento"
                      value={hdrDraft.paymentTerms ?? ''}
                      onChange={(val) => setHdrDraft((d) => ({ ...d, paymentTerms: val }))}
                      onSelectObj={(item) => {
                         const newVal = `[${item.code}] ${item.description}`;
                         setHdrDraft((d) => ({ ...d, paymentTerms: newVal }));
                      }}
                      fetchUrl={(q) => `/api/base/payment-terms?q=${q}`}
                      placeholder="Digite código ou descrição"
                      getLabel={(item) => `[${item.code}] ${item.description}`}
                      renderOption={(item) => (
                        <div>
                          <div className="font-medium">{item.description}</div>
                          <div className="text-xs text-gray-500">Código: {item.code} | Parcelas: {item.installments}</div>
                        </div>
                      )}
                    />
                  </div>
                  <div>
                    <span className="text-gray-600">Entrega</span>
                    <input type="date" className="mt-1 w-full px-2 py-1 border rounded" value={hdrDraft.deliveryDate ?? ''} onChange={(e) => setHdrDraft((d) => ({ ...d, deliveryDate: e.target.value }))} disabled={!isHeaderEditing} />
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-gray-600">Total Sem Imp R$</span>
                    <div className="mt-1 w-full px-2 py-1 border rounded bg-gray-50 text-gray-800">{fmtCurrency(globalTotalNoTax)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Com Imp R$</span>
                    <div className="mt-1 w-full px-2 py-1 border rounded bg-gray-50 text-gray-800">{fmtCurrency(globalTotalNoTax)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Peso (KG)</span>
                    <div className="mt-1 w-full px-2 py-1 border rounded bg-gray-50 text-gray-800">{fmtInt(globalWeight)}</div>
                  </div>
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" onClick={() => alert('Simulação de impostos: em desenvolvimento')}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Simular Impostos
                </button>
                <button className={ICON_BTN} title="Enviar para ERP" aria-label="Enviar para ERP" onClick={async () => {
                  if (!order) return;
                  try {
                    const res = await fetch(`/api/sales/orders/${order.id}`, {
                      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'Aguardando Integração', messages: ['Solicitado envio ao ERP via manutenção'] })
                    });
                    if (!res.ok) throw new Error('Falha ao enviar para ERP');
                    await refreshOrder();
                  } catch (e: any) { alert(e?.message || String(e)); }
                }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
                <button className={ICON_BTN} title="Excluir" aria-label="Excluir" onClick={async () => { if (!order) return; if (!confirm('Confirma excluir este pedido?')) return; const r = await fetch(`/api/sales/orders/${order.id}`, { method: 'DELETE' }); if (r.ok) router.push('/sales/orders'); }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
                {isHeaderEditing ? (
                  <>
                    <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-green-600" title="Salvar" aria-label="Salvar" onClick={() => saveHeader({ paymentTerms: hdrDraft.paymentTerms, deliveryDate: hdrDraft.deliveryDate, customerName: hdrDraft.customerName, customerDoc: hdrDraft.customerDoc })}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z"/></svg>
                    </button>
                    <button className="inline-flex items-center justify-center w-8 h-8 bg-red-50 border border-red-200 rounded shadow-sm hover:bg-red-100 text-red-600" title="Cancelar" aria-label="Cancelar" onClick={() => { setIsHeaderEditing(false); setHdrDraft({ paymentTerms: order.paymentTerms || '', deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().slice(0,10) : '', customerName: order.customerName || '', customerDoc: order.customerDoc || '' }); }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.59 16.89 4.29l1.41 1.42Z"/></svg>
                    </button>
                  </>
                ) : (
                  <button className={ICON_BTN} title="Editar" aria-label="Editar" onClick={() => setIsHeaderEditing(true)}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Histórico de situação */}
          <div className="border rounded bg-white">
            <div className="px-3 py-2 border-b flex items-center gap-2">
              <span className="text-sm text-gray-700">Histórico de situação</span>
              <button
                className={ICON_BTN}
                title={showHistory ? 'Ocultar histórico' : 'Mostrar histórico'}
                aria-label={showHistory ? 'Ocultar histórico' : 'Mostrar histórico'}
                onClick={() => setShowHistory((v) => !v)}
              >
                {showHistory ? (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 14l5-5 5 5H7z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
                )}
              </button>
              <button className="ml-auto px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100" onClick={refreshOrder}>Atualizar</button>
            </div>
            {showHistory && (
              <div className="p-3 space-y-3">
                {(order as any)?.statusHistory?.map((h: any) => (
                  <div key={h.id} className="border rounded p-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${statusChipStyle(statusLabelPt(h.status))}`}>{statusLabelPt(h.status)}</span>
                      <span className="text-xs text-gray-600">{new Date(h.changedAt).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-800 space-y-1">
                      {(h.messages || []).map((m: any, idx: number) => (
                        <div key={idx}>{String(m)}</div>
                      ))}
                    </div>
                  </div>
                ))}
                {!(order as any)?.statusHistory?.length && (
                  <div className="text-xs text-gray-500">Sem registros de histórico.</div>
                )}
              </div>
            )}
          </div>

          {/* Seção Itens + grupos por família */}
          <div className="border rounded bg-white">
            <div className="px-3 py-2 border-b flex items-center gap-2">
              <span className="text-sm text-gray-700">Itens</span>
              <button className="ml-auto px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100" onClick={() => { setAddingItems(true); searchClientItems(''); }}>Adicionar itens</button>
            </div>
            {addingItems && (
              <div className="p-3 border-b">
                <div className="flex items-center gap-2">
                  <input className="flex-1 px-2 py-1 border rounded" placeholder="Pesquisar itens do cliente" value={searchTerm} onChange={(e) => { const v = e.target.value; setSearchTerm(v); searchClientItems(v); }} />
                  <button className="px-2 py-1 text-xs border rounded" onClick={() => setAddingItems(false)}>Fechar</button>
                </div>
                <div className="mt-2">
                  {searchLoading && <div className="text-xs text-gray-500">Buscando…</div>}
                  {!searchLoading && searchResults.length === 0 && <div className="text-xs text-gray-500">Nenhum item vinculado ao cliente encontrado.</div>}
                  <ul className="divide-y">
                    {searchResults.map((it) => (
                      <li key={it.id} className="py-2 flex items-center gap-3">
                        <div className="flex-1">
                          <div className="text-sm">{it.name}</div>
                          <div className="text-xs text-gray-600">{it.sku || '-'} • {it.unit || '-'}</div>
                        </div>
                        <button className="px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100" onClick={() => addItemToOrder(it)}>Adicionar</button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
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
                      {(() => { const hasSheet = list.some(supportsSheetDims); return hasSheet ? (<><th className="p-2 text-left">Larg.</th><th className="p-2 text-left">Compr.</th><th className="p-2 text-left">Gram.</th></>) : null; })()}
                      {(() => { const hasCore = list.some(supportsCoreDims); return hasCore ? (<><th className="p-2 text-left">Diâmetro</th><th className="p-2 text-left">Tubete</th></>) : null; })()}
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
                      const hasSheet = list.some(supportsSheetDims);
                      const hasCore = list.some(supportsCoreDims);
                      const showWidthLengthGram = hasSheet && supportsSheetDims(it);
                      const showDiameterTube = hasCore && supportsCoreDims(it);
                      const isFeatures = showFeaturesFor === it.id;

                      return (
                        <React.Fragment key={it.id}>
                          <tr className="border-t">
                          <td className="p-2">{it.name}</td>
                          <td className="p-2">{it.sku || '-'}</td>
                          <td className="p-2">{it.unit || '-'}</td>
                          {list.some(supportsSheetDims) && (
                            <>
                              <td className="p-2">{showWidthLengthGram ? (isEditing ? (<input type="number" step="1" className="w-24 px-2 py-1 border rounded" value={draft.width ?? it.width ?? ''} onChange={(e) => setDraft((d) => ({ ...d, width: parseInt(e.target.value || '0', 10) }))} />) : (fmtInt(it.width ?? undefined))) : '-'}</td>
                              <td className="p-2">{showWidthLengthGram ? (isEditing ? (<input type="number" step="1" className="w-24 px-2 py-1 border rounded" value={draft.length ?? it.length ?? ''} onChange={(e) => setDraft((d) => ({ ...d, length: parseInt(e.target.value || '0', 10) }))} />) : (fmtInt(it.length ?? undefined))) : '-'}</td>
                              <td className="p-2">{showWidthLengthGram ? (isEditing ? (<input type="number" step="1" className="w-24 px-2 py-1 border rounded" value={draft.grammage ?? it.grammage ?? ''} onChange={(e) => setDraft((d) => ({ ...d, grammage: parseInt(e.target.value || '0', 10) }))} />) : (fmtInt(it.grammage ?? undefined))) : '-'}</td>
                            </>
                          )}
                          {list.some(supportsCoreDims) && (
                            <>
                              <td className="p-2">{showDiameterTube ? (isEditing ? (<input type="number" step="1" className="w-24 px-2 py-1 border rounded" value={draft.diameter ?? it.diameter ?? ''} onChange={(e) => setDraft((d) => ({ ...d, diameter: parseInt(e.target.value || '0', 10) }))} />) : (fmtInt(it.diameter ?? undefined))) : '-'}</td>
                              <td className="p-2">{showDiameterTube ? (isEditing ? (<input type="number" step="1" className="w-24 px-2 py-1 border rounded" value={draft.tube ?? it.tube ?? ''} onChange={(e) => setDraft((d) => ({ ...d, tube: parseInt(e.target.value || '0', 10) }))} />) : (fmtInt(it.tube ?? undefined))) : '-'}</td>
                            </>
                          )}
                          <td className="p-2">{isEditing ? (<input type="text" className="w-20 px-2 py-1 border rounded" value={draft.quantity ?? ''} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setDraft(d => ({ ...d, quantity: v === '' ? undefined : parseInt(v, 10) })) }} />) : it.quantity}</td>
                          <td className="p-2">{fmtInt(computeWeightKg(it, isEditing))}</td>
                          <td className="p-2">
                            {isEditing ? (
                              <input 
                                type="text" 
                                className="w-24 px-2 py-1 border rounded bg-gray-100 text-gray-600 cursor-not-allowed" 
                                value={(draft.unitPrice ?? it.unitPrice ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                                disabled 
                              />
                            ) : (
                              it.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                            )}
                          </td>
                          <td className="p-2">
                             {isEditing ? (
                               <input 
                                 type="text" 
                                 className="w-20 px-2 py-1 border rounded" 
                                 value={discountInput} 
                                 onChange={(e) => {
                                    const val = e.target.value;
                                    const filtered = val.replace(/[^0-9,]/g, '');
                                    const parts = filtered.split(',');
                                    const clean = parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
                                    setDiscountInput(clean);
                                    const num = parseFloat(clean.replace(',', '.'));
                                    setDraft(d => ({ ...d, discountPct: isNaN(num) ? 0 : num }));
                                 }} 
                               />
                             ) : (
                               `${it.discountPct.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                             )}
                          </td>
                          <td className="p-2">
                            <div className="flex items-center justify-center gap-2">
                              {/* Botão de Características sempre visível */}
                              <button 
                                className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" 
                                title="Características/Detalhes" 
                                aria-label="Características" 
                                onClick={() => setShowFeaturesFor(showFeaturesFor === it.id ? null : it.id)}
                              >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 0 0 1-2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>
                              </button>

                              {/* Ações de edição/exclusão ou salvar/cancelar */}
                              <div className="flex items-center gap-2">
                                {!isEditing ? (
                                  <>
                                    <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" title="Editar" aria-label="Editar" onClick={() => startEdit(it)}>
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" title="Excluir" aria-label="Excluir" onClick={async () => {
                                      if (!confirm('Confirma excluir este item?')) return;
                                      try {
                                        const res = await fetch(`/api/sales/orders/items/${it.id}`, { method: 'DELETE' });
                                        if (!res.ok) {
                                          const errData = await res.json().catch(() => ({}));
                                          throw new Error(errData.error || 'Falha ao excluir item');
                                        }
                                        await refreshOrder();
                                      } catch (e: any) { alert(e?.message || String(e)); }
                                    }}>
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-green-600" title="Salvar" aria-label="Salvar" onClick={saveEdit}>
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z"/></svg>
                                    </button>
                                    <button className="inline-flex items-center justify-center w-8 h-8 bg-red-50 border border-red-200 rounded shadow-sm hover:bg-red-100 text-red-600" title="Cancelar" aria-label="Cancelar" onClick={cancelEdit}>
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.59 16.89 4.29l1.41 1.42Z"/></svg>
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                        {isFeatures && (
                          <tr className="bg-gray-50 border-t-0 border-b">
                            <td colSpan={20} className="p-4">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Características</h4>
                                <div className="flex flex-wrap items-end gap-6">
                                  <div className="space-y-1">
                                    <label className="text-xs text-gray-600 block">Vincos</label>
                                    <div className="grid grid-cols-4 gap-2">
                                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                        <div key={n} className="flex items-center gap-1">
                                          <span className="text-xs text-gray-500 w-3">{n}</span>
                                          <input 
                                            type="number" 
                                            className="w-16 px-2 py-1 border rounded text-sm disabled:bg-gray-100 disabled:text-gray-500" 
                                            placeholder="0" 
                                            disabled={!isEditing}
                                            value={isEditing ? (draft.creases?.[n] ?? '') : (it.creases?.[n] ?? '')}
                                            onChange={(e) => {
                                              const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                                              setDraft(d => ({
                                                ...d,
                                                creases: { ...(d.creases || {}), [n]: val === undefined ? 0 : val }
                                              }));
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs text-gray-600 block">Pedido Cliente</label>
                                    <input 
                                      type="text" 
                                      className="w-48 px-2 py-1 border rounded text-sm disabled:bg-gray-100 disabled:text-gray-500" 
                                      disabled={!isEditing}
                                      value={isEditing ? (draft.clientOrderNumber ?? '') : (it.clientOrderNumber ?? '')}
                                      onChange={(e) => setDraft(d => ({ ...d, clientOrderNumber: e.target.value }))}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 pb-2">
                                    <input 
                                      type="checkbox" 
                                      id={`res-in-${it.id}`} 
                                      className="rounded border-gray-300 disabled:bg-gray-100" 
                                      disabled={!isEditing}
                                      checked={isEditing ? (draft.internalResin ?? false) : (it.internalResin ?? false)}
                                      onChange={(e) => setDraft(d => ({ ...d, internalResin: e.target.checked }))}
                                    />
                                    <label htmlFor={`res-in-${it.id}`} className={`text-sm ${!isEditing ? 'text-gray-500' : 'text-gray-700'}`}>Resina interna</label>
                                  </div>
                                  <div className="flex items-center gap-2 pb-2">
                                    <input 
                                      type="checkbox" 
                                      id={`res-out-${it.id}`} 
                                      className="rounded border-gray-300 disabled:bg-gray-100" 
                                      disabled={!isEditing}
                                      checked={isEditing ? (draft.externalResin ?? false) : (it.externalResin ?? false)}
                                      onChange={(e) => setDraft(d => ({ ...d, externalResin: e.target.checked }))}
                                    />
                                    <label htmlFor={`res-out-${it.id}`} className={`text-sm ${!isEditing ? 'text-gray-500' : 'text-gray-700'}`}>Resina externa</label>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  </tbody>
                </table>
              </div>
              {(() => {
                const subtotal = list.reduce((s, it) => {
                  const isEd = editingId === it.id;
                  const qty = isEd ? (draft.quantity ?? it.quantity) : it.quantity;
                  return s + (qty * it.unitPrice);
                }, 0);
                const discountTotal = list.reduce((s, it) => {
                  const isEd = editingId === it.id;
                  const qty = isEd ? (draft.quantity ?? it.quantity) : it.quantity;
                  const discount = isEd ? (draft.discountPct ?? it.discountPct) : it.discountPct;
                  return s + (qty * it.unitPrice * (discount / 100));
                }, 0);
                const total = subtotal - discountTotal;
                const totalWeight = list.reduce((s, it) => s + Math.round(computeWeightKg(it, editingId === it.id)), 0);
                return (
                  <div className="px-3 py-2 text-xs text-gray-700 flex gap-6 justify-end border-t">
                    <span>Subtotal: {fmtCurrency(subtotal)}</span>
                    <span>Descontos: {fmtCurrency(discountTotal)}</span>
                    <span>Total Sem Imp R$: {fmtCurrency(total)}</span>
                    <span>Total Peso (KG): {fmtInt(totalWeight)}</span>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}