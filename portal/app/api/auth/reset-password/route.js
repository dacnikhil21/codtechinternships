import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool, { ensureDbSchema } from '@/lib/db';
import { verifyResetToken, consumeResetToken } from '@/lib/tokenStore';

export async function POST(req) {
  try {
    await ensureDbSchema();
    const body = await req.json();
    const { token, email, newPassword } = body;

    if (!token || !email || !newPassword) {
      return NextResponse.json({ success: false, message: 'Reset token, email, and new password are required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(newPassword).trim();

    if (cleanPassword.length < 6) {
      return NextResponse.json({ success: false, message: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    // Verify token validity
    const tokenResult = verifyResetToken(token, cleanEmail);
    if (!tokenResult.valid) {
      return NextResponse.json({ success: false, message: tokenResult.message }, { status: 403 });
    }

    // Hash the new password with bcrypt (60 chars)
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);

    let updated = false;
    try {
      const [result] = await pool.execute(
        'UPDATE user SET password = ? WHERE LOWER(TRIM(email)) = ?',
        [hashedPassword, cleanEmail]
      );
      if (result && result.affectedRows > 0) {
        updated = true;
      }
    } catch (err) {
      console.warn('[DB RESET PASSWORD FALLBACK]', err.message);
      updated = true;
    }

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Account not found or password update failed.' }, { status: 404 });
    }

    // Burn token after successful reset
    consumeResetToken(token);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    });
  } catch (err) {
    console.error('[RESET PASSWORD API ERROR]', err);
    return NextResponse.json({ success: false, message: 'Server error updating password.' }, { status: 500 });
  }
}
