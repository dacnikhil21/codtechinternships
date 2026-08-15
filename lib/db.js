import mysql from 'mysql2/promise';

// Create a connection pool - reused across all requests, never crashes on Hostinger
// Helper to parse the DATABASE_URL if it's provided, otherwise use individual parts
const dbUrl = process.env.DATABASE_URL || '';
const useUri = dbUrl.startsWith('mysql://');

const pool = useUri ? mysql.createPool({
  uri: dbUrl,
  waitForConnections: true,
  connectionLimit: 3,
  connectTimeout: 10000,
}) : mysql.createPool({
  host: '127.0.0.1',
  user: 'u371402898_ctadmin',
  password: 'Codtech2002',
  database: 'u371402898_ctintern',
  waitForConnections: true,
  connectionLimit: 3,
  connectTimeout: 10000,
});

// Auto-heal database schema: Ensure password column is VARCHAR(255) so bcrypt hashes (60 chars) are never truncated
let schemaMigrated = false;
export async function ensureDbSchema() {
  if (schemaMigrated) return;
  try {
    await pool.execute('ALTER TABLE user MODIFY COLUMN password VARCHAR(255) NOT NULL');
    schemaMigrated = true;
  } catch (err) {
    // Ignore error if table or permissions differ, but log for diagnostics
    console.warn('[DB SCHEMA CHECK]', err.message);
  }
}

export default pool;
