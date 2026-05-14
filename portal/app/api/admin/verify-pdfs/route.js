import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// All expected domain PDF mappings (mirrors DOMAIN_TO_PDF from pdfs/route.js)
const EXPECTED_PDFS = {
  'React.js Web Development Intern': 'ReactjsWebDevelopment.pdf',
  'Mern Stack Web Development Intern': 'MernStackWebDevelopment.pdf',
  'Full Stack Web Development Intern': 'FullStackWebDevelopment.pdf',
  'Frontend Web Development Intern': 'FrontendWebDevelopment.pdf',
  'Backend Web Development Intern': 'BackendWebDevelopment.pdf',
  '.Net Web Development Intern': 'DotNetWebDevelopment.pdf',
  'Dot.Net Intern': 'DotNetWebDevelopment.pdf',
  'Figma Web Development Intern': 'FigmaWebDevelopment.pdf',
  'Figma App Development Intern': 'FigmaAppDevelopment.pdf',
  'UI/UX Design Intern': 'UIUXDesign.pdf',
  'Ul/UX Intern': 'UIUXDesign.pdf',
  'Python Programming Intern': 'Python.pdf',
  'Java Programming Intern': 'Java .pdf',
  'C,C++ programming Intern': 'C++ PROGRAMMING .pdf',
  'Data Analyst Intern': 'Data Analyst .pdf',
  'Data Analytics Intern': 'Data Analyst .pdf',
  'Data Science Intern': 'DATA SCIENCE .pdf',
  'Power BI Intern': 'POWERBI.pdf',
  'Bigdata Intern': 'Bigdata .pdf',
  'SQL Intern': 'SQL.pdf',
  'Machine Learning': 'AIML .pdf',
  'Artificial Intelligence': 'AIML .pdf',
  'Cloud Computing Intern': 'CLOUD COMPUTING .pdf',
  'Devops Intern': 'DEVOPS.pdf',
  'DevOps Intern': 'DEVOPS.pdf',
  'Cybersecurity & Ethical Hacking': 'CYBERSECURITY AND ETHICAL HACKING .pdf',
  'Embedded Systems Intern': 'Embedded Systems.pdf',
  'Internet Of things': 'Internet of things .pdf',
  'VLSI': 'VLSI.pdf',
  'Block Chain Technology Intern': 'Block Chain Technology.pdf',
  'Digital Marketing Intern': 'Digital Marketing.pdf',
  'Software Testing Intern': 'software testing.pdf',
  'Automation Testing Intern': 'Automation Testing.pdf',
  'App Development Intern': 'APP DEVELOPMENT.pdf',
  'Software Development Intern': 'SOFTWARE DEVELOPMENT  (1).pdf',
};

export async function GET() {
  const pdfsDir = path.join(process.cwd(), 'materials', 'raw_pdfs');
  
  const report = {
    pdfsDirectoryExists: false,
    totalPdfsOnDisk: 0,
    filesOnDisk: [],
    domainChecks: [],
    missingFiles: [],
    smallFiles: [],      // under 1MB — likely corrupted/incomplete
    summary: {}
  };

  // Check directory exists
  if (!fs.existsSync(pdfsDir)) {
    return NextResponse.json({
      success: false,
      message: 'materials/raw_pdfs directory NOT FOUND on this server!',
      report
    }, { status: 500 });
  }

  report.pdfsDirectoryExists = true;

  // List all files on disk
  const filesOnDisk = fs.readdirSync(pdfsDir).filter(f => f.endsWith('.pdf'));
  report.totalPdfsOnDisk = filesOnDisk.length;
  report.filesOnDisk = filesOnDisk.map(f => {
    const stat = fs.statSync(path.join(pdfsDir, f));
    const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
    return { name: f, sizeMB: parseFloat(sizeMB) };
  });

  // Flag suspiciously small files
  report.smallFiles = report.filesOnDisk
    .filter(f => f.sizeMB < 1.0)
    .map(f => `⚠️ ${f.name} (${f.sizeMB} MB) — possibly corrupted or incomplete`);

  // Check each expected domain mapping
  const seen = new Set();
  for (const [domain, filename] of Object.entries(EXPECTED_PDFS)) {
    if (seen.has(filename)) continue; // skip duplicates
    seen.add(filename);

    const filePath = path.join(pdfsDir, filename);
    const exists = fs.existsSync(filePath);
    let sizeMB = null;

    if (exists) {
      const stat = fs.statSync(filePath);
      sizeMB = parseFloat((stat.size / (1024 * 1024)).toFixed(2));
    } else {
      report.missingFiles.push(filename);
    }

    report.domainChecks.push({
      domain,
      file: filename,
      exists,
      sizeMB,
      status: exists ? (sizeMB < 1.0 ? '⚠️ EXISTS BUT TINY' : '✅ OK') : '❌ MISSING'
    });
  }

  const totalExpected = seen.size;
  const totalFound = report.domainChecks.filter(d => d.exists).length;
  const totalMissing = report.missingFiles.length;

  report.summary = {
    totalExpectedUnique: totalExpected,
    totalFoundOnDisk: totalFound,
    totalMissing,
    totalSmallFiles: report.smallFiles.length,
    overallStatus: totalMissing === 0
      ? (report.smallFiles.length > 0 ? '⚠️ ALL PRESENT BUT SOME FILES ARE TINY' : '✅ ALL PDFs VERIFIED')
      : `❌ ${totalMissing} PDF(s) MISSING`
  };

  return NextResponse.json({ success: true, report });
}
