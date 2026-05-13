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
    
    // 1. Try Exact Match
    let targetDomain = allDomains.find(d => normalize(d.name) === userCourseNorm);

    // 2. Intelligent Overrides & Substring Match
    if (!targetDomain) {
      const overrides = {
        'aiml': 'artificialintelligence',
        'ai': 'artificialintelligence',
        'ml': 'machinelearning',
        'cybersec': 'cybersecurity',
        'ux': 'uiux',
        'softwaretesting': 'softwaretestingintern',
        'automationtesting': 'automationtestingintern',
        'figmaapp': 'figmaappdevelopmentintern',
        'figmaweb': 'figmawebdevelopmentintern',
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
      
      // Check for direct override match
      for (const [key, val] of Object.entries(overrides)) {
        if (userCourseNorm.includes(key)) {
          targetDomain = allDomains.find(d => normalize(d.name).includes(val));
          if (targetDomain) break;
        }
      }
    }

    // 3. Last resort: Partial match but prioritize longer domain names to avoid broad matches
    if (!targetDomain) {
      const coursePrefix = session.course.split(/[ /]/)[0].toLowerCase();
      if (coursePrefix.length > 2) {
        // Sort domains by length descending to match most specific first
        const sortedDomains = [...allDomains].sort((a, b) => b.name.length - a.name.length);
        targetDomain = sortedDomains.find(d => normalize(d.name).includes(normalize(coursePrefix)));
      }
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
