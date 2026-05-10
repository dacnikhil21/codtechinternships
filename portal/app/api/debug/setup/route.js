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

    // 1. Create 'user' table
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

    // 2. Create 'task' table
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

    // 3. Create 'user_projects' table (to store selected projects)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS user_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        taskId INT NOT NULL,
        status VARCHAR(50) DEFAULT 'selected',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY user_task (userId, taskId)
      )
    `);

    // 4. Seed Admin Account (admin@test.com / Admin123)
    const bcrypt = require('bcryptjs');
    const hashedAdminPassword = await bcrypt.hash('Admin123', 10);
    await conn.execute(
      'INSERT IGNORE INTO user (name, email, password, course, role) VALUES (?, ?, ?, ?, ?)',
      ['System Admin', 'admin@test.com', hashedAdminPassword, 'Administration', 'admin']
    );

    // 5. Seed initial tasks
    const [taskRows] = await conn.execute('SELECT COUNT(*) as count FROM task');
    if (taskRows[0].count === 0) {
      const tasks = [
        { title: 'Build a Personal Portfolio', description: 'Create a responsive portfolio website using React.js', domain: 'React.js Web Development Intern', batch: 1, level: 'Beginner' },
        { title: 'User Authentication System', description: 'Implement JWT-based authentication with login and registration', domain: 'Mern Stack Web Development Intern', batch: 2, level: 'Intermediate' },
        { title: 'Data Visualization Dashboard', description: 'Create interactive charts using Matplotlib and Pandas', domain: 'Python Programming Intern', batch: 3, level: 'Intermediate' },
        { title: 'E-Commerce Backend API', description: 'Develop a full REST API for an online store', domain: 'Java Programming Intern', batch: 4, level: 'Advanced' }
      ];

      for (const t of tasks) {
        await conn.execute(
          'INSERT INTO task (title, description, domain, batch, level, roadmap) VALUES (?, ?, ?, ?, ?, ?)',
          [t.title, t.description, t.domain, t.batch, t.level, '']
        );
      }
    }

    await conn.end();
    return NextResponse.json({ 
      success: true, 
      message: 'FULL DATABASE REBUILT SUCCESSFULLY!',
      tablesCreated: ['user', 'task', 'user_projects'],
      adminAccount: 'admin@test.com / Admin123',
      action: 'You can now log in or register new students.'
    });

  } catch (error) {
    console.error('DEBUG SETUP ERROR:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
