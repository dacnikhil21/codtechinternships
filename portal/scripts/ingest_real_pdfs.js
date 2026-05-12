/**
 * CodTech Real Material Ingestor
 * 
 * Usage: 
 * 1. Place your client PDFs in portal/materials/raw_pdfs/
 * 2. Organize them into folders named exactly as the domain (e.g. "Java Programming Intern")
 * 3. Run: node scripts/ingest_real_pdfs.js
 * 
 * This script will:
 * - Parse the PDF text
 * - Preserve ALL exact explanations and code
 * - Upload to the database
 */
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import pdf from 'pdf-parse';
import { parsePdfTextToCurriculum } from '../lib/pdfParser.js';

async function ingest() {
  const DATABASE_URL = process.env.DATABASE_URL;
  let conn;
  try {
    if (DATABASE_URL) {
      conn = await mysql.createConnection(DATABASE_URL);
    } else {
      conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'u371402898_ctadmin',
        password: 'Codtech2002',
        database: 'u371402898_ctintern'
      });
    }
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  const baseDir = './materials/raw_pdfs';

  if (!fs.existsSync(baseDir)) {
    console.error(`❌ Directory ${baseDir} does not exist.`);
    return;
  }

  // Get all PDFs recursively
  const files = [];
  function getFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath);
      } else if (item.endsWith('.pdf')) {
        files.push(fullPath);
      }
    }
  }
  getFiles(baseDir);

  console.log(`🚀 Found ${files.length} PDF files. Starting ingestion...`);

  for (const filePath of files) {
    const fileName = path.basename(filePath, '.pdf').trim();
    console.log(`📄 Processing: ${fileName}`);
    
    // Find matching domain in DB
    // Use fuzzy search since filenames might not match domain names exactly
    const [dRows] = await conn.execute(
      'SELECT id, name FROM domains WHERE name LIKE ? OR ? LIKE CONCAT("%", name, "%") OR name LIKE CONCAT("%", ?, "%")',
      [`%${fileName}%`, fileName, fileName]
    );

    if (dRows.length === 0) {
      console.warn(`⚠️ No matching domain found for "${fileName}". Skipping.`);
      continue;
    }

    const domainId = dRows[0].id;
    const domainName = dRows[0].name;
    console.log(`   ✅ Matched to Domain: ${domainName} (ID: ${domainId})`);

    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdf(dataBuffer);
      
      // Clean old data for this domain to avoid duplicates
      await conn.execute('DELETE FROM curriculum_modules WHERE domain_id = ?', [domainId]);

      const structuredContent = parsePdfTextToCurriculum(data.text);
      
      for (const [mIdx, mod] of structuredContent.entries()) {
        const [mRes] = await conn.execute(
          'INSERT INTO curriculum_modules (domain_id, title, description, order_index) VALUES (?, ?, ?, ?)',
          [domainId, mod.title || 'Introduction', mod.description || '', mIdx]
        );
        const moduleId = mRes.insertId;

        for (const [lIdx, lesson] of mod.lessons.entries()) {
          await conn.execute(
            'INSERT INTO curriculum_lessons (module_id, title, content, key_points, order_index) VALUES (?, ?, ?, ?, ?)',
            [moduleId, lesson.title, lesson.content, JSON.stringify(lesson.keyPoints), lIdx]
          );
        }
      }
      console.log(`   ✨ Successfully ingested ${structuredContent.length} modules.`);
    } catch (err) {
      console.error(`   ❌ Error processing ${fileName}:`, err.message);
    }
  }

  await conn.end();
  console.log('🚀 INGESTION COMPLETE. Your dashboard is now powered by REAL client materials.');
}

ingest().catch(console.error);
