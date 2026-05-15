const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  user: 'u371402898_ctadmin',
  password: 'Codtech2002',
  database: 'u371402898_ctintern',
};

async function migrate() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    console.log('Starting Database Migration...');

    const alterQueries = [
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration VARCHAR(255)",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_requirement BOOLEAN DEFAULT FALSE",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS learning_outcome TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_scope TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS instructions TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ];

    for (const query of alterQueries) {
      try {
        await connection.execute(query);
        console.log(`Executed: ${query}`);
      } catch (err) {
        console.warn(`Query failed (might already exist): ${query}`, err.message);
      }
    }

    console.log('Migration finished!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await connection.end();
  }
}

migrate();
