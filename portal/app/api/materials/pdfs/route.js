import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

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

    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedCourse = normalize(courseName);

    // Advanced matching logic
    // We want to match cases where courseName = "python programming" and file = "python .pdf"
    // Or courseName = "React.js Web Development" and file = "React.js Web Development .pdf"
    const matchedFiles = files.filter(file => {
      const rawFileName = file.replace(/\.pdf$/i, '').trim().replace(/\s*\(\d+\)$/, '');
      const normalizedFile = normalize(rawFileName);
      
      // Exact or partial subset match
      if (normalizedFile === normalizedCourse) return true;
      if (normalizedFile.includes(normalizedCourse) || normalizedCourse.includes(normalizedFile)) return true;
      
      // Keyword match (if they share a major keyword like "react", "python", "java")
      const courseWords = courseName.toLowerCase().split(/[\s-]+/);
      const fileWords = rawFileName.toLowerCase().split(/[\s-]+/);
      
      const importantKeywords = ['react', 'python', 'java', 'sql', 'figma', 'uiux', 'aiml', 'data', 'web', 'backend', 'frontend', 'mern', 'fullstack', 'devops', 'cloud', 'cybersecurity'];
      
      for (const word of courseWords) {
        if (importantKeywords.includes(word) && fileWords.includes(word)) {
          return true;
        }
      }
      
      return false;
    });

    const result = matchedFiles.map(file => {
      const stats = fs.statSync(path.join(pdfsDir, file));
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      // Rough reading time estimate based on file size (assuming dense technical PDF)
      const readingTime = Math.max(10, Math.ceil(stats.size / (1024 * 50)));

      // Clean name for display: remove (1), Copy of, extra spaces
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

    // If no specific match found, we don't return all. The user requested strict domain filtering.
    // "No unrelated domains."
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scanning PDFs:', error);
    return NextResponse.json({ error: 'Failed to load materials' }, { status: 500 });
  }
}
