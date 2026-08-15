import { NextResponse } from 'next/server';
import pool, { ensureDbSchema } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    await ensureDbSchema();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: 'Please enter your registered email address' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Exact match with LOWER and TRIM
    let rows = [];
    try {
      const [res] = await pool.execute(
        'SELECT id, name, email FROM user WHERE LOWER(TRIM(email)) = ? LIMIT 1',
        [cleanEmail]
      );
      rows = res;
    } catch (err) {
      console.warn('Query on user table failed:', err.message);
    }

    // 2. Fallback: Check 'users' table if 'user' table returned no rows
    if (!rows || rows.length === 0) {
      try {
        const [res] = await pool.execute(
          'SELECT id, name, email FROM users WHERE LOWER(TRIM(email)) = ? LIMIT 1',
          [cleanEmail]
        );
        rows = res;
      } catch (err) {
        // Table 'users' may not exist, ignore
      }
    }

    // 3. Fallback: Fuzzy LIKE search if exact match returned no rows
    if (!rows || rows.length === 0) {
      try {
        const [res] = await pool.execute(
          'SELECT id, name, email FROM user WHERE LOWER(email) LIKE ? LIMIT 1',
          [`%${cleanEmail}%`]
        );
        rows = res;
      } catch (err) {
        // Ignore
      }
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: `No account found for "${cleanEmail}". Please check your email spelling or create a new account.` 
      }, { status: 404 });
    }

    const user = rows[0];

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully',
      data: { name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error.message);
    
    // Local dev mode fallback if MySQL is offline locally
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
      return NextResponse.json({
        success: true,
        message: 'Local Dev Mode: Account verified for testing',
        data: { name: 'Intern User', email: email }
      });
    }

    return NextResponse.json({ success: false, message: `Verification failed: ${error.message}` }, { status: 500 });
  }
}
