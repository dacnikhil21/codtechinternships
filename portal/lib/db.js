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

export default pool;
