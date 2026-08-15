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
    const statusFilter = searchParams.get('status') || '';
    const subjectFilter = searchParams.get('subject') || '';
    
    let sql = 'SELECT * FROM support_requests WHERE 1=1';
    let params = [];

    if (query) {
      sql += ' AND (fullName LIKE ? OR email LIKE ? OR internId LIKE ?)';
      const searchTerm = `%${query}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (statusFilter) {
      sql += ' AND status = ?';
      params.push(statusFilter);
    }

    if (subjectFilter) {
      sql += ' AND subject = ?';
      params.push(subjectFilter);
    }

    sql += ' ORDER BY createdAt DESC';

    let requests = [];
    try {
      [requests] = await pool.execute(sql, params);
    } catch (dbError) {
      // If the table doesn't exist yet (no student has submitted a request),
      // just return an empty array instead of crashing the admin panel with a 500 error.
      if (dbError.errno === 1146 || dbError.code === 'ER_NO_SUCH_TABLE') {
        requests = [];
      } else {
        throw dbError; // rethrow if it's a real database error
      }
    }

    return NextResponse.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('ADMIN SUPPORT GET ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'ID and status required' }, { status: 400 });
    }

    await pool.execute(
      'UPDATE support_requests SET status = ?, updatedAt = NOW() WHERE id = ?',
      [status, id]
    );

    return NextResponse.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('ADMIN SUPPORT PATCH ERROR:', error.message);
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

    await pool.execute('DELETE FROM support_requests WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    console.error('ADMIN SUPPORT DELETE ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
