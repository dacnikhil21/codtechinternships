import { NextResponse } from 'next/server';
import pool, { ensureDbSchema } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    await ensureDbSchema();
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

    // Verify password (trimmed to handle accidental spaces)
    const cleanPassword = password ? password.trim() : '';
    const isMatch = await bcrypt.compare(cleanPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Incorrect password. If you forgot your password, please click "Forgot Password?" to reset it.' }, { status: 401 });
    }

    // Create session
    const session = await login(user);

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: { name: user.name, email: user.email, course: user.course, role: user.role }
    });

    // Explicitly set cookie on the response object as a secondary measure
    response.cookies.set('session', session, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      message: `Database Connection Error: ${error.message}. Please check your DATABASE_URL in Hostinger.` 
    }, { status: 500 });
  }
}
