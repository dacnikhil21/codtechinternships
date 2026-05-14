import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email || email !== 'dacnikhil21@gmail.com') {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE user SET role = "admin" WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (result.affectedRows > 0) {
      return NextResponse.json({ success: true, message: `User ${email} is now an ADMIN.` });
    } else {
      return NextResponse.json({ success: false, message: `User ${email} not found. Register first.` });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
