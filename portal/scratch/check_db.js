import mysql from 'mysql2/promise';

async function checkDb() {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'u371402898_ctadmin',
    password: 'Codtech2002',
    database: 'u371402898_ctintern',
  });

  try {
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('Tables in database:');
    console.log(JSON.stringify(tables, null, 2));

    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [rows] = await pool.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`Table ${tableName}: ${rows[0].count} rows`);
    }
  } catch (err) {
    console.error('Error checking DB:', err.message);
  } finally {
    await pool.end();
  }
}

checkDb();
