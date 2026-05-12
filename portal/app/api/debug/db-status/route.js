import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    const [domains] = await pool.execute('SELECT name FROM domains');
    const [projectsCount] = await pool.execute('SELECT count(*) as count FROM projects');
    
    const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const userCourseNorm = normalize(session?.course);
    const targetDomain = domains.find(d => normalize(d.name) === userCourseNorm);

    let domainProjects = 0;
    if (targetDomain) {
      // Find domain id first to count projects
      const [domInfo] = await pool.execute('SELECT id FROM domains WHERE name = ?', [targetDomain.name]);
      const [countResult] = await pool.execute('SELECT count(*) as count FROM projects WHERE domain_id = ?', [domInfo[0].id]);
      domainProjects = countResult[0].count;
    }
    
    return NextResponse.json({
      status: 'Detailed Check',
      sessionCourse: session?.course || 'NO COURSE IN SESSION',
      detectedDomain: targetDomain?.name || 'NOT DETECTED',
      projectsInThisDomain: domainProjects,
      totalProjectsInSystem: projectsCount[0].count,
      advice: domainProjects === 0 ? 'PROJECTS ARE NOT LINKED TO THIS DOMAIN ID' : 'UI RENDERING ISSUE'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
