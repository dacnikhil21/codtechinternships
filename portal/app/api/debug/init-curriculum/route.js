import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return NextResponse.json({ success: false, message: 'DATABASE_URL is missing.' });
  }

  try {
    const conn = await mysql.createConnection(DATABASE_URL);
    
    // Create curriculum modules table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS curriculum_modules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        domain_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        time_estimate VARCHAR(50),
        difficulty VARCHAR(50),
        order_index INT DEFAULT 0,
        FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
      )
    `);

    // Create curriculum lessons table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS curriculum_lessons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        module_id INT,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT,
        key_points JSON,
        order_index INT DEFAULT 0,
        FOREIGN KEY (module_id) REFERENCES curriculum_modules(id) ON DELETE CASCADE
      )
    `);

    await conn.end();
    return NextResponse.json({ success: true, message: 'Curriculum tables initialized on server.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
