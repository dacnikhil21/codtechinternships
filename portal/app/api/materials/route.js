import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const userCourse = session.course?.toUpperCase() || '';

    // 1. Try Database First
    const [domainRows] = await pool.execute('SELECT id FROM domains WHERE UPPER(name) = ? LIMIT 1', [userCourse]);
    
    if (domainRows.length > 0) {
      const [modules] = await pool.execute(
        'SELECT * FROM curriculum_modules WHERE domain_id = ? ORDER BY order_index',
        [domainRows[0].id]
      );

      if (modules.length > 0) {
        const data = [];
        for (const mod of modules) {
          const [lessons] = await pool.execute(
            'SELECT * FROM curriculum_lessons WHERE module_id = ? ORDER BY order_index',
            [mod.id]
          );
          data.push({
            ...mod,
            lessons: lessons.map(l => ({
              ...l,
              keyPoints: typeof l.key_points === 'string' ? JSON.parse(l.key_points) : l.key_points
            }))
          });
        }
        return NextResponse.json({ success: true, data, source: 'database' });
      }
    }

    // 2. Fallback to Static JSON (Real Content from PDFs)
    const jsonPath = path.join(process.cwd(), 'lib', 'real_curriculum.json');
    if (fs.existsSync(jsonPath)) {
      const allData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      const userCourseNorm = normalize(userCourse);
      
      const overrides = {
        'dotnet': '_.net',
        'backend': 'backend  web development  (1)',
        'dataanalytics': 'data analyst',
        'powerbi': 'powerbi',
        'blockchain': 'block chain technology',
        'bigdata': 'bigdata',
        'uiux': 'uiux design  (1)',
        'artificialintelligence': 'aiml',
        'machinelearning': 'aiml',
        'cybersec': 'cybersecurity and ethical hacking',
        'softwaredevelopment': 'software development  (1)'
      };

      let matchingKey = Object.keys(allData).find(key => 
        userCourse.includes(key) || key.includes(userCourse) || normalize(key) === userCourseNorm
      );

      if (!matchingKey) {
        for (const [key, val] of Object.entries(overrides)) {
          if (userCourseNorm.includes(key)) {
            matchingKey = Object.keys(allData).find(k => k.toLowerCase() === val.toLowerCase());
            if (matchingKey) break;
          }
        }
      }
      
      if (!matchingKey) {
        const coursePrefix = userCourse.split(/[ /]/)[0].toLowerCase();
        if (coursePrefix.length > 2) {
           matchingKey = Object.keys(allData).find(k => k.toLowerCase().includes(coursePrefix));
        }
      }
      
      if (matchingKey) {
        return NextResponse.json({ 
          success: true, 
          data: allData[matchingKey], 
          source: 'static_json' 
        });
      }
    }

    return NextResponse.json({ success: true, data: [], message: 'No materials found' });
  } catch (error) {
    console.error('Materials API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
