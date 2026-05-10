import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [tables] = await pool.execute('SHOW TABLES');
    
    // Check 'task' table
    const [tasks] = await pool.execute('SELECT * FROM task LIMIT 10');
    
    // Check 'projects' table
    const [projects] = await pool.execute('SELECT * FROM projects LIMIT 10');
    
    // Check 'domains' table
    const [domains] = await pool.execute('SELECT * FROM domains');

    return NextResponse.json({ 
      success: true, 
      tables,
      taskCount: (await pool.execute('SELECT COUNT(*) as count FROM task'))[0][0].count,
      projectCount: (await pool.execute('SELECT COUNT(*) as count FROM projects'))[0][0].count,
      domainCount: domains.length,
      sampleTasks: tasks,
      sampleProjects: projects,
      domains: domains.map(d => ({ id: d.id, name: d.name }))
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
