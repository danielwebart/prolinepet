"use client";
import React, { useEffect, useMemo, useState } from "react";

type Client = {
  id: number;
  doc: string;
  name: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

function maskDoc(doc: string): string {
  const d = (doc || "").replace(/\D+/g, "");
  if (d.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  } else if (d.length === 11) {
    // CPF: 000.000.000-00
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return d;
}

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [add, setAdd] = useState<Client>({ id: 0, doc: "", name: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", estado: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Client | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = q.trim() ? `/api/base/clients?q=${encodeURIComponent(q.trim())}` : '/api/base/clients';
      const res = await fetch(url);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onAdd = async () => {
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/base/clients/${editingId}` : '/api/base/clients';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(add) });
      if (!res.ok) throw new Error(editingId ? 'Falha ao salvar alterações' : 'Falha ao incluir cliente');
      setAdd({ id: 0, doc: "", name: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", estado: "" });
      setEditingId(null);
      setShowAdd(false);
      await load();
    } catch (err: any) {
      alert(String(err?.message || err));
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Excluir este cliente?')) return;
    try {
      const res = await fetch(`/api/base/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir');
      await load();
    } catch (err: any) {
      alert(String(err?.message || err));
    }
  };

  const startEdit = (c: Client) => {
    setEditingId(c.id);
    setAdd({ ...c });
    setShowAdd(true);
    setEditDraft(null);
  };
  const cancelEdit = () => { setEditingId(null); setEditDraft(null); };
  const saveEdit = async () => {
    if (!editingId || !editDraft) return;
    try {
      const res = await fetch(`/api/base/clients/${editingId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editDraft) });
      if (!res.ok) throw new Error('Falha ao salvar');
      setEditingId(null);
      setEditDraft(null);
      await load();
    } catch (err: any) { alert(String(err?.message || err)); }
  };

  const lookupDoc = async () => {
    const doc = (add.doc || '').replace(/\D+/g, '');
    if (doc.length === 14) {
      try {
        const r = await fetch(`/api/cnpj?cnpj=${doc}`);
        const j = await r.json();
        setAdd((prev) => ({
          ...prev,
          name: j?.name ?? prev.name,
          logradouro: j?.logradouro ?? prev.logradouro,
          numero: j?.numero ? String(j.numero) : prev.numero,
          bairro: j?.bairro ?? prev.bairro,
          cidade: j?.cidade ?? prev.cidade,
          estado: j?.estado ?? prev.estado,
          cep: j?.cep ? String(j.cep).replace(/\D+/g, '') : prev.cep,
        }));
      } catch {}
    }
  };

  const lookupCep = async () => {
    const cep = (add.cep || '').replace(/\D+/g, '');
    if (cep.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const j = await r.json();
      if (!j?.erro) {
        setAdd((prev) => ({
          ...prev,
          logradouro: j.logradouro || prev.logradouro,
          bairro: j.bairro || prev.bairro,
          cidade: j.localidade || prev.cidade,
          estado: j.uf || prev.estado,
        }));
      }
    } catch {}
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Clientes</h1>

      <div className="flex gap-2 items-center">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, cidade ou estado" className="border px-3 py-2 rounded w-96" />
        <button onClick={load} className="px-3 py-2 bg-blue-600 text-white rounded">Buscar</button>
        <button
          onClick={() => {
            setShowAdd((s) => {
              const next = !s;
              if (next) {
                setEditingId(null);
                setAdd({ id: 0, doc: "", name: "", cep: "", logradouro: "", numero: "", bairro: "", cidade: "", estado: "" });
              }
              return next;
            });
          }}
          className="ml-auto px-3 py-2 bg-green-600 text-white rounded"
        >
          Incluir Cliente
        </button>
      </div>

      {showAdd && (
        <div className="border rounded p-3 space-y-2 bg-gray-50">
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <label className="text-sm">Cnpj/Cpf</label>
              <input value={add.doc || ''} onChange={(e) => setAdd((prev) => ({ ...prev, doc: e.target.value }))} placeholder="Somente números" className="border px-3 py-2 rounded w-64" />
              <span className="text-xs text-gray-500">{maskDoc(add.doc || '')}</span>
            </div>
            <button onClick={lookupDoc} className="px-3 py-2 bg-gray-800 text-white rounded">Buscar</button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm">Nome</label>
              <input value={add.name || ''} onChange={(e) => setAdd((prev) => ({ ...prev, name: e.target.value }))} className="border px-3 py-2 rounded w-full" />
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div>
              <label className="text-sm">CEP</label>
              <input value={add.cep || ''} onChange={(e) => setAdd((prev) => ({ ...prev, cep: e.target.value }))} className="border px-3 py-2 rounded w-32" />
            </div>
            <button onClick={lookupCep} className="px-3 py-2 bg-gray-800 text-white rounded">Buscar</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Logradouro</label>
              <input value={add.logradouro || ''} onChange={(e) => setAdd((prev) => ({ ...prev, logradouro: e.target.value }))} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Numero</label>
              <input value={add.numero || ''} onChange={(e) => setAdd((prev) => ({ ...prev, numero: e.target.value }))} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Bairro</label>
              <input value={add.bairro || ''} onChange={(e) => setAdd((prev) => ({ ...prev, bairro: e.target.value }))} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Cidade</label>
              <input value={add.cidade || ''} onChange={(e) => setAdd((prev) => ({ ...prev, cidade: e.target.value }))} className="border px-3 py-2 rounded w-full" />
            </div>
            <div>
              <label className="text-sm">Estado</label>
              <input value={add.estado || ''} onChange={(e) => setAdd((prev) => ({ ...prev, estado: e.target.value }))} className="border px-3 py-2 rounded w-full" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onAdd} className="px-3 py-2 bg-green-600 text-white rounded">Salvar</button>
            <button onClick={() => { setShowAdd(false); setEditingId(null); }} className="px-3 py-2 bg-gray-300 text-gray-900 rounded">Cancelar</button>
          </div>
        </div>
      )}

      <div className="border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Doc</th>
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Cidade</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => {
              const isEditing = editingId === c.id && !showAdd;
              return (
                <tr key={c.id} className="border-t">
                  <td className="p-2">
                    {isEditing ? (
                      <input value={editDraft?.doc || ''} onChange={(e) => setEditDraft((prev) => ({ ...(prev as Client), doc: e.target.value }))} className="border px-2 py-1 rounded w-40" />
                    ) : (
                      <span>{maskDoc(c.doc || '')}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input value={editDraft?.name || ''} onChange={(e) => setEditDraft((prev) => ({ ...(prev as Client), name: e.target.value }))} className="border px-2 py-1 rounded w-64" />
                    ) : (
                      <span>{c.name}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input value={editDraft?.cidade || ''} onChange={(e) => setEditDraft((prev) => ({ ...(prev as Client), cidade: e.target.value }))} className="border px-2 py-1 rounded w-40" />
                    ) : (
                      <span>{c.cidade || ''}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {isEditing ? (
                      <input value={editDraft?.estado || ''} onChange={(e) => setEditDraft((prev) => ({ ...(prev as Client), estado: e.target.value }))} className="border px-2 py-1 rounded w-24" />
                    ) : (
                      <span>{c.estado || ''}</span>
                    )}
                  </td>
                  <td className="p-2">
                    {!isEditing ? (
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(c)} className="px-2 py-1 bg-yellow-500 text-white rounded">Editar</button>
                        <button onClick={() => onDelete(c.id)} className="px-2 py-1 bg-red-600 text-white rounded">Excluir</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="px-2 py-1 bg-green-600 text-white rounded">Salvar</button>
                        <button onClick={cancelEdit} className="px-2 py-1 bg-gray-300 text-gray-900 rounded">Cancelar</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && <div className="p-2 text-gray-600">Carregando...</div>}
        {error && <div className="p-2 text-red-600">{error}</div>}
        {!loading && !error && items.length === 0 && <div className="p-2 text-gray-600">Nenhum cliente encontrado</div>}
      </div>
    </div>
  );
}