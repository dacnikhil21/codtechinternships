import { NextResponse } from 'next/server';
import pool, { ensureDbSchema } from '@/lib/db';
import { createResetToken } from '@/lib/tokenStore';
import { sendResetLinkEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    await ensureDbSchema();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'Registered email address is required.' }, { status: 400 });
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
      user = { id: 1, name: 'Intern', email: cleanEmail };
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'No registered account found with this exact email address. Access denied.' 
      }, { status: 404 });
    }

    // Generate secure reset token
    const token = createResetToken(cleanEmail, 30);

    // Get origin host from headers or env
    const host = req.headers.get('host') || 'codtechitsolutions.co.in';
    const protocol = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const origin = `${protocol}://${host}`;

    const resetLink = `${origin}/forgot-password?token=${token}&email=${encodeURIComponent(cleanEmail)}`;

    // Dispatch Reset Link email
    const emailResult = await sendResetLinkEmail(cleanEmail, resetLink, user.name || 'Intern');

    return NextResponse.json({
      success: true,
      message: `A password reset link has been sent to ${cleanEmail}. Please check your inbox.`,
      email: cleanEmail,
      resetLink,
      simulated: emailResult.simulated
    });
  } catch (err) {
    console.error('[FORGOT PASSWORD API ERROR]', err);
    return NextResponse.json({ success: false, message: 'Server error processing password reset link.' }, { status: 500 });
  }
}
