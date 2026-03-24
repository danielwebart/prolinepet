import { prisma } from './prisma';

export async function isProgramAllowed(userId: number, entityId: number | null, programCode: string): Promise<boolean> {
  if (!entityId) return false;

  const program = await prisma.program.findUnique({
    where: { code: programCode },
    select: { id: true, moduleId: true },
  });
  if (!program) return false;

  const userEntity = await prisma.userEntity.findUnique({
    where: { userId_entityId: { userId, entityId } },
    select: { id: true },
  });
  if (!userEntity) return false;

  const userEntityModule = await prisma.userEntityModule.findUnique({
    where: { userEntityId_moduleId: { userEntityId: userEntity.id, moduleId: program.moduleId } },
    select: { id: true, allowed: true },
  });

  const moduleAllowed = userEntityModule ? Boolean(userEntityModule.allowed) : true;
  if (!moduleAllowed) return false;

  if (!userEntityModule) return true;

  const userProgram = await prisma.userEntityModuleProgram.findUnique({
    where: { userEntityModuleId_programId: { userEntityModuleId: userEntityModule.id, programId: program.id } },
    select: { allowed: true },
  });

  return userProgram ? Boolean(userProgram.allowed) : true;
}

