import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch tasks for the user's domain only
    const [tasks] = await pool.execute(
      'SELECT * FROM task WHERE domain = ? ORDER BY batch ASC, createdAt ASC',
      [session.course]
    );

    return NextResponse.json({ success: true, data: tasks });

  } catch (error) {
    console.error('TASKS ERROR:', error.message);
    return NextResponse.json({ success: false, message: `Tasks error: ${error.message}` }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { title, description, domain, batch, level, roadmap } = await req.json();

    const [result] = await pool.execute(
      'INSERT INTO task (title, description, domain, batch, level, roadmap, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [title, description, domain, batch, level, roadmap]
    );

    return NextResponse.json({ success: true, data: { id: result.insertId } }, { status: 201 });

  } catch (error) {
    console.error('CREATE TASK ERROR:', error.message);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
