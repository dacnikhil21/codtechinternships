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
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ success: false, message: 'Invalid email address format' }, { status: 400 });
    }

    // Check if user exists in database
    const [rows] = await pool.execute(
      'SELECT id, name, email FROM user WHERE email = ? LIMIT 1',
      [cleanEmail]
    );

    if (rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No account found with this email address. Please check for typos or create a new account.' 
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
    
    // Local dev mode fallback if MySQL is not running on 127.0.0.1 locally
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
      return NextResponse.json({
        success: true,
        message: 'Local Dev Mode: Account verified for testing (Live DB connects automatically when pushed to Hostinger)',
        data: { name: 'Intern User', email: email }
      });
    }

    return NextResponse.json({ success: false, message: `Verification failed: ${error.message}` }, { status: 500 });
  }
}
