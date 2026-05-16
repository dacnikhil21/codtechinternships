import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [tables] = await pool.execute('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    const stats = {};
    for (const name of tableNames) {
      const [count] = await pool.execute(`SELECT COUNT(*) as count FROM ${name}`);
      stats[name] = count[0].count;
    }

    // Deep check for projects
    const [tasks] = await pool.execute('SELECT * FROM task');
    const [projects] = await pool.execute('SELECT * FROM projects');
    const [domains] = await pool.execute('SELECT * FROM domains');

    return NextResponse.json({ 
      success: true, 
      tableStats: stats,
      allTasks: tasks,
      allProjects: projects,
      domains: domains
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
