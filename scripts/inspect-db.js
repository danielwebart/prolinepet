const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Inspecting MariaDB tables in current schema...');
    const tables = await prisma.$queryRawUnsafe(`
      SELECT table_name AS tableName
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
      ORDER BY table_name;
    `);
    const names = tables.map((t) => t.tableName);
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
        const rows = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS c FROM \`${t}\`;`);
        results.push({ table: t, count: Number(rows[0]?.c ?? 0), present: true });
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
