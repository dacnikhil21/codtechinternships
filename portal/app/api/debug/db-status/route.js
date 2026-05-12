import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    const [domains] = await pool.execute('SELECT name FROM domains');
    const [projectsCount] = await pool.execute('SELECT count(*) as count FROM projects');
    
    return NextResponse.json({
      status: 'Ready',
      sessionCourse: session?.course || 'NO COURSE IN SESSION',
      availableDomains: domains.map(d => d.name),
      totalProjects: projectsCount[0].count,
      advice: domains.length === 0 ? 'UPLOAD DOMAINS TO DATABASE' : 'CHECK COURSE NAME MATCH'
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
