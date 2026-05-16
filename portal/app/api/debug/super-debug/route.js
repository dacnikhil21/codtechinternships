import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    let userCourse = '';
    if (email) {
      const [userRows] = await pool.execute('SELECT course FROM user WHERE email = ?', [email]);
      if (userRows.length > 0) userCourse = userRows[0].course;
    } else {
      const session = await getSession();
      if (!session) return NextResponse.json({ error: 'Not logged in' });
      userCourse = session.course;
    }

    // 2. Find the Domain ID
    const [domainRows] = await pool.execute('SELECT id, name FROM domains WHERE name = ?', [userCourse]);
    const matchedId = domainRows.length > 0 ? domainRows[0].id : 'NONE';

    // 3. Sample from PROJECTS table (where the 990 projects are)
    const [projectSample] = await pool.execute('SELECT name FROM projects WHERE domain_id = ? LIMIT 3', [matchedId]);

    // 4. Sample from TASK table (where the 4 legacy projects are)
    const [taskSample] = await pool.execute('SELECT title FROM task LIMIT 3');

    return NextResponse.json({
      sessionCourse: userCourse,
      matchedDomainId: matchedId,
      databaseFacts: {
        projectsFromNewTable: projectSample.map(p => p.name),
        projectsFromLegacyTable: taskSample.map(t => t.title)
      },
      verdict: projectSample.length > 0 ? "Reading from New Table" : "Matched ID found no projects or Match Failed"
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
