import { NextResponse } from 'next/server';
import { verifyOtpCode } from '@/lib/otpStore';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json({ success: false, message: 'Email and verification code are required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const result = verifyOtpCode(cleanEmail, code);

    if (!result.valid) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code confirmed. You may now reset your password.'
    });
  } catch (err) {
    console.error('[VERIFY OTP API ERROR]', err);
    return NextResponse.json({ success: false, message: 'Server error verifying code.' }, { status: 500 });
  }
}
