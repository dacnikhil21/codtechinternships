import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import pdf from 'pdf-parse';
import { parsePdfTextToCurriculum } from '@/lib/pdfParser';

export async function GET() {
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) return NextResponse.json({ success: false, message: 'DATABASE_URL missing' });

  const baseDir = path.join(process.cwd(), 'materials', 'raw_pdfs');
  if (!fs.existsSync(baseDir)) {
    return NextResponse.json({ success: false, message: `Folder not found at ${baseDir}. Please upload PDFs first.` });
  }

  try {
    const conn = await mysql.createConnection(DATABASE_URL);
    const domains = fs.readdirSync(baseDir);
    const report = [];

    for (const domainName of domains) {
      const domainPath = path.join(baseDir, domainName);
      if (!fs.statSync(domainPath).isDirectory()) continue;

      // Find domain id
      const [dRows] = await conn.execute('SELECT id FROM domains WHERE name LIKE ?', [`%${domainName}%`]);
      if (dRows.length === 0) continue;
      const domainId = dRows[0].id;

      const files = fs.readdirSync(domainPath).filter(f => f.endsWith('.pdf'));

      for (const file of files) {
        const dataBuffer = fs.readFileSync(path.join(domainPath, file));
        const data = await pdf(dataBuffer);
        const structuredContent = parsePdfTextToCurriculum(data.text);
        
        for (const mod of structuredContent) {
          const [mRes] = await conn.execute(
            'INSERT INTO curriculum_modules (domain_id, title, description) VALUES (?, ?, ?)',
            [domainId, mod.title, mod.description]
          );
          const moduleId = mRes.insertId;

          for (const lesson of mod.lessons) {
            await conn.execute(
              'INSERT INTO curriculum_lessons (module_id, title, content, key_points) VALUES (?, ?, ?, ?)',
              [moduleId, lesson.title, lesson.content, JSON.stringify(lesson.keyPoints)]
            );
          }
        }
        report.push(`Ingested ${file} for ${domainName}`);
      }
    }

    await conn.end();
    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
