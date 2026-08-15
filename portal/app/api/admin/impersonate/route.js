import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession, encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session || (session.role !== 'admin' && session.role !== 'superadmin')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json({ success: false, message: 'Student ID is required' }, { status: 400 });
    }

    // Ensure impersonation log table exists (safe way without migrations)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS impersonation_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        adminId VARCHAR(255) NOT NULL,
        studentId VARCHAR(255) NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fetch the target student
    const [rows] = await pool.execute(
      'SELECT id, name, email, course, role FROM user WHERE id = ? LIMIT 1',
      [studentId]
    );

    const student = rows[0];

    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }
    
    // Check if the target is an admin to prevent impersonating other admins
    if (student.role === 'admin' || student.role === 'superadmin') {
      return NextResponse.json({ success: false, message: 'Cannot impersonate an admin' }, { status: 403 });
    }

    // Log the impersonation action
    await pool.execute(
      'INSERT INTO impersonation_logs (adminId, studentId) VALUES (?, ?)',
      [session.id, studentId]
    );

    // Create a new session for the student, injecting the impersonation flag
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours for impersonation session
    const newSessionPayload = {
      id: student.id,
      email: student.email,
      role: student.role,
      course: student.course,
      name: student.name,
      impersonatedBy: session.id,
      adminName: session.name || 'Admin',
      expires
    };

    const newSessionToken = await encrypt(newSessionPayload);

    cookies().set('session', newSessionToken, {
      expires,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.json({ success: true, message: 'Impersonation started' });

  } catch (error) {
    console.error('[IMPERSONATE ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
