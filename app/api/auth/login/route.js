import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Test DB connection first
    try {
      await prisma.$connect();
    } catch (dbErr) {
      console.error('DATABASE CONNECTION FAILED:', dbErr.message);
      return NextResponse.json({ success: false, message: 'Database connection failed. Please try again in a moment.' }, { status: 503 });
    }

    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'No account found with this email' }, { status: 401 });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Incorrect password' }, { status: 401 });
    }

    // 3. Create session
    await login(user);

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful',
      data: { name: user.name, email: user.email, course: user.course, role: user.role } 
    });

  } catch (error) {
    console.error('LOGIN ERROR FULL DETAILS:', error.message, error.stack);
    return NextResponse.json({ 
      success: false, 
      message: `Server error: ${error.message}` 
    }, { status: 500 });
  }
}
