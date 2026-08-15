import { NextResponse } from 'next/server';
import pool, { ensureDbSchema } from '@/lib/db';
import { setOtp } from '@/lib/otpStore';
import { sendVerificationEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    await ensureDbSchema();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email address is required.' }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ success: false, message: 'Invalid email address format.' }, { status: 400 });
    }

    // Strictly check for exact email match in database
    let user = null;
    try {
      const [rows] = await pool.execute(
        'SELECT id, name, email FROM user WHERE LOWER(TRIM(email)) = ? LIMIT 1',
        [cleanEmail]
      );
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (err) {
      console.warn('[DB VERIFY EMAIL FALLBACK]', err.message);
      // Fallback for dev mode
      user = { id: 1, name: 'Intern', email: cleanEmail };
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'No registered account found with this exact email address. Access denied.' 
      }, { status: 404 });
    }

    // Generate secure 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(cleanEmail, otpCode, 15);

    // Send Verification Email
    const emailResult = await sendVerificationEmail(cleanEmail, otpCode, user.name || 'Intern');

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${cleanEmail}. Please check your inbox.`,
      email: cleanEmail,
      name: user.name || 'Intern',
      simulated: emailResult.simulated,
      // Pass code in response for testing/dev ease if email server is not configured
      code: emailResult.simulated ? otpCode : undefined
    });
  } catch (err) {
    console.error('[FORGOT PASSWORD API ERROR]', err);
    return NextResponse.json({ success: false, message: 'Server error verifying email address.' }, { status: 500 });
  }
}
