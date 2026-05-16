import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      console.warn('[AUTH ME] No valid session found');
      return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
    }

    console.log('[AUTH ME] Session found for ID:', session.id);

    const [rows] = await pool.execute(
      'SELECT id, name, email, course, role, xp, createdAt FROM user WHERE id = ? LIMIT 1',
      [session.id]
    );

    const user = rows[0];

    if (!user) {
      console.warn('[AUTH ME] User in session not found in DB:', session.id);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error) {
    console.error('[AUTH ME] UNEXPECTED ERROR:', error);
    return NextResponse.json({ success: false, message: `Session error: ${error.message}` }, { status: 500 });
  }
}
