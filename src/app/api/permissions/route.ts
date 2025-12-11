import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const uid = session?.user ? Number((session.user as any).id) : undefined;
    const activeEntityId = (session as any)?.activeEntityId ?? null;
    if (!uid) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

    // Entidades do usuário (usar Prisma para evitar incompatibilidades de SQL)
    const entities = await prisma.entity.findMany({
      where: { isActive: true, userEntities: { some: { userId: uid } } },
      select: { id: true, cnpj: true, name: true },
      orderBy: { name: 'asc' },
    });

    // Módulos e programas permitidos na entidade ativa
    let modules: any[] = [];
    if (activeEntityId) {
      // Carregar módulos vinculados à entidade
      const mods: any[] = await prisma.$queryRawUnsafe(`
        SELECT m."id", m."code", m."name"
        FROM "Module" m
        JOIN "EntityModule" em ON em."moduleId"=m."id"
        WHERE em."entityId"=${activeEntityId} AND m."isActive"=true
        ORDER BY m."name"
      `);
      // Checar permissão do usuário por módulo
      for (const m of mods) {
        const um: any[] = await prisma.$queryRawUnsafe(`
          SELECT uem."allowed" FROM "UserEntityModule" uem
          JOIN "UserEntity" ue ON ue."id"=uem."userEntityId"
          WHERE ue."userId"=${uid} AND ue."entityId"=${activeEntityId} AND uem."moduleId"=${m.id}
        `);
        const moduleAllowed = um.length === 0 ? true : um.some((r: any) => Number(r.allowed) === 1);
        if (!moduleAllowed) continue;
        // Programas liberados por entidade/módulo
        const progs: any[] = await prisma.$queryRawUnsafe(`
          SELECT p."id", p."code", p."name",
            COALESCE((
              SELECT emp."allowed"
              FROM "EntityModuleProgram" emp
              JOIN "EntityModule" em ON em."id"=emp."entityModuleId"
              WHERE em."entityId"=${activeEntityId} AND em."moduleId"=${m.id} AND emp."programId"=p."id"
              LIMIT 1
            ), true) AS allowed
          FROM "Program" p
          WHERE p."moduleId"=${m.id} AND p."isActive"=true AND p."showInMenu"=true
          ORDER BY p."name"
        `);
        const allowedPrograms = [] as any[];
        for (const p of progs) {
          if (Number(p.allowed) !== 1) continue;
          const up: any[] = await prisma.$queryRawUnsafe(`
            SELECT uemp."allowed" FROM "UserEntityModuleProgram" uemp
            JOIN "UserEntityModule" uem ON uem."id"=uemp."userEntityModuleId"
            JOIN "UserEntity" ue ON ue."id"=uem."userEntityId"
            WHERE ue."userId"=${uid} AND ue."entityId"=${activeEntityId} AND uem."moduleId"=${m.id} AND uemp."programId"=${p.id}
          `);
          const programAllowed = up.length === 0 ? true : up.some((r: any) => Number(r.allowed) === 1);
          if (programAllowed) allowedPrograms.push({ id: p.id, code: p.code, name: p.name });
        }
        if (allowedPrograms.length > 0) {
          modules.push({ id: m.id, code: m.code, name: m.name, programs: allowedPrograms });
        }
      }
    }

    return NextResponse.json({ activeEntityId, entities, modules });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
