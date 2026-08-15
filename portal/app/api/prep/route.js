import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    // 1. Find the Domain ID based on normalized student's course name (Sync with tasks API)
    const [allDomains] = await pool.execute('SELECT id, name FROM domains');
    
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const userCourseNorm = normalize(session.course);
    
    let targetDomain = allDomains.find(d => normalize(d.name) === userCourseNorm);

    if (!targetDomain) {
      const overrides = {
        'aiml': 'artificialintelligence',
        'ai': 'artificialintelligence',
        'ml': 'machinelearning',
        'cybersec': 'cybersecurity',
        'ux': 'uiux',
        'softwaretesting': 'softwaretestingintern',
        'automationtesting': 'automationtestingintern',
        'fullstack': 'fullstackwebdevelopmentintern',
        'frontend': 'frontendwebdevelopmentintern',
        'backend': 'backendwebdevelopmentintern',
        'datascience': 'datascienceintern',
        'dotnet': 'dotnetwebdevelopmentintern',
        'powerbi': 'powerbi',
        'blockchain': 'blockchaintechnology',
        'bigdata': 'bigdata',
        'iot': 'internetofthings',
        'vlsi': 'vlsi',
        'dataanalytics': 'dataanalyst'
      };
      for (const [key, val] of Object.entries(overrides)) {
        if (userCourseNorm.includes(key)) {
          targetDomain = allDomains.find(d => normalize(d.name).includes(val));
          if (targetDomain) break;
        }
      }
    }

    if (!targetDomain) {
      const coursePrefix = session.course.split(/[ /]/)[0].toLowerCase();
      if (coursePrefix.length > 2) {
        const sortedDomains = [...allDomains].sort((a, b) => b.name.length - a.name.length);
        targetDomain = sortedDomains.find(d => normalize(d.name).includes(normalize(coursePrefix)));
      }
    }

    if (!targetDomain) return NextResponse.json({ success: true, data: [] });

    const [rows] = await pool.execute('SELECT id, category, title, description, content, level FROM preparation WHERE domain_id = ?', [targetDomain.id]);
    
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('PREP API ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
