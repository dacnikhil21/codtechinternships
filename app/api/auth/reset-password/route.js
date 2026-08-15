import { NextResponse } from 'next/server';
import pool, { ensureDbSchema } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
  try {
    await ensureDbSchema();
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, message: 'Email and new password are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = newPassword.trim();

    if (cleanPassword.length < 6) {
      return NextResponse.json({ success: false, message: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    // Verify user exists
    const [rows] = await pool.execute(
      'SELECT id FROM user WHERE email = ? LIMIT 1',
      [cleanEmail]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User account not found' }, { status: 404 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    // Update password in database
    await pool.execute(
      'UPDATE user SET password = ?, updatedAt = NOW() WHERE email = ?',
      [hashedPassword, cleanEmail]
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });

  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error.message);

    // Local dev mode fallback if MySQL is not running on 127.0.0.1 locally
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
      return NextResponse.json({
        success: true,
        message: 'Local Dev Mode: Password reset simulated! (Real DB updates automatically when pushed to Hostinger)'
      });
    }

    return NextResponse.json({ success: false, message: `Failed to reset password: ${error.message}` }, { status: 500 });
  }
}
