import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    return NextResponse.json({ success: false, message: 'DATABASE_URL is missing in environment variables.' });
  }

  try {
    const conn = await mysql.createConnection(DATABASE_URL);
    console.log('✅ Debug Setup: Database connected.');

    // 1. Create 'domains' table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS domains (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        icon VARCHAR(50) DEFAULT 'terminal',
        description TEXT
      )
    `);

    // 2. Create 'projects' table (Superior version of 'task')
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        domain_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        difficulty VARCHAR(50) DEFAULT 'Beginner',
        tech_stack VARCHAR(255),
        guide_link VARCHAR(255),
        submission_enabled BOOLEAN DEFAULT TRUE,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Create 'preparation' table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS preparation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        domain_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        category VARCHAR(50),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Create 'materials' table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS materials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        domain_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50),
        link VARCHAR(255),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Create 'mock_interviews' table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS mock_interviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        domain_id INT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT,
        level VARCHAR(50),
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Existing Tables (Keeping for stability)
    await conn.execute(`CREATE TABLE IF NOT EXISTS user (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, course VARCHAR(255) NOT NULL, role VARCHAR(50) NOT NULL DEFAULT 'student', xp INT NOT NULL DEFAULT 0, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
    await conn.execute(`CREATE TABLE IF NOT EXISTS task (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, domain VARCHAR(255) NOT NULL, batch INT NOT NULL DEFAULT 1, level VARCHAR(50) NOT NULL DEFAULT 'Beginner', roadmap TEXT, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await conn.execute(`CREATE TABLE IF NOT EXISTS user_projects (id INT AUTO_INCREMENT PRIMARY KEY, userId INT NOT NULL, taskId INT NOT NULL, status VARCHAR(50) DEFAULT 'selected', createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY user_task (userId, taskId))`);

    // 7. Seed 32 Domains
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

    // 8. Master Seeder: Generate 30 Projects per Domain (Placeholder Loop)
    const [domainRows] = await conn.execute('SELECT id, name FROM domains');
    for (const domain of domainRows) {
      const [existing] = await conn.execute('SELECT COUNT(*) as count FROM projects WHERE domain_id = ?', [domain.id]);
      if (existing[0].count === 0) {
        console.log(`Seeding projects for: ${domain.name}`);
        for (let i = 1; i <= 30; i++) {
          await conn.execute(
            'INSERT INTO projects (domain_id, name, description, difficulty) VALUES (?, ?, ?, ?)',
            [domain.id, `${domain.name} Project ${i}`, `Master ${domain.name} skills with this hands-on project module ${i}.`, i <= 10 ? 'Beginner' : i <= 20 ? 'Intermediate' : 'Advanced']
          );
        }
      }
    }

    // 9. Seed Admin
    const bcrypt = require('bcryptjs');
    const hashedAdminPassword = await bcrypt.hash('Admin123', 10);
    await conn.execute('INSERT IGNORE INTO user (name, email, password, course, role) VALUES (?, ?, ?, ?, ?)', ['System Admin', 'admin@test.com', hashedAdminPassword, 'Administration', 'admin']);

    await conn.end();
    return NextResponse.json({ 
      success: true, 
      message: '32-DOMAIN ARCHITECTURE REBUILT SUCCESSFULLY!',
      domainsCreated: domains.length,
      totalProjectsSeeded: domains.length * 30,
      adminAccount: 'admin@test.com / Admin123',
      action: 'All systems are now database-driven. You can visit /api/debug/setup to refresh anytime.'
    });

  } catch (error) {
    console.error('DEBUG SETUP ERROR:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
