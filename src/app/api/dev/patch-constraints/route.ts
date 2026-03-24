import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH() {
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT kcu.CONSTRAINT_NAME as constraintName
      FROM information_schema.KEY_COLUMN_USAGE kcu
      WHERE kcu.TABLE_SCHEMA = DATABASE()
        AND kcu.TABLE_NAME = 'UserEntityModuleProgram'
        AND kcu.COLUMN_NAME = 'userEntityModuleId'
        AND kcu.REFERENCED_TABLE_NAME = 'UserEntityModule'
      LIMIT 1
    `);
    const currentName = rows?.[0]?.constraintName ? String(rows[0].constraintName) : null;

    if (currentName) {
      try {
        await prisma.$executeRawUnsafe(
          `ALTER TABLE \`UserEntityModuleProgram\` DROP FOREIGN KEY \`${currentName}\``
        );
      } catch {}
    }

    const targetName = 'fk_uemp_userEntityModuleId';
    let created = false;
    try {
      await prisma.$executeRawUnsafe(`
        ALTER TABLE \`UserEntityModuleProgram\`
        ADD CONSTRAINT \`${targetName}\`
        FOREIGN KEY (\`userEntityModuleId\`) REFERENCES \`UserEntityModule\`(\`id\`)
        ON DELETE CASCADE ON UPDATE CASCADE
      `);
      created = true;
    } catch {}

    return NextResponse.json({ ok: true, adjusted: true, dropped: currentName, created });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
