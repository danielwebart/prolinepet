import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'Credenciais',
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // Tentar autenticar usuário do banco
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // Se for a credencial TI estática e não existir no banco, criar e usar id numérico
        if (!user && credentials.email === 'ti@cartonificiovalinhos.com.br' && credentials.password === 'Carto123') {
          const hash = await bcrypt.hash(credentials.password, 10);
          user = await prisma.user.create({ data: { email: credentials.email, name: 'TI', password: hash } });
        }
        if (!user) return null;
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;
        return { id: String(user.id), name: user.name, email: user.email } as any;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      // Garantir que o id do usuário esteja presente na sessão
      (session.user as any).id = token.uid ?? (session.user as any).id ?? null;
      // Carregar entidade ativa (última usada) do usuário
      try {
        const uid = token.uid ? String(token.uid) : (session.user as any)?.id;
        if (uid) {
          // 1) Priorizar a última entidade selecionada pelo usuário (User.lastEntityId)
          const lastRow: any[] = await prisma.$queryRawUnsafe(
            `SELECT "lastEntityId" FROM "User" WHERE "id"=${Number(uid)} LIMIT 1`
          );
          let activeEntityId: number | null = lastRow[0]?.lastEntityId ?? null;
          // Validar que o usuário possui vínculo com a entidade escolhida
          if (activeEntityId != null) {
            const linkRow: any[] = await prisma.$queryRawUnsafe(
              `SELECT "id" FROM "UserEntity" WHERE "userId"=${Number(uid)} AND "entityId"=${activeEntityId} LIMIT 1`
            );
            if (linkRow.length === 0) {
              // se não houver vínculo, ignorar lastEntityId
              activeEntityId = null;
            }
          }
          // 2) Fallback: usar o vínculo mais recente do usuário
          if (activeEntityId == null) {
            const ueRow: any[] = await prisma.$queryRawUnsafe(
              `SELECT "entityId" FROM "UserEntity" WHERE "userId"=${Number(uid)} ORDER BY "id" DESC LIMIT 1`
            );
            activeEntityId = ueRow[0]?.entityId ?? null;
          }
          // 3) Fallback final: entidade 1 se existir
          if (activeEntityId == null) {
            const eRow: any[] = await prisma.$queryRawUnsafe(`SELECT id FROM "Entity" WHERE id=1 LIMIT 1`);
            if (eRow.length > 0) activeEntityId = 1;
          }
          (session as any).activeEntityId = activeEntityId;
        } else {
          (session as any).activeEntityId = null;
        }
      } catch {
        (session as any).activeEntityId = null;
      }
      return session;
    }
  }
};