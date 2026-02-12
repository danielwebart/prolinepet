"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

export type OrderItem = {
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
  inventoryItem?: any;
  creases?: Record<string, number> | null;
  clientOrderNumber?: string | null;
  clientOrderItemNumber?: number | null;
  itemDeliveryDate?: string | Date | null;
  internalResin?: boolean;
  externalResin?: boolean;
};

function useDebouncedCallback<T extends (...args: any[]) => any>(callback: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

export function supportsSheetDims(it: OrderItem): boolean {
  const fam = (it.inventoryItem?.commercialFamily?.name || '').toUpperCase();
  const name = (it.name || '').toUpperCase();
  if (fam.includes('CHAPA') || fam.includes('CHAPAS')) return true;
  if (name.includes('CHAPA') || name.includes('CHAPAS')) return true;
  return (it.width != null) || (it.length != null) || (it.grammage != null);
}

export function supportsCoreDims(it: OrderItem): boolean {
  const fam = (it.inventoryItem?.commercialFamily?.name || '').toUpperCase();
  const name = (it.name || '').toUpperCase();
  if (fam.includes('MIOL')) return true;
  if (name.includes('MIOL')) return true;
  return (it.diameter != null) || (it.tube != null);
}

interface SalesOrderItemRowProps {
  item: OrderItem;
  isOrderEditable: boolean;
  onPreviewUpdate: (updated: OrderItem) => void;
  onSaveSuccess?: () => void; // Optional for local mode
  onAutoSave?: (updated: OrderItem) => Promise<void>; // Optional custom saver
  onDelete: () => void;
  showFeatures: boolean;
  toggleFeatures: () => void;
  computeWeightKg: (it: OrderItem) => number;
  fmtInt: (n?: number) => string;
  hasSheetCol: boolean;
  hasCoreCol: boolean;
}

export const SalesOrderItemRow = ({
  item,
  isOrderEditable,
  onPreviewUpdate,
  onSaveSuccess,
  onAutoSave,
  onDelete,
  showFeatures,
  toggleFeatures,
  computeWeightKg,
  fmtInt,
  hasSheetCol,
  hasCoreCol
}: SalesOrderItemRowProps) => {
  const [localItem, setLocalItem] = useState<OrderItem>(item);
  const [discountInput, setDiscountInput] = useState(
    item.discountPct.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
  const [isSaving, setIsSaving] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [isEditingWeight, setIsEditingWeight] = useState(false);

  useEffect(() => {
    setLocalItem(prev => {
      if (JSON.stringify(prev) !== JSON.stringify(item)) {
        if (prev.discountPct !== item.discountPct) {
            setDiscountInput(item.discountPct.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }
        return item;
      }
      return prev;
    });
  }, [item]);

  // Sync weight input with item changes (unless editing)
  useEffect(() => {
    if (!isEditingWeight) {
        const w = computeWeightKg(localItem);
        setWeightInput(fmtInt(w));
    }
  }, [localItem, computeWeightKg, fmtInt, isEditingWeight]);

  const saveItem = async (data: Partial<OrderItem>) => {
    if (!onAutoSave) return; // Local mode only
    
    setIsSaving(true);
    try {
      // Merge with current localItem to ensure full object is passed if needed, 
      // but onAutoSave usually expects the full object or delta.
      // Here we assume onAutoSave takes the updated object.
      await onAutoSave({ ...localItem, ...data });
      if (onSaveSuccess) onSaveSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useDebouncedCallback(saveItem, 1000);

  const handleChange = (field: keyof OrderItem, value: any) => {
    const updated = { ...localItem, [field]: value };
    setLocalItem(updated);
    onPreviewUpdate(updated); // Immediate update for UI/Calculations
    if (onAutoSave) {
        debouncedSave(updated); // Delayed save for API
    }
  };

  const handleDiscountChange = (val: string) => {
    const filtered = val.replace(/[^0-9,]/g, '');
    const parts = filtered.split(',');
    const clean = parts[0] + (parts.length > 1 ? ',' + parts.slice(1).join('') : '');
    setDiscountInput(clean);
    
    const num = parseFloat(clean.replace(',', '.'));
    const validNum = isNaN(num) ? 0 : num;
    
    handleChange('discountPct', validNum);
  };

  const handleWeightChange = (val: string) => {
    setWeightInput(val);
    
    // Parse PT-BR format: remove dots (thousands), replace comma with dot
    const clean = val.replace(/\./g, '').replace(',', '.');
    const w = parseFloat(clean);
    
    if (!isNaN(w) && w >= 0) {
        const unitItem = { ...localItem, quantity: 1 };
        const unitWeight = computeWeightKg(unitItem);
        
        if (unitWeight > 0) {
            const newQty = Math.round(w / unitWeight);
            if (newQty !== localItem.quantity && newQty > 0) {
                 handleChange('quantity', newQty);
            }
        }
    }
  };

  const showWidthLengthGram = supportsSheetDims(localItem);
  const showDiameterTube = supportsCoreDims(localItem);
  const canEdit = isOrderEditable;
  const disabledClass = "bg-gray-100 text-gray-500";

  return (
    <>
      <tr className={`border-t ${isSaving ? 'bg-blue-50' : ''}`}>
        <td className="p-2">
            <div className="flex flex-col">
                <span>{localItem.name}</span>
                {isSaving && <span className="text-[10px] text-blue-600 animate-pulse">Salvando...</span>}
            </div>
        </td>
        <td className="p-2">{localItem.sku || '-'}</td>
        <td className="p-2">{localItem.unit || '-'}</td>
        
        {hasSheetCol && (
            <>
                <td className="p-2">{showWidthLengthGram ? (
                    <input 
                        type="number" step="1" 
                        className={`w-24 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                        disabled={!canEdit}
                        value={localItem.width ?? ''} 
                        onChange={(e) => handleChange('width', e.target.value ? parseInt(e.target.value, 10) : null)} 
                    />
                ) : '-'}</td>
                <td className="p-2">{showWidthLengthGram ? (
                    <input 
                        type="number" step="1" 
                        className={`w-24 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                        disabled={!canEdit}
                        value={localItem.length ?? ''} 
                        onChange={(e) => handleChange('length', e.target.value ? parseInt(e.target.value, 10) : null)} 
                    />
                ) : '-'}</td>
                <td className="p-2">{showWidthLengthGram ? (
                    <input 
                        type="number" step="1" 
                        className={`w-24 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                        disabled={!canEdit}
                        value={localItem.grammage ?? ''} 
                        onChange={(e) => handleChange('grammage', e.target.value ? parseInt(e.target.value, 10) : null)} 
                    />
                ) : '-'}</td>
            </>
        )}

        {hasCoreCol && (
            <>
                <td className="p-2">{showDiameterTube ? (
                    <input 
                        type="number" step="1" 
                        className={`w-24 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                        disabled={!canEdit}
                        value={localItem.diameter ?? ''} 
                        onChange={(e) => handleChange('diameter', e.target.value ? parseInt(e.target.value, 10) : null)} 
                    />
                ) : '-'}</td>
                <td className="p-2">{showDiameterTube ? (
                    <input 
                        type="number" step="1" 
                        className={`w-24 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                        disabled={!canEdit}
                        value={localItem.tube ?? ''} 
                        onChange={(e) => handleChange('tube', e.target.value ? parseInt(e.target.value, 10) : null)} 
                    />
                ) : '-'}</td>
            </>
        )}

        <td className="p-2">
            <input 
                type="text" 
                className={`w-20 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                disabled={!canEdit}
                value={localItem.quantity ?? ''} 
                onChange={(e) => { 
                    const v = e.target.value.replace(/\D/g, ''); 
                    handleChange('quantity', v === '' ? undefined : parseInt(v, 10));
                }} 
            />
        </td>
        <td className="p-2">
            <input 
                type="text" 
                className={`w-24 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                disabled={!canEdit}
                value={weightInput} 
                onChange={(e) => handleWeightChange(e.target.value)}
                onFocus={() => setIsEditingWeight(true)}
                onBlur={() => {
                    setIsEditingWeight(false);
                    setWeightInput(fmtInt(computeWeightKg(localItem)));
                }}
            />
        </td>
        <td className="p-2">
            <input 
                type="text" 
                className="w-24 px-2 py-1 border rounded bg-gray-100 text-gray-600 cursor-not-allowed" 
                value={(localItem.unitPrice ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                disabled 
            />
        </td>
        <td className="p-2">
            <input 
                type="text" 
                className={`w-20 px-2 py-1 border rounded ${!canEdit ? disabledClass : ''}`}
                disabled={!canEdit}
                value={discountInput} 
                onChange={(e) => handleDiscountChange(e.target.value)} 
            />
        </td>
        <td className="p-2">
            <div className="flex items-center justify-center gap-2">
                <button 
                className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700" 
                title="Características/Detalhes" 
                onClick={toggleFeatures}
                >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 0 0 1-2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"></path></svg>
                </button>
                <button className={`inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 text-gray-700 ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`} title="Excluir" disabled={!canEdit} onClick={onDelete}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </td>
      </tr>
      {showFeatures && (
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
                        className={`w-16 px-2 py-1 border rounded text-sm ${!canEdit ? disabledClass : ''}`}
                        placeholder="0" 
                        disabled={!canEdit}
                        value={localItem.creases?.[n] ?? ''}
                        onChange={(e) => {
                            const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                            const newCreases = { ...(localItem.creases || {}), [n]: val === undefined ? 0 : val };
                            handleChange('creases', newCreases);
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
                    className={`w-48 px-2 py-1 border rounded text-sm ${!canEdit ? disabledClass : ''}`}
                    disabled={!canEdit}
                    value={localItem.clientOrderNumber ?? ''}
                    onChange={(e) => handleChange('clientOrderNumber', e.target.value)}
                />
                </div>
                <div className="space-y-1">
                <label className="text-xs text-gray-600 block">Item Pedido</label>
                <input 
                    type="number" 
                    className={`w-24 px-2 py-1 border rounded text-sm ${!canEdit ? disabledClass : ''}`}
                    disabled={!canEdit}
                    value={localItem.clientOrderItemNumber ?? ''}
                    onChange={(e) => handleChange('clientOrderItemNumber', e.target.value ? Number(e.target.value) : null)}
                />
                </div>
                <div className="space-y-1">
                <label className="text-xs text-gray-600 block">Data Entrega</label>
                <input 
                    type="date" 
                    className={`w-32 px-2 py-1 border rounded text-sm ${!canEdit ? disabledClass : ''}`}
                    disabled={!canEdit}
                    value={localItem.itemDeliveryDate ? new Date(localItem.itemDeliveryDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleChange('itemDeliveryDate', e.target.value ? new Date(e.target.value) : null)}
                />
                </div>
                <div className="flex items-center gap-2 pb-2">
                <input 
                    type="checkbox" 
                    id={`res-in-${localItem.id}`} 
                    className="rounded border-gray-300 disabled:bg-gray-100" 
                    disabled={!canEdit}
                    checked={localItem.internalResin ?? false}
                    onChange={(e) => handleChange('internalResin', e.target.checked)}
                />
                <label htmlFor={`res-in-${localItem.id}`} className={`text-sm ${!canEdit ? 'text-gray-500' : 'text-gray-700'}`}>Resina interna</label>
                </div>
                <div className="flex items-center gap-2 pb-2">
                <input 
                    type="checkbox" 
                    id={`res-out-${localItem.id}`} 
                    className="rounded border-gray-300 disabled:bg-gray-100" 
                    disabled={!canEdit}
                    checked={localItem.externalResin ?? false}
                    onChange={(e) => handleChange('externalResin', e.target.checked)}
                />
                <label htmlFor={`res-out-${localItem.id}`} className={`text-sm ${!canEdit ? 'text-gray-500' : 'text-gray-700'}`}>Resina externa</label>
                </div>
            </div>
            </div>
        </td>
        </tr>
      )}
    </>
  );
};
