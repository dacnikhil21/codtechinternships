import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const [domainRows] = await pool.execute('SELECT id FROM domains WHERE name = ? LIMIT 1', [session.course]);
    if (domainRows.length === 0) return NextResponse.json({ success: true, data: [] });

    const [rows] = await pool.execute('SELECT * FROM materials WHERE domain_id = ?', [domainRows[0].id]);
    
    // Fallback placeholders if no content yet
    const data = rows.length > 0 ? rows : [
      { name: 'Internship Orientation Guide', type: 'PDF', link: '#' },
      { name: 'Technical Setup Documentation', type: 'Guide', link: '#' },
      { name: `${session.course} Reference Book`, type: 'Resource', link: '#' }
    ];

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
