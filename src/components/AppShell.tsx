"use client";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import ProgramGuard from "./ProgramGuard";

type Entity = { id: number; name: string; cnpj?: string };
type Program = { code: string; name: string };
type ModulePerm = { code: string; name: string; programs: Program[] };
type Permissions = { activeEntityId: number | null; entities: Entity[]; modules: ModulePerm[] };

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isLogin = pathname === "/login";

  const [perms, setPerms] = useState<Permissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoSelected, setAutoSelected] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeEntityId = (perms?.activeEntityId ?? null);

  useEffect(() => {
    if (status === "unauthenticated" && !isLogin) {
       window.location.href = "/login";
    }
  }, [status, isLogin]);

  const loadPerms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/permissions', { cache: 'no-store' });
      if (!r.ok) throw new Error(`Status: ${r.status}`);
      const j = await r.json();
      setPerms(j);
    } catch (err: any) {
      console.error("Failed to load permissions:", err);
      setError(err.message || "Erro de conexão");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Recarregar permissões quando a sessão estiver confirmada
  useEffect(() => { 
    if (status === 'authenticated' && !isLogin) {
      loadPerms();
    }
  }, [status, isLogin, loadPerms]);

  const onChangeEntity = useCallback(async (id: number) => {
    try {
      const r = await fetch('/api/session/entity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entityId: id }) });
      if (r.ok) {
        await loadPerms();
      }
    } catch {}
  }, [loadPerms]);

  useEffect(() => {
    if (status !== 'authenticated' || isLogin || autoSelected) return;
    if (!perms?.activeEntityId && Array.isArray(perms?.entities) && perms.entities.length > 0) {
      setAutoSelected(true);
      onChangeEntity(Number(perms.entities[0].id));
    }
  }, [status, isLogin, perms, autoSelected, onChangeEntity]);

  useEffect(() => {
    const fetchCount = async () => {
        try {
            const res = await fetch('/api/sales/representative/cart-count', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setCartCount(data.count || 0);
            }
        } catch {}
    };
    if (status === 'authenticated' && !isLogin) {
        fetchCount();
        // Update count periodically (30s)
        const interval = setInterval(fetchCount, 30000); 
        return () => clearInterval(interval);
    }
  }, [status, isLogin]);

  if (isLogin) {
    return <main className="min-h-screen">{children}</main>;
  }
  return (
    <div className="flex">
      <Sidebar perms={perms} mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} pathname={pathname} />
      <main className="flex-1 min-h-screen">
        {/* Top bar com seletor de entidade */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3 flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-1 mr-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div className="text-sm text-gray-700 hidden sm:block">Entidade:</div>
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
          <div className="text-xs text-gray-600">Usuário: {session?.user?.name ?? (session?.user as any)?.id ?? '-'}</div>
          
          <div className="ml-auto flex items-center gap-4">
            {loading && <div className="text-xs text-gray-500">Carregando permissões…</div>}
            {error && <div className="text-xs text-red-600">{error}</div>}
            
            <Link href="/" className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Dashboard
            </Link>

            <Link href="/sales/carts" className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" title="Vendas - Carrinhos Cliente">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-white">
                        {cartCount}
                    </span>
                )}
            </Link>

            <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-all shadow-sm ml-2"
                title="Sair do sistema"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <ProgramGuard perms={perms} pathname={pathname}>
            {children}
          </ProgramGuard>
        </div>
      </main>
    </div>
  );
}
