"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "./Sidebar";
import ProgramGuard from "./ProgramGuard";

type Entity = { id: number; name: string; cnpj?: string };
type Program = { code: string; name: string };
type ModulePerm = { code: string; name: string; programs: Program[] };
type Permissions = { activeEntityId: number | null; entities: Entity[]; modules: ModulePerm[] };

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as string | undefined;
  const isLogin = pathname === "/login";
  if (isLogin) {
    return <main className="min-h-screen">{children}</main>;
  }
  const [perms, setPerms] = useState<Permissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoSelected, setAutoSelected] = useState(false);
  const activeEntityId = (perms?.activeEntityId ?? null);

  const loadPerms = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/permissions', { cache: 'no-store' });
      const j = await r.json();
      setPerms(j);
      // Fallback: tentar selecionar a primeira entidade apenas UMA vez para evitar loop
      if (!autoSelected && !j?.activeEntityId && Array.isArray(j?.entities) && j.entities.length > 0) {
        setAutoSelected(true);
        await onChangeEntity(Number(j.entities[0].id));
      }
    } catch (err) {
      // Em caso de erro, manter perms como está e sair do estado de loading
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadPerms(); }, []);

  const onChangeEntity = async (id: number) => {
    try {
      const r = await fetch('/api/session/entity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entityId: id }) });
      // Se falhar (401/403), não chamar loadPerms novamente para evitar loop
      if (r.ok) {
        await loadPerms();
      }
    } catch {}
  };
  return (
    <div className="flex">
      <Sidebar perms={perms} />
      <main className="flex-1 min-h-screen">
        {/* Top bar com seletor de entidade */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 flex items-center gap-3">
          <div className="text-sm text-gray-700">Entidade:</div>
          <select
            className="text-sm border rounded px-2 py-1"
            value={activeEntityId ?? ''}
            onChange={(e) => onChangeEntity(Number(e.target.value))}
          >
            {perms?.entities?.map((en) => (
              <option key={en.id} value={en.id}>{en.name}</option>
            ))}
          </select>
          {/* ID do usuário logado ao lado do seletor de entidade */}
          <div className="text-xs text-gray-600">Usuário ID: {(session?.user as any)?.id ?? '-'}</div>
          <div className="ml-auto text-xs text-gray-500">{loading ? 'Carregando permissões…' : 'Permissões atualizadas'}</div>
        </div>
        <div className="p-6">
          <ProgramGuard perms={perms}>
            {children}
          </ProgramGuard>
        </div>
      </main>
    </div>
  );
}