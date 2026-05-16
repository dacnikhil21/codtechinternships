import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req) {
  try {
    const { fullName, email, internId, subject, message, captchaAnswer, num1, num2 } = await req.json();

    // Basic Validation
    if (!fullName || !email || !internId || !subject || !message) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
    }

    // Human Verification (Captcha)
    if (parseInt(captchaAnswer) !== (num1 + num2)) {
      return NextResponse.json({ success: false, message: 'Verification failed. Please try again.' }, { status: 400 });
    }

    // Save to Database
    const [result] = await pool.execute(
      'INSERT INTO support_requests (fullName, email, internId, subject, message, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [fullName, email, internId, subject, message, 'Pending']
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Support Request Submitted Successfully',
      requestId: result.insertId 
    }, { status: 201 });

  } catch (error) {
    console.error('SUPPORT SUBMISSION ERROR:', error.message);
    return NextResponse.json({ success: false, message: 'Failed to submit request. Please try again later.' }, { status: 500 });
  }
}
