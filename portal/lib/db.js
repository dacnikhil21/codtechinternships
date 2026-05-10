import mysql from 'mysql2/promise';

// Create a connection pool - reused across all requests, never crashes on Hostinger
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 3, // Lower limit for Hostinger stability
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // 10s timeout
});

export default pool;
