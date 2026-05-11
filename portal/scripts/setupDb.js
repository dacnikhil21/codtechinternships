// setupDb.js - Runs on every server start
// Creates tables if they don't exist and seeds tasks
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL is not set. Database features will be disabled.');
} else {
  setup().catch((err) => {
    console.error('❌ Database setup failed:', err.message);
  });
}

async function setup() {
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log('✅ Database connected.');

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

  await conn.end();
  console.log('🚀 Database setup complete.');
}



