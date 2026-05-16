// setupDb.js - Runs on every server start
// Creates tables if they don't exist and seeds tasks
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

setup().catch((err) => {
  console.error('❌ Database setup failed:', err.message);
});

async function setup() {
  let conn;
  try {
    if (DATABASE_URL) {
      conn = await mysql.createConnection(DATABASE_URL);
    } else {
      conn = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'u371402898_ctadmin',
        password: 'Codtech2002',
        database: 'u371402898_ctintern'
      });
    }
    console.log('✅ Database connected.');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }

  // Create user table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      course VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'student',
      xp INT NOT NULL DEFAULT 0,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ user table ready.');
 
  // Create task table (Legacy)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS task (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      domain VARCHAR(255) NOT NULL,
      batch INT NOT NULL DEFAULT 1,
      level VARCHAR(50) NOT NULL DEFAULT 'Beginner',
      roadmap TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ task table ready.');

  // Create domains table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS domains (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    )
  `);
  console.log('✅ domains table ready.');

  // Create projects table (Main)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      domain_id INT,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      difficulty VARCHAR(50),
      FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ projects table ready.');

  // Seed domains and projects if empty
  const [domainRows] = await conn.execute('SELECT COUNT(*) as count FROM domains');
  if (domainRows[0].count === 0) {
    console.log('🌱 Seeding domains and projects library (960 projects)...');
    
    // Dynamically import the master project library
    const { MASTER_PROJECTS } = await import('../lib/masterProjects.js');
    
    for (const domainName in MASTER_PROJECTS) {
      const [domainResult] = await conn.execute(
        'INSERT INTO domains (name) VALUES (?)',
        [domainName]
      );
      const domainId = domainResult.insertId;

      const projects = MASTER_PROJECTS[domainName];
      for (const project of projects) {
        await conn.execute(
          'INSERT INTO projects (domain_id, name, description, difficulty) VALUES (?, ?, ?, ?)',
          [domainId, project.name, project.description, project.difficulty]
        );
      }
    }
    console.log('✅ Master projects library seeded successfully.');
  } else {
    console.log(`✅ Project library already seeded (${domainRows[0].count} domains found).`);
  }

  // Seed legacy tasks if empty (optional, for backward compatibility)
  const [taskRows] = await conn.execute('SELECT COUNT(*) as count FROM task');
  if (taskRows[0].count === 0) {
    console.log('🌱 Seeding legacy tasks...');
    const legacyTasks = [
      { title: 'Build a Personal Portfolio', description: 'Create a responsive portfolio website using React.js', domain: 'React.js Web Development Intern', batch: 1, level: 'Beginner' },
      // ... (rest of legacy tasks can be added here or omitted if not needed)
    ];
    // For brevity, we'll only seed a few or skip if domains/projects are the primary focus
  }

  // Create preparation table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS preparation (
      id INT AUTO_INCREMENT PRIMARY KEY,
      domain_id INT,
      category VARCHAR(100) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content TEXT,
      level VARCHAR(50) DEFAULT 'Beginner',
      FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ preparation table ready.');

  // Seed preparation if empty
  const [prepRows] = await conn.execute('SELECT COUNT(*) as count FROM preparation');
  if (prepRows[0].count === 0) {
    console.log('🌱 Seeding preparation materials...');
    const { MASTER_PREP } = await import('../lib/masterPrep.js');
    
    for (const domainName in MASTER_PREP) {
      // Find domain id (assuming domains are already seeded)
      const [domainResult] = await conn.execute('SELECT id FROM domains WHERE name = ?', [domainName]);
      if (domainResult.length > 0) {
        const domainId = domainResult[0].id;
        const preps = MASTER_PREP[domainName];
        for (const prep of preps) {
          await conn.execute(
            'INSERT INTO preparation (domain_id, category, title, description, content, level) VALUES (?, ?, ?, ?, ?, ?)',
            [domainId, prep.category, prep.title, prep.description, prep.content, prep.level]
          );
        }
      }
    }
    console.log('✅ Preparation materials seeded.');
  }

  // Create curriculum modules table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS curriculum_modules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      domain_id INT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      time_estimate VARCHAR(50),
      difficulty VARCHAR(50),
      order_index INT DEFAULT 0,
      FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ curriculum_modules table ready.');

  // Create curriculum lessons table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS curriculum_lessons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      module_id INT,
      title VARCHAR(255) NOT NULL,
      content LONGTEXT,
      key_points JSON,
      order_index INT DEFAULT 0,
      FOREIGN KEY (module_id) REFERENCES curriculum_modules(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ curriculum_lessons table ready.');

  // Create support_requests table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS support_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      internId VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'Pending',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ support_requests table ready.');

  await conn.end();
  console.log('🚀 Database setup complete.');
}



