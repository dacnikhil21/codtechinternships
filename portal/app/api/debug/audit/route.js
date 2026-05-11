import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // 1. Total Project Count
    const [totalRes] = await pool.execute('SELECT COUNT(*) as total FROM projects');
    
    // 2. Count per Domain
    const [domainRes] = await pool.execute(`
      SELECT d.name as domain_name, COUNT(p.id) as project_count 
      FROM domains d 
      LEFT JOIN projects p ON d.id = p.domain_id 
      GROUP BY d.id, d.name
    `);
    
    // 3. Sample User Data (to check course names)
    const [userRes] = await pool.execute('SELECT email, course FROM user LIMIT 5');

    return NextResponse.json({
      success: true,
      audit: {
        totalProjects: totalRes[0].total,
        breakdown: domainRes,
        sampleUsers: userRes
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
