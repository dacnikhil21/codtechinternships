const pool = require('../lib/db').default;

async function checkTables() {
  try {
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]));

    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [columns] = await pool.execute(`DESCRIBE ${tableName}`);
      console.log(`\nTable: ${tableName}`);
      console.table(columns.map(c => ({ Field: c.Field, Type: c.Type, Null: c.Null })));
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    process.exit();
  }
}

checkTables();
