"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
  status: string;
  orderDate: string;
  customerName: string;
  customerId?: number;
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
  if (fam.includes('CHAPA') || fam.includes('CHAPAS')) return true;
  if (name.includes('CHAPA') || name.includes('CHAPAS')) return true;
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
  return 'bg-gray-100 text-gray-800 border border-gray-300';
}

function statusLabelPt(s?: string): string {
  return 'Novo';
}

const minChars = 1;

const AsyncSelect = ({ 
  label, 
  value, 
  onChange, 
  onSelectObj,
  fetchUrl, 
  placeholder,
  renderOption,
  getLabel
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void;
  onSelectObj?: (obj: any) => void;
  fetchUrl: (q: string) => string; 
  placeholder?: string;
  renderOption: (item: any) => React.ReactNode;
  getLabel: (item: any) => string;
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

export default function NewSalesOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerIdParam = searchParams.get('customerId');
  
  // Initial empty order
  const [order, setOrder] = useState<Partial<SalesOrder>>({
    status: 'OPEN',
    orderDate: new Date().toISOString(),
    customerName: '',
    customerId: undefined,
    paymentTerms: '',
    deliveryDate: '',
    items: [],
    subtotal: 0,
    discountTotal: 0,
    total: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (customerIdParam) {
      fetch(`/api/base/clients?q=${customerIdParam}`)
        .then(r => r.json())
        .then(arr => {
          if (Array.isArray(arr)) {
            const c = arr.find((x: any) => String(x.id) === customerIdParam);
            if (c) {
              setOrder(prev => ({ ...prev, customerName: c.name, customerDoc: c.doc, customerId: c.id }));
            }
          }
        })
        .catch(console.error);
    }
  }, [customerIdParam]);
  
  // Editing logic (reused)
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<OrderItem>>({});
  const [showFeaturesFor, setShowFeaturesFor] = useState<number | null>(null);
  
  // Item search
  const [addingItems, setAddingItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<InventoryItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const searchClientItems = async (term: string) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    if (!order.customerId) {
      setSearchResults([]);
      return;
    }
    
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('q', term);
      params.set('clientId', String(order.customerId));
      
      const res = await fetch(`/api/items?${params.toString()}`);
      if (res.ok) {
        let data = await res.json();
        setSearchResults(data.slice(0, 20));
      }
    } catch (e) {
      console.error(e);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const addItemToOrder = (invItem: InventoryItem) => {
    const newItem: OrderItem = {
      id: -Date.now(), // Temp ID
      name: invItem.name,
      sku: invItem.sku,
      unit: invItem.unit,
      quantity: 1,
      unitPrice: 0,
      discountPct: 0,
      inventoryItem: invItem
    };
    
    setOrder(prev => {
      const currentItems = prev.items || [];
      return {
        ...prev,
        items: [...currentItems, newItem]
      };
    });
    setAddingItems(false);
    setSearchTerm('');
  };

  const removeItem = (id: number) => {
    if (!confirm('Confirma excluir este item?')) return;
    setOrder(prev => ({
      ...prev,
      items: (prev.items || []).filter(it => it.id !== id)
    }));
  };

  const startEdit = (it: OrderItem) => {
    setEditingId(it.id);
    setDraft({
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      discountPct: it.discountPct,
      width: it.width ?? undefined,
      length: it.length ?? undefined,
      grammage: it.grammage ?? undefined,
      diameter: it.diameter ?? undefined,
      tube: it.tube ?? undefined,
    });
  };
  
  const cancelEdit = () => { setEditingId(null); setDraft({}); };

  const saveEdit = () => {
    if (!editingId) return;
    setOrder(prev => ({
      ...prev,
      items: (prev.items || []).map(it => 
        it.id === editingId ? { ...it, ...draft } : it
      )
    }));
    setEditingId(null); 
    setDraft({});
  };

  const saveOrder = async () => {
    if (!order.customerName) {
      alert('Informe o nome do cliente');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/sales/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: order.customerName,
          paymentTerms: order.paymentTerms,
          deliveryDate: order.deliveryDate,
          items: order.items?.map(it => ({
            inventoryItemId: it.inventoryItem?.id,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            discountPct: it.discountPct,
            width: it.width,
            length: it.length,
            grammage: it.grammage,
            diameter: it.diameter,
            tube: it.tube
          }))
        })
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Falha ao salvar pedido');
      }
      
      const saved = await res.json();
      router.push(`/sales/orders/${saved.id}`);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fmtCurrency = (n: number | undefined) => (n ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtNumber = (n: number | undefined) => (n ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n: number | undefined) => Math.round(n ?? 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 });

  const computeWeightKg = (it: OrderItem, useDraft = false): number => {
    const hasDims = supportsSheetDims(it);
    if (hasDims) {
      const w = (useDraft ? (draft.width ?? it.width) : it.width) ?? 0;
      const l = (useDraft ? (draft.length ?? it.length) : it.length) ?? 0;
      const g = (useDraft ? (draft.grammage ?? it.grammage) : it.grammage) ?? 0;
      const q = (useDraft ? (draft.quantity ?? it.quantity) : it.quantity) ?? 0;
      if (w > 0 && l > 0 && g > 0 && q > 0) {
        const areaM2 = (l / 1000) * (w / 1000);
        const weightKg = (areaM2 * g * q) / 1000;
        return weightKg;
      }
    }
    return 0;
  };

  const globalItems = order.items || [];
  const globalSubtotal = globalItems.reduce((s, it) => s + (it.quantity * it.unitPrice), 0);
  const globalDiscount = globalItems.reduce((s, it) => s + (it.quantity * it.unitPrice * (it.discountPct / 100)), 0);
  const globalTotalNoTax = globalSubtotal - globalDiscount;
  const globalWeight = globalItems.reduce((s, it) => s + Math.round(computeWeightKg(it, false)), 0);

  const groups = useMemo(() => {
    const out = new Map<string, OrderItem[]>();
    for (const it of (order.items || [])) {
      const key = familyName(it);
      const arr = out.get(key) || [];
      arr.push(it);
      out.set(key, arr);
    }
    return Array.from(out.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [order.items]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Novo Pedido</h1>
          <span className={`text-xs px-2 py-1 rounded ${statusChipStyle()}`}>
            {statusLabelPt()}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 border rounded" title="Voltar" aria-label="Voltar" onClick={() => router.back()}>
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"/></svg>
              Voltar
            </span>
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Salvando...</div>}
      
      <div className="space-y-6">
        {/* Header */}
        <div className="border rounded bg-white p-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
              <div>
                <span className="text-gray-600">Número</span>
                <div className="font-mono mt-1 text-gray-400">(Automático)</div>
              </div>
              <div>
                <span className="text-gray-600">Data</span>
                <div className="mt-1">{new Date().toLocaleDateString('pt-BR')}</div>
              </div>
              <div>
                <AsyncSelect
                  label="Cliente"
                  value={order.customerName || ''}
                  onChange={(val) => setOrder(prev => ({ ...prev, customerName: val }))}
                  onSelectObj={(c) => setOrder(prev => ({ ...prev, customerName: c.name, customerDoc: c.doc, customerId: c.id }))}
                  fetchUrl={(q) => `/api/base/clients?q=${q}`}
                  placeholder="Busque por nome ou documento"
                  getLabel={(c) => c.name}
                  renderOption={(c) => (
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.doc}</div>
                    </div>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <AsyncSelect
                    label="Condição de pagamento"
                    value={order.paymentTerms || ''}
                    onChange={(val) => setOrder(prev => ({ ...prev, paymentTerms: val }))}
                    fetchUrl={(q) => `/api/base/payment-terms?q=${q}`}
                    placeholder="Busque por descrição ou código"
                    getLabel={(item) => item.description}
                    renderOption={(item) => (
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-xs text-gray-500">Cód: {item.code} - Parcelas: {item.installments}</div>
                      </div>
                    )}
                  />
                </div>
                <div>
                  <span className="text-gray-600">Entrega</span>
                  <input 
                    type="date" 
                    className="mt-1 w-full px-2 py-1 border rounded" 
                    value={order.deliveryDate ?? ''} 
                    onChange={(e) => setOrder(prev => ({ ...prev, deliveryDate: e.target.value }))} 
                  />
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
              <button className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 border border-gray-300 rounded shadow-sm text-gray-400 cursor-not-allowed" disabled title="Simulação de impostos (Bloqueado na criação)">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Simular Impostos
              </button>
              {/* Send to ERP - Disabled */}
              <button className={`${ICON_BTN} opacity-50 cursor-not-allowed`} title="Enviar para ERP (Desabilitado)" disabled>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
              {/* Delete - Disabled */}
              <button className={`${ICON_BTN} opacity-50 cursor-not-allowed`} title="Excluir (Desabilitado)" disabled>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
              {/* Save Order instead of Edit */}
              <button className={`${ICON_BTN} text-green-600 border-green-200 bg-green-50 hover:bg-green-100`} title="Salvar Pedido" onClick={saveOrder}>
                 <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Itens */}
        <div className="border rounded bg-white">
          <div className="px-3 py-2 border-b flex items-center gap-2">
            <span className="text-sm text-gray-700">Itens</span>
            <button className="ml-auto px-2 py-1 text-xs border rounded bg-white hover:bg-gray-100" onClick={() => { setAddingItems(true); }}>Adicionar itens</button>
          </div>
          {addingItems && (
            <div className="p-3 border-b">
              <div className="flex items-center gap-2">
                <input 
                  className="flex-1 px-2 py-1 border rounded" 
                  placeholder="Pesquisar itens (digite para buscar)" 
                  value={searchTerm} 
                  onChange={(e) => { 
                    const v = e.target.value; 
                    setSearchTerm(v); 
                    searchClientItems(v); 
                  }} 
                />
                <button className="px-2 py-1 text-xs border rounded" onClick={() => setAddingItems(false)}>Fechar</button>
              </div>
              <div className="mt-2">
                {searchResults.length === 0 && searchTerm && <div className="text-xs text-gray-500">Nenhum item encontrado.</div>}
                <ul className="divide-y max-h-60 overflow-auto">
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

        {/* Groups */}
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
                    const showWidthLengthGram = supportsSheetDims(it);
                    const showDiameterTube = supportsCoreDims(it);
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
                          <td className="p-2">{isEditing ? (<input type="number" className="w-20 px-2 py-1 border rounded" value={draft.quantity ?? it.quantity} onChange={(e) => setDraft((d) => ({ ...d, quantity: Number(e.target.value) }))} />) : it.quantity}</td>
                          <td className="p-2">{fmtInt(computeWeightKg(it, isEditing))}</td>
                          <td className="p-2">
                             {isEditing ? (
                               <input type="number" step="0.01" className="w-24 px-2 py-1 border rounded" value={draft.unitPrice ?? it.unitPrice} onChange={(e) => setDraft((d) => ({ ...d, unitPrice: Number(e.target.value) }))} />
                             ) : (
                               it.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                             )}
                          </td>
                          <td className="p-2">
                             {isEditing ? (
                               <input type="number" step="0.01" className="w-16 px-2 py-1 border rounded" value={draft.discountPct ?? it.discountPct} onChange={(e) => setDraft((d) => ({ ...d, discountPct: Number(e.target.value) }))} />
                             ) : (
                               `${it.discountPct}%`
                             )}
                          </td>
                          <td className="p-2">
                            {!isEditing ? (
                              <div className="flex items-center justify-center gap-2">
                                <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" title="Características do item" aria-label="Características" onClick={() => setShowFeaturesFor(showFeaturesFor === it.id ? null : it.id)}>
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 0 0 1-2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>
                                </button>
                                <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" title="Editar" aria-label="Editar" onClick={() => startEdit(it)}>
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" title="Excluir" aria-label="Excluir" onClick={() => removeItem(it.id)}>
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-2">
                                <button className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-green-600" title="Salvar" aria-label="Salvar" onClick={saveEdit}>
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z"/></svg>
                                </button>
                                <button className="inline-flex items-center justify-center w-8 h-8 bg-red-50 border border-red-200 rounded shadow-sm hover:bg-red-100 text-red-600" title="Cancelar" aria-label="Cancelar" onClick={cancelEdit}>
                                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.3 9.17 12 2.88 5.71 4.29 4.29 10.59 10.59 16.89 4.29l1.41 1.42Z"/></svg>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                        {isFeatures && (
                          <tr className="bg-gray-50 border-t-0 border-b">
                            <td colSpan={20} className="p-4">
                              <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Características (Desabilitado na criação)</h4>
                                <div className="text-xs text-gray-500">Salve o pedido para editar características.</div>
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
              const subtotal = list.reduce((s, it) => s + (it.quantity * it.unitPrice), 0);
              const discountTotal = list.reduce((s, it) => s + (it.quantity * it.unitPrice * (it.discountPct / 100)), 0);
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
    </div>
  );
}