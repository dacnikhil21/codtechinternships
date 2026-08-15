import { NextResponse } from 'next/server';
import { verifyResetToken } from '@/lib/tokenStore';

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, email } = body;

    if (!token) {
      return NextResponse.json({ success: false, message: 'Reset token is required.' }, { status: 400 });
    }

    const result = verifyResetToken(token, email);

    if (!result.valid) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      email: result.email,
      message: 'Reset link verified successfully.'
    });
  } catch (err) {
    console.error('[VERIFY TOKEN API ERROR]', err);
    return NextResponse.json({ success: false, message: 'Server error validating reset token.' }, { status: 500 });
  }
}
