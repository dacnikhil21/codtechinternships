import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password, course } = await req.json();

    if (!name || !email || !password || !course) {
        return NextResponse.json({ success: false, message: 'Please provide all fields' }, { status: 400 });
    }

    // 1. Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in SQLite via Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        course,
      }
    });

    // 4. Create session
    await login(user);

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      data: { name: user.name, email: user.email, course: user.course } 
    }, { status: 201 });

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
