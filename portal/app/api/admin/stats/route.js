import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { isAdmin } from '@/lib/adminCheck';

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // 1. Total Students
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM user WHERE role = "student"');
    
    // 2. Total Projects
    const [projectCount] = await pool.execute('SELECT COUNT(*) as count FROM projects');

    // 3. Most Popular Courses (Top 5)
    const [topCourses] = await pool.execute(`
      SELECT course, COUNT(*) as count 
      FROM user 
      WHERE role = "student" 
      GROUP BY course 
      ORDER BY count DESC 
      LIMIT 5
    `);

    // 4. Recent Registrations (Last 5)
    const [recentUsers] = await pool.execute(`
      SELECT name, email, course, createdAt 
      FROM user 
      WHERE role = "student" 
      ORDER BY createdAt DESC 
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: userCount[0].count,
        totalProjects: projectCount[0].count,
        topCourses,
        recentUsers
      }
    });

  } catch (error) {
    console.error('ADMIN STATS ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
