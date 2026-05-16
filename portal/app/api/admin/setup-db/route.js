import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { isAdmin } from '@/lib/adminCheck';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Only allow admins to run migration
    if (!(await isAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting Database Migration...');

    // Add missing columns to projects table
    const alterQueries = [
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration VARCHAR(255)",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_requirement BOOLEAN DEFAULT FALSE",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS learning_outcome TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_scope TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS instructions TEXT",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      "ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ];

    for (const query of alterQueries) {
      try {
        await pool.execute(query);
        console.log(`Executed: ${query}`);
      } catch (err) {
        // Ignore "Duplicate column" errors if IF NOT EXISTS isn't supported or fails
        console.warn(`Query failed (might already exist): ${query}`, err.message);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully.' 
    });

  } catch (error) {
    console.error('MIGRATION ERROR:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
