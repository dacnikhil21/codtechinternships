import { getSession } from './auth';
import pool from './db';

/**
 * Verifies if the current session belongs to an administrator.
 * Performs both a session check and a fresh database verification for security.
 */
export async function isAdmin() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return false;
  }

  try {
    // Fresh DB check to prevent role escalation via stale cookies
    const [rows] = await pool.execute(
      'SELECT role FROM user WHERE id = ? LIMIT 1',
      [session.id]
    );

    if (rows.length === 0 || rows[0].role !== 'admin') {
      return false;
    }

    return true;
  } catch (err) {
    console.error('[AdminCheck Error]', err.message);
    return false;
  }
}
