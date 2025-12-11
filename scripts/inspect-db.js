const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Inspecting Postgres tables in schema "public"...');
    const tables = await prisma.$queryRawUnsafe(
      `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public' ORDER BY tablename;`
    );
    const names = tables.map((t) => t.tablename);
    console.log('Tables found:', names.length);
    console.log(names);

    const expected = [
      'User', 'Entity', 'Module', 'Program', 'EntityModule', 'EntityModuleProgram',
      'UserEntity', 'UserEntityModule', 'UserEntityModuleProgram',
      'Asset', 'WorkOrder', 'Attachment', 'AssetAttachment',
      'InventoryItem', 'SalesOrder', 'SalesOrderItem',
      'Client', 'UserClientRep'
    ];

    const results = [];
    for (const t of expected) {
      try {
        const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS c FROM "${t}";`);
        results.push({ table: t, count: rows[0]?.c ?? 0, present: true });
      } catch (e) {
        results.push({ table: t, count: null, present: false });
      }
    }

    console.log('Counts (null = table missing):');
    for (const r of results) {
      console.log(`${r.table}:`, r.present ? r.count : 'missing');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });