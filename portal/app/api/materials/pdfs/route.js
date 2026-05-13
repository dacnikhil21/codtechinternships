import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courseName = searchParams.get('courseName');

  if (!courseName) {
    return NextResponse.json({ error: 'courseName is required' }, { status: 400 });
  }

  try {
    const pdfsDir = path.join(process.cwd(), 'materials', 'raw_pdfs');

    if (!fs.existsSync(pdfsDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(pdfsDir).filter(f => f.toLowerCase().endsWith('.pdf'));

    // Normalization function to compare domain names with filenames
    const normalize = (str) => {
      let s = str.toLowerCase();
      s = s.replace(/\b(internship|intern|course|program)\b/gi, '');
      s = s.replace(/\(\d+\)/g, '');
      s = s.replace(/^copy of\s*/gi, '');
      s = s.replace(/[^a-z0-9]/g, '');
      return s;
    };

    const normalizedCourse = normalize(courseName);

    // Find exact normalized match only
    const exactMatch = files.find(file => {
      const nameWithoutExt = file.replace(/\.pdf$/i, '').trim();
      const normalizedFile = normalize(nameWithoutExt);
      return normalizedFile === normalizedCourse;
    });

    const finalFiles = exactMatch ? [exactMatch] : [];

    const result = finalFiles.map(file => {
      const stats = fs.statSync(path.join(pdfsDir, file));
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      const readingTime = Math.max(10, Math.ceil(stats.size / (1024 * 50)));

      let cleanName = file.replace(/\.pdf$/i, '').trim();
      cleanName = cleanName.replace(/\s*\(\d+\)$/, '').replace(/^Copy of\s*/i, '').replace(/^_\./, '.');

      return {
        id: encodeURIComponent(file),
        name: cleanName,
        filename: file,
        size: `${sizeMB} MB`,
        readingTime: `${readingTime} mins`
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scanning PDFs:', error);
    return NextResponse.json({ error: 'Failed to load materials' }, { status: 500 });
  }
}

