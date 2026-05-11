import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // 1. Find the Domain ID based on normalized student's course name
    const [allDomains] = await pool.execute('SELECT id, name FROM domains');
    
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const userCourseNorm = normalize(session.course);
    
    let targetDomain = allDomains.find(d => normalize(d.name) === userCourseNorm);

    // If no exact normalized match, try partial match (e.g. "AI" in "Artificial Intelligence")
    if (!targetDomain) {
      const coursePrefix = session.course.split(/[ /]/)[0]; // Get first word
      targetDomain = allDomains.find(d => normalize(d.name).includes(normalize(coursePrefix)));
    }

    if (!targetDomain) {
      return NextResponse.json({ success: true, data: [], message: 'No projects available for this domain.' });
    }

    const domainId = targetDomain.id;

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
