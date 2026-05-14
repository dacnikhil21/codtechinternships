import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// ─── Resume Text Extraction Helpers ───────────────────────────────────────────

function extractEmail(text) {
  const match = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const match = text.match(/(\+91[\s\-]?)?(\d[\s\-]?){10}/);
  return match ? match[0].replace(/\s/g, '') : '';
}

function extractName(lines) {
  // First non-empty, non-header line that looks like a name (2-4 words, no special chars)
  for (const line of lines.slice(0, 8)) {
    const cleaned = line.trim();
    if (
      cleaned.length > 3 &&
      cleaned.length < 60 &&
      /^[A-Za-z][A-Za-z\s.'-]+$/.test(cleaned) &&
      !cleaned.toLowerCase().includes('resume') &&
      !cleaned.toLowerCase().includes('curriculum') &&
      !cleaned.toLowerCase().includes('profile')
    ) {
      return cleaned;
    }
  }
  return '';
}

function extractLinkedIn(text) {
  const match = text.match(/linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/i);
  return match ? `https://www.${match[0]}` : '';
}

function extractGitHub(text) {
  const match = text.match(/github\.com\/[a-zA-Z0-9\-_%]+/i);
  return match ? `https://www.${match[0]}` : '';
}

function extractSection(text, startKeywords, stopKeywords) {
  const lines = text.split('\n');
  let capturing = false;
  const result = [];

  for (const line of lines) {
    const upper = line.trim().toUpperCase();

    if (!capturing) {
      if (startKeywords.some(k => upper.includes(k.toUpperCase()))) {
        capturing = true;
        continue;
      }
    } else {
      if (stopKeywords.some(k => upper.includes(k.toUpperCase()))) break;
      if (line.trim()) result.push(line.trim());
    }
  }
  return result;
}

function extractSkills(text) {
  const raw = extractSection(
    text,
    ['SKILLS', 'TECHNICAL SKILLS', 'CORE SKILLS', 'KEY SKILLS', 'TOOLS'],
    ['EXPERIENCE', 'EDUCATION', 'PROJECT', 'CERTIFICATION', 'ACHIEVEMENT', 'AWARD']
  );

  const skills = new Set();
  for (const line of raw) {
    // Split by common delimiters
    const parts = line.split(/[,|•·\-\t]+/);
    for (const part of parts) {
      const sk = part.trim().replace(/[•·\-\t]/g, '').trim();
      if (sk.length > 1 && sk.length < 50 && !/^\d+$/.test(sk)) {
        skills.add(sk);
      }
    }
  }
  return [...skills].slice(0, 20);
}

function extractEducation(text) {
  const raw = extractSection(
    text,
    ['EDUCATION', 'ACADEMIC', 'QUALIFICATION'],
    ['EXPERIENCE', 'PROJECT', 'SKILL', 'CERTIFICATION', 'ACHIEVEMENT']
  );

  const edu = [];
  let current = null;

  for (const line of raw) {
    // Detect degree/institution lines
    if (/bachelor|master|b\.?tech|m\.?tech|b\.?sc|m\.?sc|b\.?e|engineering|university|institute|college/i.test(line)) {
      if (current) edu.push(current);
      current = {
        institution: '',
        degree: '',
        branch: '',
        graduationYear: '',
        cgpa: ''
      };

      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) current.graduationYear = yearMatch[0];

      const cgpaMatch = line.match(/\b([0-9]\.[0-9]{1,2})\b/);
      if (cgpaMatch) current.cgpa = cgpaMatch[0];

      if (/university|institute|college/i.test(line)) {
        current.institution = line.trim();
      } else {
        current.degree = line.trim();
      }
    } else if (current) {
      if (!current.institution && line.length > 5) {
        current.institution = line.trim();
      } else if (!current.graduationYear) {
        const y = line.match(/\b(19|20)\d{2}\b/);
        if (y) current.graduationYear = y[0];
      }
    }
  }
  if (current) edu.push(current);

  return edu.slice(0, 3);
}

function extractProjects(text) {
  const raw = extractSection(
    text,
    ['PROJECT', 'PERSONAL PROJECT', 'ACADEMIC PROJECT'],
    ['CERTIFICATION', 'ACHIEVEMENT', 'AWARD', 'DECLARATION', 'REFERENCE', 'HOBBIES']
  );

  const projects = [];
  let current = null;

  for (const line of raw) {
    if (line.length > 5 && /[A-Z]/.test(line[0]) && !line.startsWith('•') && !line.startsWith('-')) {
      if (current) projects.push(current);
      current = { title: line, description: '', techStack: '', github: '', liveLink: '' };
    } else if (current) {
      const techMatch = line.match(/(?:tech|stack|tools?|built\s+with|using)[:\s]+([^\n]+)/i);
      if (techMatch) {
        current.techStack = techMatch[1].trim();
      } else if (extractGitHub(line)) {
        current.github = extractGitHub(line);
      } else if (!current.description && line.length > 10) {
        current.description = line.replace(/^[•\-\s]+/, '');
      }
    }
  }
  if (current) projects.push(current);

  return projects.slice(0, 5);
}

function extractCertifications(text) {
  const raw = extractSection(
    text,
    ['CERTIFICATION', 'COURSES', 'ONLINE COURSE', 'TRAINING'],
    ['ACHIEVEMENT', 'AWARD', 'DECLARATION', 'REFERENCE', 'HOBBIES', 'INTEREST']
  );

  return raw
    .filter(l => l.length > 5)
    .map(l => l.replace(/^[•\-\*\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 8);
}

// ─── API Route ─────────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = '';

    if (file.name.endsWith('.pdf')) {
      // Dynamically import pdf-parse (avoids ESM issues)
      const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
      const parsed = await pdfParse(buffer);
      text = parsed.text;
    } else {
      // For .doc/.docx — extract raw text (basic)
      text = buffer.toString('utf8').replace(/[^\x20-\x7E\n\r]/g, ' ');
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json({
        success: false,
        message: 'Could not extract text from this file. Please try a text-based PDF.'
      }, { status: 422 });
    }

    const lines = text.split('\n').filter(l => l.trim().length > 0);

    const extracted = {
      name: extractName(lines),
      email: extractEmail(text),
      phone: extractPhone(text),
      linkedin: extractLinkedIn(text),
      github: extractGitHub(text),
      skills: extractSkills(text),
      education: extractEducation(text),
      projects: extractProjects(text),
      certifications: extractCertifications(text),
    };

    return NextResponse.json({
      success: true,
      data: extracted,
      charCount: text.length
    });

  } catch (error) {
    console.error('[Resume Parse Error]', error.message);
    return NextResponse.json({
      success: false,
      message: 'Failed to parse resume: ' + error.message
    }, { status: 500 });
  }
}
