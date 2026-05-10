import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Not logged in' }, { status: 401 });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email, course, role, xp, createdAt FROM User WHERE id = ? LIMIT 1',
      [session.id]
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });

  } catch (error) {
    console.error('ME ERROR:', error.message);
    return NextResponse.json({ success: false, message: `Session error: ${error.message}` }, { status: 500 });
  }
}
