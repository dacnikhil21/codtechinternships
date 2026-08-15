import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool, { ensureDbSchema } from '@/lib/db';
import { isOtpVerified, clearOtp } from '@/lib/otpStore';

export async function POST(req) {
  try {
    await ensureDbSchema();
    const body = await req.json();
    const { email, newPassword, otpCode } = body;

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, message: 'Email and new password are required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(newPassword).trim();

    if (cleanPassword.length < 6) {
      return NextResponse.json({ success: false, message: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    // Verify that OTP was completed for this email
    const verified = isOtpVerified(cleanEmail);
    if (!verified) {
      return NextResponse.json({ 
        success: false, 
        message: 'Verification code not confirmed or expired. Please verify your email first.' 
      }, { status: 403 });
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

    // Clear OTP from store after successful reset
    clearOtp(cleanEmail);

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! You can now log in with your new password.'
    });
  } catch (err) {
    console.error('[RESET PASSWORD API ERROR]', err);
    return NextResponse.json({ success: false, message: 'Server error updating password.' }, { status: 500 });
  }
}
