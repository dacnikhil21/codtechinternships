import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { isAdmin } from '@/lib/adminCheck';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const session = await getSession();
    const [rows] = await pool.execute(
      'SELECT name, email FROM user WHERE id = ? LIMIT 1',
      [session.id]
    );

    return NextResponse.json({ success: true, user: rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const session = await getSession();
    const { name, email, password } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ success: false, message: 'Name and Email are required' }, { status: 400 });
    }

    // Check if new email is taken
    const [existing] = await pool.execute(
      'SELECT id FROM user WHERE email = ? AND id != ? LIMIT 1',
      [email.toLowerCase().trim(), session.id]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'Email already in use by another account' }, { status: 400 });
    }

    let sql = 'UPDATE user SET name = ?, email = ?';
    let params = [name, email.toLowerCase().trim()];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += ', password = ?';
      params.push(hashedPassword);
    }

    sql += ' WHERE id = ?';
    params.push(session.id);

    await pool.execute(sql, params);

    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully. Please re-login if you changed your email.' 
    });

  } catch (error) {
    console.error('PROFILE UPDATE ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
