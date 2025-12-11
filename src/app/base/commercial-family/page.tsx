"use client";
import React, { useEffect, useMemo, useState } from "react";

type CommercialFamily = { id: number; description: string; erpCode?: string | null };

export default function CommercialFamilyPage() {
  const [items, setItems] = useState<CommercialFamily[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");

  // Form state
  const [editId, setEditId] = useState<number | null>(null);
  const [description, setDescription] = useState<string>("");
  const [erpCode, setErpCode] = useState<string>("");

  const filtered = useMemo(() => items, [items]);

  const load = async (query?: string) => {
    setLoading(true); setErr(null);
    try {
      const url = query && query.trim() ? `/api/base/commercial-families?q=${encodeURIComponent(query.trim())}` : "/api/base/commercial-families";
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setEditId(null); setDescription(""); setErpCode("");
  };

  const startEdit = (cf: CommercialFamily) => {
    setEditId(cf.id);
    setDescription(cf.description || "");
    setErpCode(cf.erpCode || "");
  };

  const save = async () => {
    setLoading(true); setErr(null);
    try {
      const payload: any = { description: description.trim(), erpCode: erpCode.trim() || null };
      if (!payload.description) throw new Error("Descrição é obrigatória");
      let res: Response;
      if (editId) {
        res = await fetch(`/api/base/commercial-families/${editId}` , { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`/api/base/commercial-families`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`);
      await load(q);
      resetForm();
    } catch (e: any) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  };

  const remove = async (id: number) => {
    if (!confirm("Excluir família comercial?")) return;
    setLoading(true); setErr(null);
    try {
      const res = await fetch(`/api/base/commercial-families/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Erro ${res.status}`);
      await load(q);
    } catch (e: any) { setErr(e?.message || String(e)); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Base • Família Comercial</h1>

      <div className="flex gap-2 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pesquisar por descrição"
          className="border rounded px-3 py-2 w-64"
        />
        <button onClick={() => load(q)} className="px-3 py-2 bg-blue-600 text-white rounded">Pesquisar</button>
        <button onClick={() => { resetForm(); }} className="px-3 py-2 bg-gray-600 text-white rounded">Novo</button>
        {loading && <span className="text-sm text-gray-600">Carregando…</span>}
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>

      {/* Formulário de inclusão/edição */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
        <div>
          <label className="block text-sm text-gray-700">ID</label>
          <input value={editId ?? ''} readOnly className="border rounded px-3 py-2 w-full bg-gray-100" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Descrição</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Código ERP</label>
          <input value={erpCode} onChange={(e) => setErpCode(e.target.value)} className="border rounded px-3 py-2 w-full" />
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="px-3 py-2 bg-green-600 text-white rounded">{editId ? "Salvar alterações" : "Incluir"}</button>
          {editId && <button onClick={resetForm} className="px-3 py-2 bg-gray-500 text-white rounded">Cancelar</button>}
        </div>
      </div>

      {/* Listagem */}
      <div className="border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 w-24">ID</th>
              <th className="text-left p-2">Descrição</th>
              <th className="text-left p-2">Código ERP</th>
              <th className="text-left p-2 w-48">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cf) => (
              <tr key={cf.id} className="border-t">
                <td className="p-2">{cf.id}</td>
                <td className="p-2">{cf.description}</td>
                <td className="p-2">{cf.erpCode || '-'}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(cf)} className="px-2 py-1 bg-yellow-600 text-white rounded">Editar</button>
                    <button onClick={() => remove(cf.id)} className="px-2 py-1 bg-red-600 text-white rounded">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td className="p-3 text-gray-500" colSpan={3}>Nenhum registro encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}