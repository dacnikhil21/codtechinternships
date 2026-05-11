import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    const [userRows] = await pool.execute('SELECT course FROM user WHERE email = ?', [email]);
    if (userRows.length === 0) return NextResponse.json({ error: 'User not found' });
    const userCourse = userRows[0].course;

    const [domainRows] = await pool.execute('SELECT id, name FROM domains WHERE name = ?', [userCourse]);
    const matchedId = domainRows.length > 0 ? domainRows[0].id : 'NONE';

    const [projectSample] = await pool.execute('SELECT name FROM projects WHERE domain_id = ? LIMIT 3', [matchedId]);
    const [taskSample] = await pool.execute('SELECT title FROM task LIMIT 3');

    return NextResponse.json({
      email,
      userCourse,
      matchedDomainId: matchedId,
      projectsFromNewTable: projectSample.map(p => p.name),
      projectsFromLegacyTable: taskSample.map(t => t.title),
      status: projectSample.length > 0 ? "SUCCESS" : "MATCH_FAILED"
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
