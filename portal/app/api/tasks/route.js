import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 1. Find the Domain ID based on student's course name
    const [domainRows] = await pool.execute(
      'SELECT id FROM domains WHERE name = ? LIMIT 1',
      [session.course]
    );

    if (domainRows.length === 0) {
      return NextResponse.json({ success: true, data: [] }); // No domain found, return empty
    }

    const domainId = domainRows[0].id;

    // 2. Fetch projects for this domain only (30 projects)
    const [projects] = await pool.execute(
      'SELECT id, name as title, description, difficulty as level FROM projects WHERE domain_id = ? ORDER BY id ASC',
      [domainId]
    );

    return NextResponse.json({ success: true, data: projects });

  } catch (error) {
    console.error('PROJECTS API ERROR:', error.message);
    return NextResponse.json({ success: false, message: `Error: ${error.message}` }, { status: 500 });
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
