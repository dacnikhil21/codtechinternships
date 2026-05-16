import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { isAdmin } from '@/lib/adminCheck';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const [domains] = await pool.execute('SELECT id, name FROM domains ORDER BY name ASC');

    return NextResponse.json({ success: true, domains });

  } catch (error) {
    console.error('FETCH DOMAINS ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
