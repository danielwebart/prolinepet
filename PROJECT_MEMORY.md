# Memória do Projeto (Trae Context)

Este arquivo contém o contexto técnico e histórico de decisões do projeto, extraído das memórias do assistente para garantir portabilidade entre usuários e ambientes.

## 1. Visão Geral da Arquitetura
*   **Stack:** Next.js 14+ (App Router), Prisma (PostgreSQL), NextAuth.js, Tailwind CSS.
*   **Padrão de Renderização:** Server Components por padrão. `use client` apenas em componentes de folha (interativos).
*   **Banco de Dados:** PostgreSQL (via Prisma ORM).

## 2. Status Atual (Março 2026)
*   **Deploy:** Configurado para modo `standalone`.
*   **Build:** Corrigido erro de "Prerender/useContext" forçando renderização dinâmica no layout.
*   **Próximo Passo:** Copiar arquivos para servidor de produção (Porta 21000). Ver `DEPLOY.md`.

## 3. Soluções Técnicas Críticas

### A. Erro de Build (useContext / Prerender)
*   **Problema:** O build falhava ao tentar pré-renderizar páginas que usam `useSession` (NextAuth) no layout raiz.
*   **Solução:** Adicionado `export const dynamic = 'force-dynamic';` em `src/app/layout.tsx`. Isso desativa a geração estática para o layout raiz, o que é aceitável para um painel administrativo autenticado.

### B. Conflito de Portas (Windows)
*   **Problema:** Porta 3000 presa por processos órfãos (PID).
*   **Solução:** Usar `netstat -ano | findstr :3000` para achar o PID e `taskkill /PID <PID> /F` (como Admin) para matar. O Next.js faz fallback automático para 3001/3002, mas a aplicação deve preferencialmente rodar na 3000 ou na porta definida no `.env`.

### C. Tabela Editável de Pedidos (`sales/orders/new`)
*   **Arquivo:** `src/app/sales/orders/new/page.tsx`
*   **Padrão:**
    *   Não usa botões "Editar/Salvar". Os campos são sempre editáveis.
    *   **Auto-save:** Função `updateItem` atualiza o estado local imediatamente.
    *   **Componentes:** `EditableIntegerInput` e `EditableDecimalInput` lidam com formatação pt-BR e cursor.
    *   **Cálculos:** `useMemo` recalcula pesos e subtotais em tempo real baseando-se no estado.

### D. Hidratação (Hydration Mismatch)
*   **Problema:** Erros de "Text content does not match server-rendered HTML" ao usar `new Date()` ou dados do `localStorage`.
*   **Solução:** Renderizar esses dados apenas após a montagem do componente, usando `useEffect` e um estado `isMounted` ou `date`.

## 4. Mapa de Arquivos Importantes
*   `DEPLOY.md`: Guia passo a passo para colocar em produção.
*   `src/app/layout.tsx`: Layout raiz com correção de build (`force-dynamic`).
*   `src/app/sales/orders/new/page.tsx`: Lógica complexa de pedidos.
*   `src/components/AppShell.tsx`: Gerenciamento global de UI e Sessão.
*   `next.config.js`: Configuração `output: 'standalone'`.

---
*Gerado automaticamente pelo Trae para persistência de contexto.*
