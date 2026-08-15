import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession, encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session || !session.impersonatedBy) {
      return NextResponse.json({ success: false, message: 'Not currently impersonating' }, { status: 400 });
    }

    const adminId = session.impersonatedBy;

    // Fetch the original admin
    const [rows] = await pool.execute(
      'SELECT id, name, email, course, role FROM user WHERE id = ? LIMIT 1',
      [adminId]
    );

    const admin = rows[0];

    if (!admin || (admin.role !== 'admin' && admin.role !== 'superadmin')) {
      // Admin not found or no longer has privileges
      cookies().set('session', '', { expires: new Date(0) });
      return NextResponse.json({ success: false, message: 'Admin validation failed' }, { status: 403 });
    }

    // Restore original admin session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newSessionPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      course: admin.course,
      name: admin.name,
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

    return NextResponse.json({ success: true, message: 'Impersonation ended' });

  } catch (error) {
    console.error('[IMPERSONATE EXIT ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
