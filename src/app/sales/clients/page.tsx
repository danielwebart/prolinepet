"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: number;
  doc?: string | null;
  name: string;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
};

function maskDoc(doc?: string | null): string {
  const d = String(doc || "").replace(/\D+/g, "");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  return d;
}

export default function SalesClientsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = q.trim() ? `/api/base/clients?q=${encodeURIComponent(q.trim())}` : "/api/base/clients";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Força de Vendas • Clientes</h1>

      <div className="flex gap-2 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, cidade, UF, doc ou ID"
          className="border px-3 py-2 rounded w-96"
        />
        <button onClick={load} className="px-3 py-2 bg-blue-600 text-white rounded">Buscar</button>
      </div>

      <div className="border rounded bg-white">
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
            {items.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2"><span>{maskDoc(c.doc)}</span></td>
                <td className="p-2"><span>{c.name}</span></td>
                <td className="p-2"><span>{c.cidade || ""}</span></td>
                <td className="p-2"><span>{c.estado || ""}</span></td>
                <td className="p-2">
                  <button
                    onClick={() => router.push(`/sales/clients/${c.id}`)}
                    className="px-2 py-1 bg-gray-800 text-white rounded"
                  >Abrir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-2 text-gray-600">Carregando...</div>}
        {error && <div className="p-2 text-red-600">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="p-2 text-gray-600">Nenhum cliente encontrado</div>
        )}
      </div>
    </div>
  );
}
