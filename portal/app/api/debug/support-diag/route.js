import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.execute("SHOW TABLES LIKE 'support_requests'");
    if (rows.length > 0) {
      return NextResponse.json({ success: true, message: "Table 'support_requests' exists." });
    } else {
      return NextResponse.json({ success: false, message: "Table 'support_requests' MISSING." });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}
