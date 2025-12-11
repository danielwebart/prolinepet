import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

// GET /api/dev/debug/uem-status?userId=1&entityId=1&moduleId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get('userId'));
    const entityId = Number(searchParams.get('entityId'));
    const moduleId = Number(searchParams.get('moduleId'));
    if (!userId || !entityId || !moduleId) return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    const ueRow: any[] = await prisma.$queryRawUnsafe(`SELECT "id" FROM "UserEntity" WHERE "userId"=${userId} AND "entityId"=${entityId} LIMIT 1`);
    const ueId = ueRow[0]?.id;
    const uemRows: any[] = await prisma.$queryRawUnsafe(`SELECT "id", "allowed" FROM "UserEntityModule" WHERE "userEntityId"=${ueId} AND "moduleId"=${moduleId}`);
    const uempRows: any[] = await prisma.$queryRawUnsafe(`SELECT "id", "userEntityModuleId", "programId", "allowed" FROM "UserEntityModuleProgram" WHERE "userEntityModuleId" IN (SELECT "id" FROM "UserEntityModule" WHERE "userEntityId"=${ueId} AND "moduleId"=${moduleId})`);
    return NextResponse.json({ ueId, uemRows, uempRows });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}