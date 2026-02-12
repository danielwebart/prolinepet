import NextAuth from 'next-auth';
// Rebuild trigger: Fix webpack runtime error
import { authOptions } from '../../../../lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };