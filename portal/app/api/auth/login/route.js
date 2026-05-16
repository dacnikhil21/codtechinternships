import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const [rows] = await pool.execute(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email.toLowerCase().trim()]
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json({ success: false, message: 'No account found with this email' }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
    }

    // Create session
    await login(user);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: { name: user.name, email: user.email, course: user.course, role: user.role }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Database Connection Error: ${error.message}. Please check your DATABASE_URL in Hostinger.` 
    }, { status: 500 });
  }
}
