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

    // 8. INTELLIGENT FUZZY MIGRATION & SEEDER
    const [domainRows] = await conn.execute('SELECT id, name FROM domains');
    const [allTasks] = await conn.execute('SELECT DISTINCT domain FROM task');
    
    const report = {
      matched: [],
      unmatched: allTasks.map(t => t.domain),
      migratedCount: 0,
      skippedDuplicates: 0,
      placeholdersReplaced: 0
    };

    const fuzzyMatch = (oldName, newName) => {
      const n1 = oldName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const n2 = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (n1 === n2) return true;
      // Handle common abbreviations
      if ((n1 === 'aiml' || n1 === 'ai') && n2.includes('artificialintelligence')) return true;
      if (n1.includes('react') && n2.includes('reactjs')) return true;
      if (n1.includes('cybersec') && n2.includes('cybersecurity')) return true;
      if (n1.includes('javafs') && n2.includes('java')) return true;
      if (n1.includes('frontend') && n2.includes('frontend')) return true;
      return n1.includes(n2) || n2.includes(n1);
    };

    for (const domain of domainRows) {
      // 1. Find matching tasks from the old 'task' table
      const matchingOldDomains = allTasks.filter(t => fuzzyMatch(t.domain, domain.name));
      
      if (matchingOldDomains.length > 0) {
        report.matched.push(`${matchingOldDomains.map(d => d.domain).join(', ')} → ${domain.name}`);
        
        // Remove from unmatched list
        matchingOldDomains.forEach(od => {
          const idx = report.unmatched.indexOf(od.domain);
          if (idx > -1) report.unmatched.splice(idx, 1);
        });

        // 2. Fetch real tasks for these matched domains
        for (const oldDomainObj of matchingOldDomains) {
          const oldDomainName = oldDomainObj.domain;
          const [realTasks] = await conn.execute('SELECT title, description, level FROM task WHERE domain = ?', [oldDomainName]);
          
          // Check if we should replace placeholders
          const [currentProjects] = await conn.execute('SELECT name FROM projects WHERE domain_id = ? LIMIT 1', [domain.id]);
          const isPlaceholder = currentProjects.length > 0 && currentProjects[0].name.includes(' Project ');

          if (currentProjects.length === 0 || isPlaceholder) {
            if (isPlaceholder) {
              await conn.execute('DELETE FROM projects WHERE domain_id = ?', [domain.id]);
              report.placeholdersReplaced++;
            }

            for (const task of realTasks) {
              // Duplicate check (by name)
              const [dup] = await conn.execute('SELECT id FROM projects WHERE domain_id = ? AND name = ?', [domain.id, task.title]);
              if (dup.length === 0) {
                await conn.execute(
                  'INSERT INTO projects (domain_id, name, description, difficulty) VALUES (?, ?, ?, ?)',
                  [domain.id, task.title, task.description, task.level]
                );
                report.migratedCount++;
              } else {
                report.skippedDuplicates++;
              }
            }
          }
        }
      } else {
        // 3. Fallback to placeholders ONLY if no real tasks were ever found for this domain
        const [existing] = await conn.execute('SELECT COUNT(*) as count FROM projects WHERE domain_id = ?', [domain.id]);
        if (existing[0].count === 0) {
          for (let i = 1; i <= 30; i++) {
            await conn.execute(
              'INSERT INTO projects (domain_id, name, description, difficulty) VALUES (?, ?, ?, ?)',
              [domain.id, `${domain.name} Project ${i}`, `Master ${domain.name} skills with this hands-on project module ${i}.`, i <= 10 ? 'Beginner' : i <= 20 ? 'Intermediate' : 'Advanced']
            );
          }
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
      message: 'INTELLIGENT FUZZY MIGRATION COMPLETE!',
      migrationReport: report,
      action: 'Your real projects have been restored and mapped to the new domain system.'
    });

  } catch (error) {
    console.error('DEBUG SETUP ERROR:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
