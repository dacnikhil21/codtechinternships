import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { MASTER_PROJECTS } from '@/lib/masterProjects';

export async function GET() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return NextResponse.json({ success: false, message: 'DATABASE_URL is missing in environment variables.' });
  }

  try {
    const conn = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Debug Setup: Database connected.');

    // 1. Tables Creation
    await conn.execute(`CREATE TABLE IF NOT EXISTS domains (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, slug VARCHAR(255) NOT NULL UNIQUE, icon VARCHAR(50) DEFAULT 'terminal', description TEXT)`);
    await conn.execute(`CREATE TABLE IF NOT EXISTS projects (id INT AUTO_INCREMENT PRIMARY KEY, domain_id INT NOT NULL, name VARCHAR(255) NOT NULL, description TEXT, difficulty VARCHAR(50) DEFAULT 'Beginner', tech_stack VARCHAR(255), guide_link VARCHAR(255), submission_enabled BOOLEAN DEFAULT TRUE, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await conn.execute(`CREATE TABLE IF NOT EXISTS preparation (id INT AUTO_INCREMENT PRIMARY KEY, domain_id INT NOT NULL, title VARCHAR(255) NOT NULL, content TEXT, category VARCHAR(50), createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await conn.execute(`CREATE TABLE IF NOT EXISTS materials (id INT AUTO_INCREMENT PRIMARY KEY, domain_id INT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(50), link VARCHAR(255), createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await conn.execute(`CREATE TABLE IF NOT EXISTS mock_interviews (id INT AUTO_INCREMENT PRIMARY KEY, domain_id INT NOT NULL, question TEXT NOT NULL, answer TEXT, level VARCHAR(50), createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await conn.execute(`CREATE TABLE IF NOT EXISTS user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, course VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'student', xp INT NOT NULL DEFAULT 0, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);

    // 2. Seed 32 Domains
    const domains = [
      "React.js Web Development Intern", "Mern Stack Web Development Intern", ".Net Web Development Intern",
      "Figma Web Development Intern", "Figma App Development Intern", "Full Stack Web Development Intern",
      "Frontend Web Development Intern", "Backend Web Development Intern", "C,C++ programming Intern",
      "Software Development Intern", "Embedded Systems Intern", "Digital Marketing Intern",
      "App Development Intern", "Java Programming Intern", "Python Programming Intern",
      "Data Analytics Intern", "SQL Intern", "Devops Intern", "Power BI Intern",
      "Cloud Computing Intern", "Block Chain Technology Intern", "Software Testing Intern",
      "Automation Testing Intern", "Bigdata Intern", "Dot.Net Intern", "Data Science Intern",
      "Ul/UX Intern", "Machine Learning", "Artificial Intelligence", "Internet Of things", "VLSI",
      "Cybersecurity & Ethical Hacking"
    ];

    for (const d of domains) {
      const slug = d.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
      await conn.execute('INSERT IGNORE INTO domains (name, slug) VALUES (?, ?)', [d, slug]);
    }

    // 3. SEED MASTER PROJECT LIBRARY (960 PROJECTS)
    const [domainRows] = await conn.execute('SELECT id, name FROM domains');
    const report = {
      domainsProcessed: 0,
      projectsSeeded: 0,
      errors: []
    };
    
    for (const domain of domainRows) {
      const projects = MASTER_PROJECTS[domain.name];
      if (projects && projects.length > 0) {
        // Purge old placeholders/duplicates for this domain
        await conn.execute('DELETE FROM projects WHERE domain_id = ?', [domain.id]);
        
        for (const p of projects) {
          await conn.execute(
            'INSERT INTO projects (domain_id, name, description, difficulty, submission_enabled) VALUES (?, ?, ?, ?, 1)',
            [domain.id, p.name, p.description, p.difficulty]
          );
          report.projectsSeeded++;
        }
        report.domainsProcessed++;
      } else {
        report.errors.push(`No library data found for: ${domain.name}`);
      }
    }

    // 4. Admin Seeding
    const bcrypt = require('bcryptjs');
    const hashedAdminPassword = await bcrypt.hash('Admin123', 10);
    await conn.execute('INSERT IGNORE INTO user (name, email, password, course, role) VALUES (?, ?, ?, ?, ?)', ['System Admin', 'admin@test.com', hashedAdminPassword, 'Administration', 'admin']);

    await conn.end();
    return NextResponse.json({ 
      success: true, 
      message: '960-PROJECT MASTER LIBRARY SEEDED SUCCESSFULLY!',
      report: report
    });

  } catch (error) {
    console.error('DEBUG SETUP ERROR:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
