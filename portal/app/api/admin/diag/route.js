import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results = {};
  
  try {
    results.db_connection = "Testing...";
    await pool.execute('SELECT 1');
    results.db_connection = "OK";
    
    results.query_user_count = "Testing...";
    await pool.execute('SELECT COUNT(*) as count FROM user WHERE role = "student"');
    results.query_user_count = "OK";
    
    results.query_project_count = "Testing...";
    await pool.execute('SELECT COUNT(*) as count FROM projects');
    results.query_project_count = "OK";
    
    results.query_top_courses = "Testing...";
    await pool.execute(`SELECT course, COUNT(*) as count FROM user WHERE role = "student" GROUP BY course ORDER BY count DESC LIMIT 5`);
    results.query_top_courses = "OK";
    
    results.query_recent_users = "Testing...";
    await pool.execute(`SELECT name, email, course, createdAt FROM user WHERE role = "student" ORDER BY createdAt DESC LIMIT 5`);
    results.query_recent_users = "OK";

    results.query_users_list = "Testing...";
    await pool.execute('SELECT id, name, email, course, role, createdAt FROM user WHERE role = "student" ORDER BY createdAt DESC LIMIT 1');
    results.query_users_list = "OK";

    return NextResponse.json({ success: true, message: "All queries passed!", results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack, results });
  }
}
