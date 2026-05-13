import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// STRICT 1-to-1 Domain Mapping
// This ensures students ONLY see the PDF for their specific internship.
const DOMAIN_TO_PDF = {
  'React.js Web Development Intern': 'ReactjsWebDevelopment.pdf',
  'Mern Stack Web Development Intern': 'MernStackWebDevelopment.pdf',
  '.Net Web Development Intern': 'DotNetWebDevelopment.pdf',
  'Figma Web Development Intern': 'FigmaWebDevelopment.pdf',
  'Figma App Development Intern': 'FigmaAppDevelopment.pdf',
  'Full Stack Web Development Intern': 'FullStackWebDevelopment.pdf',
  'Frontend Web Development Intern': 'FrontendWebDevelopment.pdf',
  'Backend Web Development Intern': 'BackendWebDevelopment.pdf',
  'Python Programming Intern': 'Python.pdf',
  'UI/UX Design Intern': 'UIUXDesign.pdf',
  'Power BI Intern': 'POWERBI.pdf',
  'Data Analyst Intern': 'Data Analyst .pdf',
  'Data Science Intern': 'DATA SCIENCE .pdf',
  'Cybersecurity and Ethical Hacking Intern': 'CYBERSECURITY AND ETHICAL HACKING .pdf',
  'Artificial Intelligence and Machine Learning Intern': 'AIML .pdf',
  'Cloud Computing Intern': 'CLOUD COMPUTING .pdf',
  'DevOps Intern': 'DEVOPS.pdf',
  'Digital Marketing Intern': 'Digital Marketing.pdf',
  'Software Testing Intern': 'software testing.pdf',
  'Java Programming Intern': 'Java .pdf',
  'C Programming Intern': 'C Programming.pdf',
  'C++ Programming Intern': 'C++ PROGRAMMING .pdf',
  'SQL Intern': 'SQL.pdf',
  'Embedded Systems Intern': 'Embedded Systems.pdf',
  'Internet of Things Intern': 'Internet of things .pdf',
  'VLSI Intern': 'VLSI.pdf',
  'Big Data Intern': 'Bigdata .pdf',
  'Blockchain Technology Intern': 'Block Chain Technology.pdf',
  'Software Development Intern': 'SOFTWARE DEVELOPMENT  (1).pdf',
  'Automation Testing Intern': 'Automation Testing.pdf',
  'App Development Intern': 'APP DEVELOPMENT.pdf',
  'UIUX Design Intern': 'UIUXDesign.pdf'
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courseName = searchParams.get('courseName');

  if (!courseName) {
    return NextResponse.json({ error: 'courseName is required' }, { status: 400 });
  }

  try {
    const pdfsDir = path.join(process.cwd(), 'materials', 'raw_pdfs');

    // Add " Intern" suffix if not present for matching
    let normalizedCourse = courseName.trim();
    if (!normalizedCourse.toLowerCase().endsWith('intern')) {
       normalizedCourse = `${normalizedCourse} Intern`;
    }

    // Strict lookup
    const filename = DOMAIN_TO_PDF[normalizedCourse];
    
    if (!filename) {
      console.log(`No strict mapping found for domain: ${normalizedCourse}`);
      return NextResponse.json([]);
    }

    const filePath = path.join(pdfsDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`File mapped but not found on disk: ${filePath}`);
      return NextResponse.json([]);
    }

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const readingTime = Math.max(10, Math.ceil(stats.size / (1024 * 50)));

    let cleanName = filename.replace(/\.pdf$/i, '').trim();

    const result = [{
      id: encodeURIComponent(filename),
      name: cleanName,
      filename: filename,
      size: `${sizeMB} MB`,
      readingTime: `${readingTime} mins`
    }];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching PDF mapping:', error);
    return NextResponse.json({ error: 'Failed to load materials' }, { status: 500 });
  }
}


