import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// STRICT 1-to-1 Domain Mapping
// This ensures students ONLY see the PDF for their specific internship.
// STRICT 1-to-1 Domain Mapping — covers ALL register page variants
// Key = exact course name stored in DB | Value = filename on disk
const DOMAIN_TO_PDF = {
  // --- Web Dev ---
  'React.js Web Development Intern': 'ReactjsWebDevelopment.pdf',
  'Mern Stack Web Development Intern': 'MernStackWebDevelopment.pdf',
  'Full Stack Web Development Intern': 'FullStackWebDevelopment.pdf',
  'Frontend Web Development Intern': 'FrontendWebDevelopment.pdf',
  'Backend Web Development Intern': 'BackendWebDevelopment.pdf',

  // --- .NET (multiple spellings from register page) ---
  '.Net Web Development Intern': 'DotNetWebDevelopment.pdf',
  'Dot.Net Intern': 'DotNetWebDevelopment.pdf',

  // --- Figma ---
  'Figma Web Development Intern': 'FigmaWebDevelopment.pdf',
  'Figma App Development Intern': 'FigmaAppDevelopment.pdf',

  // --- UI/UX (includes register typo "Ul/UX" with lowercase L) ---
  'UI/UX Design Intern': 'UIUXDesign.pdf',
  'Ul/UX Intern': 'UIUXDesign.pdf',
  'UIUX Design Intern': 'UIUXDesign.pdf',

  // --- Programming Languages ---
  'Python Programming Intern': 'Python.pdf',
  'Java Programming Intern': 'Java .pdf',
  'C Programming Intern': 'C Programming.pdf',
  'C++ Programming Intern': 'C++ PROGRAMMING .pdf',
  'C,C++ programming Intern': 'C++ PROGRAMMING .pdf',  // combined course from register

  // --- Data ---
  'Data Analyst Intern': 'Data Analyst .pdf',
  'Data Analytics Intern': 'Data Analyst .pdf',         // register uses this name
  'Data Science Intern': 'DATA SCIENCE .pdf',
  'Power BI Intern': 'POWERBI.pdf',
  'Big Data Intern': 'Bigdata .pdf',
  'Bigdata Intern': 'Bigdata .pdf',
  'SQL Intern': 'SQL.pdf',

  // --- AI/ML (register page uses bare "Machine Learning" & "Artificial Intelligence") ---
  'Artificial Intelligence and Machine Learning Intern': 'AIML .pdf',
  'Artificial Intelligence': 'AIML .pdf',
  'Machine Learning': 'AIML .pdf',
  'Machine Learning Intern': 'AIML .pdf',
  'Artificial Intelligence Intern': 'AIML .pdf',

  // --- Cloud & DevOps ---
  'Cloud Computing Intern': 'CLOUD COMPUTING .pdf',
  'DevOps Intern': 'DEVOPS.pdf',
  'Devops Intern': 'DEVOPS.pdf',                        // lowercase variant from register

  // --- Security ---
  'Cybersecurity and Ethical Hacking Intern': 'CYBERSECURITY AND ETHICAL HACKING .pdf',
  'Cybersecurity & Ethical Hacking': 'CYBERSECURITY AND ETHICAL HACKING .pdf',
  'Cybersecurity & Ethical Hacking Intern': 'CYBERSECURITY AND ETHICAL HACKING .pdf',

  // --- Blockchain ---
  'Blockchain Technology Intern': 'Block Chain Technology.pdf',
  'Block Chain Technology Intern': 'Block Chain Technology.pdf',

  // --- Other Tech ---
  'Embedded Systems Intern': 'Embedded Systems.pdf',
  'Internet of Things Intern': 'Internet of things .pdf',
  'Internet Of things': 'Internet of things .pdf',      // register missing "Intern"
  'Internet Of things Intern': 'Internet of things .pdf',
  'VLSI': 'VLSI.pdf',                                   // register missing "Intern"
  'VLSI Intern': 'VLSI.pdf',
  'App Development Intern': 'APP DEVELOPMENT.pdf',
  'Software Development Intern': 'SOFTWARE DEVELOPMENT  (1).pdf',
  'Software Testing Intern': 'software testing.pdf',
  'Automation Testing Intern': 'Automation Testing.pdf',

  // --- Marketing & Business ---
  'Digital Marketing Intern': 'Digital Marketing.pdf',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courseName = searchParams.get('courseName');

  if (!courseName) {
    return NextResponse.json({ error: 'courseName is required' }, { status: 400 });
  }

  try {
    const pdfsDir = path.join(process.cwd(), 'materials', 'raw_pdfs');

    const rawCourse = courseName.trim();

    // PASS 1: Exact match (handles "VLSI", "Machine Learning", "Cybersecurity & Ethical Hacking" stored as-is)
    let filename = DOMAIN_TO_PDF[rawCourse];

    // PASS 2: Try with " Intern" appended
    if (!filename && !rawCourse.toLowerCase().endsWith('intern')) {
      filename = DOMAIN_TO_PDF[`${rawCourse} Intern`];
    }

    // PASS 3: Case-insensitive fallback scan
    if (!filename) {
      const lowerRaw = rawCourse.toLowerCase();
      const matchKey = Object.keys(DOMAIN_TO_PDF).find(
        k => k.toLowerCase() === lowerRaw || k.toLowerCase() === `${lowerRaw} intern`
      );
      if (matchKey) filename = DOMAIN_TO_PDF[matchKey];
    }

    if (!filename) {
      console.log(`[Materials] No mapping found for course: "${rawCourse}"`);
      return NextResponse.json([]);
    }

    const filePath = path.join(pdfsDir, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`[Materials] File mapped but NOT found on disk: ${filePath}`);
      return NextResponse.json([]);
    }

    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const readingTime = Math.max(10, Math.ceil(stats.size / (1024 * 50)));

    // Use the course name (minus "Intern") as the display name
    const cleanName = rawCourse.replace(/ Intern$/i, '').trim();

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


