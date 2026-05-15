import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password, course, intern_id } = await req.json();

    if (!name || !email || !password || !course || !intern_id) {
      return NextResponse.json({ success: false, message: 'Please provide all fields including CODTECH Intern ID' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ success: false, message: 'Invalid email format. Please enter a valid email address.' }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await pool.execute(
      'SELECT id FROM user WHERE email = ? LIMIT 1',
      [cleanEmail]
    );

    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'An account with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [result] = await pool.execute(
      'INSERT INTO user (name, email, password, course, role, xp, intern_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, cleanEmail, hashedPassword, course, 'student', 0, intern_id]
    );

    const user = { id: result.insertId, name, email: cleanEmail, course, role: 'student', xp: 0, intern_id };

    // Create session
    await login(user);

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: { name: user.name, email: user.email, course: user.course }
    }, { status: 201 });

  } catch (error) {
    console.error('REGISTER ERROR:', error.message);
    return NextResponse.json({ success: false, message: `Registration failed: ${error.message}` }, { status: 500 });
  }
}
