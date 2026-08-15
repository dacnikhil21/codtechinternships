import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { isAdmin } from '@/lib/adminCheck';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    
    let sql = 'SELECT id, name, email, course, role, createdAt FROM user WHERE role = "student"';
    let params = [];

    if (query) {
      sql += ' AND (name LIKE ? OR email LIKE ? OR course LIKE ?)';
      const searchTerm = `%${query}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }

    sql += ' ORDER BY createdAt DESC LIMIT 100';

    const [users] = await pool.execute(sql, params);

    return NextResponse.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('ADMIN USERS ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await pool.execute('DELETE FROM user WHERE id = ? AND role = "student"', [id]);

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
