import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const userDomains = [
      "React.js Web Development Intern",
      "MERN Stack Web Development Intern",
      ".NET / DotNet Web Development Intern",
      "Figma Web Development Intern",
      "Figma App Development Intern",
      "Full Stack Web Development Intern",
      "Frontend Web Development Intern",
      "Backend Web Development Intern",
      "C Programming",
      "C++ Programming",
      "Software Development",
      "Embedded Systems",
      "Digital Marketing",
      "App Development",
      "Java Programming",
      "Python Programming",
      "Data Analytics",
      "SQL",
      "DevOps",
      "Power BI",
      "Cloud Computing",
      "Blockchain Technology",
      "Software Testing",
      "Automation Testing",
      "Big Data",
      "Data Science",
      "UI/UX",
      "Machine Learning",
      "Artificial Intelligence",
      "Internet of Things (IoT)",
      "VLSI",
      "Cybersecurity & Ethical Hacking"
    ];

    const [allDomains] = await pool.execute('SELECT id, name FROM domains');
    
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const auditResults = [];

    for (const course of userDomains) {
      const userCourseNorm = normalize(course);
      
      let targetDomain = allDomains.find(d => normalize(d.name) === userCourseNorm);

      if (!targetDomain) {
        const overrides = {
          'aiml': 'artificialintelligence',
          'ai': 'artificialintelligence',
          'ml': 'machinelearning',
          'cybersec': 'cybersecurity',
          'ux': 'uiux',
          'softwaretesting': 'softwaretestingintern',
          'automationtesting': 'automationtestingintern',
          'figmaapp': 'figmaappdevelopmentintern',
          'figmaweb': 'figmawebdevelopmentintern',
          'fullstack': 'fullstackwebdevelopmentintern',
          'frontend': 'frontendwebdevelopmentintern',
          'backend': 'backendwebdevelopmentintern',
          'datascience': 'datascienceintern',
          'dotnet': 'dotnetwebdevelopmentintern'
        };
        for (const [key, val] of Object.entries(overrides)) {
          if (userCourseNorm.includes(key)) {
            targetDomain = allDomains.find(d => normalize(d.name).includes(val));
            if (targetDomain) break;
          }
        }
      }

      if (!targetDomain) {
        const coursePrefix = course.split(/[ /]/)[0].toLowerCase();
        if (coursePrefix.length > 2) {
          const sortedDomains = [...allDomains].sort((a, b) => b.name.length - a.name.length);
          targetDomain = sortedDomains.find(d => normalize(d.name).includes(normalize(coursePrefix)));
        }
      }

      if (!targetDomain) {
        auditResults.push({
          course,
          status: '⚠️ Missing Domain',
          details: 'Could not match this course to any domain in DB.'
        });
        continue;
      }

      // Check Projects
      const [projects] = await pool.execute('SELECT COUNT(*) as count FROM projects WHERE domain_id = ?', [targetDomain.id]);
      const projectCount = projects[0].count;

      // Check Curriculum
      const [modules] = await pool.execute('SELECT COUNT(*) as count FROM curriculum_modules WHERE domain_id = ?', [targetDomain.id]);
      const moduleCount = modules[0].count;

      // Check Prep
      const [prep] = await pool.execute('SELECT COUNT(*) as count FROM preparation WHERE domain_id = ?', [targetDomain.id]);
      const prepCount = prep[0].count;

      let status = '✅ Correct';
      let details = [];
      if (projectCount < 30) { status = '❌ Mismatch/Missing'; details.push(`Only ${projectCount} projects (expected 30).`); }
      if (moduleCount === 0) { status = '❌ Mismatch/Missing'; details.push(`No curriculum modules.`); }
      if (prepCount === 0) { status = '⚠️ Missing Content'; details.push(`No preparation content.`); }

      if (details.length === 0) details.push('All components fully populated and mapped.');

      auditResults.push({
        course,
        mappedDomain: targetDomain.name,
        projects: projectCount,
        curriculum: moduleCount,
        prep: prepCount,
        status,
        details: details.join(' ')
      });
    }

    return NextResponse.json({ success: true, auditResults });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
