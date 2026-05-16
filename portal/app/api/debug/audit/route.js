import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const domainsToTest = [
      "React.js Web Development Intern",
      "Software Development Intern",
      "Artificial Intelligence"
    ];
    
    const results = {};

    for (const dName of domainsToTest) {
      const [rows] = await pool.execute(`
        SELECT p.name 
        FROM projects p 
        JOIN domains d ON p.domain_id = d.id 
        WHERE d.name = ? 
        LIMIT 5
      `, [dName]);
      results[dName] = rows.map(r => r.name);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
