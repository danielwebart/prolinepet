# Guia de Deploy - Portal Web

Este guia descreve os passos para compilar e migrar o projeto para um servidor de produção (VPS/Externo).

## 1. Compilação (Build)

No ambiente de desenvolvimento (sua máquina local), execute:

```bash
npm run build
```

Se o build for bem-sucedido, será criada uma pasta `.next/standalone`.

## 2. Arquivos para Migração

Você precisa copiar **apenas** os seguintes arquivos/pastas para o diretório do servidor (ex: `D:\Sites\portalweb` ou `/var/www/portalweb` no servidor):

1.  **Pasta `.next/standalone`**
    *   Copie todo o conteúdo de dentro de `.next/standalone` para a **raiz** da pasta no servidor.
    *   *Nota: Esta pasta já contém o `package.json` e o `server.js` necessários.*

2.  **Pasta `.next/static`**
    *   Copie a pasta `.next/static` (da sua máquina local) para dentro de `.next/static` no servidor.
    *   *Caminho final no servidor:* `[Raiz do Projeto]/.next/static`

3.  **Pasta `public`**
    *   Copie a pasta `public` (da sua máquina local) para a **raiz** da pasta no servidor.

### Estrutura Final no Servidor

A pasta do projeto no servidor deve ficar assim:

```text
/portalweb
  ├── .next
  │    └── static       <-- Copiado de .next/static local
  ├── public            <-- Copiado de public local
  ├── package.json      <-- Veio de .next/standalone
  ├── server.js         <-- Veio de .next/standalone
  └── .env              <-- Criado/Editado manualmente no servidor
```

## 3. Configuração do Servidor

No servidor, crie ou edite o arquivo `.env` na raiz do projeto com as credenciais de produção:

```env
# Porta definida para 21000 conforme solicitado
PORT=21000

# Conexão com o Banco de Dados (PostgreSQL)
# Substitua usuario, senha, host e nome_do_banco pelos dados reais
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

# Outras variáveis de ambiente necessárias (ex: NextAuth)
NEXTAUTH_URL="http://seu-dominio-ou-ip:21000"
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
```

## 4. Execução

Para rodar o servidor:

**Opção A: Manualmente (para teste)**
```bash
node server.js
```

**Opção B: Usando PM2 (Recomendado para Produção)**
```bash
# Iniciar o processo
pm2 start server.js --name portalweb

# Salvar para reiniciar automaticamente se o servidor reiniciar
pm2 save
```

## Solução de Problemas Comuns

*   **Erro "Prerender Error" ou "useContext" no build:**
    *   Certifique-se de que `src/app/layout.tsx` possui `export const dynamic = 'force-dynamic';`.
    
*   **Imagens ou Estilos não carregam:**
    *   Verifique se a pasta `.next/static` foi copiada corretamente para o local certo.

*   **Erro de Porta em Uso (EADDRINUSE):**
    *   Verifique se já existe um processo rodando na porta 21000 e encerre-o antes de iniciar o novo.
