import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = Number((session.user as any).id);

    // Get clients linked to user
    const clientReps = await prisma.userClientRep.findMany({
        where: { userId },
        select: { clientId: true }
    });
    
    const clientIds = clientReps.map(r => r.clientId);

    let count = 0;
    if (clientIds.length > 0) {
        count = await prisma.clientCartItem.count({
            where: { clientId: { in: clientIds } }
        });
    }

    return NextResponse.json({ count });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
