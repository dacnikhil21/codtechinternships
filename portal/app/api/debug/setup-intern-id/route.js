import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [columns] = await pool.execute('SHOW COLUMNS FROM user');
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('intern_id')) {
      await pool.execute('ALTER TABLE user ADD COLUMN intern_id VARCHAR(50) DEFAULT NULL');
      return NextResponse.json({ success: true, message: 'intern_id column added successfully.' });
    } else {
      return NextResponse.json({ success: true, message: 'intern_id column already exists.' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
