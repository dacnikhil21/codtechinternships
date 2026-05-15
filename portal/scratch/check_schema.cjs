const mysql = require('mysql2/promise');
const dbConfig = {
  host: '127.0.0.1',
  user: 'u371402898_ctadmin',
  password: 'Codtech2002',
  database: 'u371402898_ctintern',
};

async function checkSchema() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [columns] = await connection.execute('DESCRIBE projects');
    console.log('--- projects table columns ---');
    console.table(columns);
    
    const [domains] = await connection.execute('SELECT * FROM domains');
    console.log('\n--- domains table samples ---');
    console.table(domains.slice(0, 10));
    
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

checkSchema();
