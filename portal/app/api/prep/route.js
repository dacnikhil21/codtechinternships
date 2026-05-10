import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const [domainRows] = await pool.execute('SELECT id FROM domains WHERE name = ? LIMIT 1', [session.course]);
    if (domainRows.length === 0) return NextResponse.json({ success: true, data: [] });

    const [rows] = await pool.execute('SELECT * FROM preparation WHERE domain_id = ?', [domainRows[0].id]);
    
    // Fallback placeholders if no content yet
    const data = rows.length > 0 ? rows : [
      { title: `${session.course} Interview Q&A`, content: 'Essential questions for your upcoming technical rounds.', category: 'Interview' },
      { title: `${session.course} Master Roadmap`, content: 'A step-by-step guide to mastering this domain.', category: 'Roadmap' },
      { title: `${session.course} Best Practices`, content: 'Industry standards and professional tips.', category: 'Basics' }
    ];

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
