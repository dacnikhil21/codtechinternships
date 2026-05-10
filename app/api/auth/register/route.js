import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, password, course } = await req.json();

    if (!name || !email || !password || !course) {
        return NextResponse.json({ success: false, message: 'Please provide all fields' }, { status: 400 });
    }

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in MongoDB Atlas
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      course,
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
