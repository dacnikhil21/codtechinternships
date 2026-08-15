import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
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

    // 2. Fallback to Static JSON (Optimized: Lazy Load Domain Specific File)
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const userCourseNorm = normalize(userCourse);
    
    // Domain mapping for files
    const fileOverrides = {
      'dotnet': '___net',
      'backend': 'backend__web_development___1_',
      'dataanalytics': 'data_analyst',
      'powerbi': 'powerbi',
      'blockchain': 'block_chain_technology',
      'bigdata': 'bigdata',
      'uiux': 'uiux_design___1_',
      'artificialintelligence': 'aiml',
      'machinelearning': 'aiml',
      'cybersec': 'cybersecurity_and_ethical_hacking',
      'softwaredevelopment': 'software_development___1_',
      'mern': 'mern_stack_web_development',
      'fullstack': 'full_stack_web_development'
    };

    let targetFile = '';
    
    // Check overrides first
    for (const [key, val] of Object.entries(fileOverrides)) {
      if (userCourseNorm.includes(key)) {
        targetFile = val;
        break;
      }
    }

    if (!targetFile) {
      targetFile = userCourseNorm;
    }

    const jsonPath = path.join(process.cwd(), 'lib', 'curriculum_data', `${targetFile}.json`);
    
    if (fs.existsSync(jsonPath)) {
      const domainData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      return NextResponse.json({ 
        success: true, 
        data: domainData, 
        source: 'static_json_optimized' 
      });
    }

    // Secondary fallback: Try searching in the directory
    const dataDir = path.join(process.cwd(), 'lib', 'curriculum_data');
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      const matched = files.find(f => f.includes(targetFile) || targetFile.includes(f.replace('.json', '')));
      if (matched) {
        const domainData = JSON.parse(fs.readFileSync(path.join(dataDir, matched), 'utf8'));
        return NextResponse.json({ 
          success: true, 
          data: domainData, 
          source: 'static_json_fuzzy' 
        });
      }
    }

    return NextResponse.json({ success: true, data: [], message: 'No materials found' });
  } catch (error) {
    console.error('Materials API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
