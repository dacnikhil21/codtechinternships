// setupDb.js - Runs on every server start
// Creates tables if they don't exist and seeds tasks
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please set it in Hostinger Environment Variables.');
  process.exit(1);
}

async function setup() {
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log('✅ Database connected.');

  // Create User table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS User (
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
  console.log('✅ User table ready.');

  // Create Task table
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS Task (
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
  console.log('✅ Task table ready.');

  // Seed tasks only if empty
  const [taskRows] = await conn.execute('SELECT COUNT(*) as count FROM Task');
  if (taskRows[0].count === 0) {
    console.log('🌱 Seeding tasks...');
    const tasks = [
      // React.js
      { title: 'Build a Personal Portfolio', description: 'Create a responsive portfolio website using React.js', domain: 'React.js Web Development Intern', batch: 1, level: 'Beginner' },
      { title: 'Build a Todo App with Context API', description: 'Implement a full CRUD todo application using React Context API', domain: 'React.js Web Development Intern', batch: 2, level: 'Intermediate' },
      { title: 'Create a Weather Dashboard', description: 'Fetch and display live weather data using an API', domain: 'React.js Web Development Intern', batch: 3, level: 'Intermediate' },
      { title: 'Build an E-Commerce Product Page', description: 'Create a product listing and cart with React state management', domain: 'React.js Web Development Intern', batch: 4, level: 'Advanced' },
      // MERN Stack
      { title: 'Build a REST API with Node.js', description: 'Create a complete RESTful API with Express and MongoDB', domain: 'Mern Stack Web Development Intern', batch: 1, level: 'Beginner' },
      { title: 'User Authentication System', description: 'Implement JWT-based authentication with login and registration', domain: 'Mern Stack Web Development Intern', batch: 2, level: 'Intermediate' },
      { title: 'Full Stack Blog Application', description: 'Build a complete blog with CRUD operations', domain: 'Mern Stack Web Development Intern', batch: 3, level: 'Intermediate' },
      { title: 'Real-Time Chat App', description: 'Create a real-time chat using Socket.io', domain: 'Mern Stack Web Development Intern', batch: 4, level: 'Advanced' },
      // Python
      { title: 'File Organizer Script', description: 'Write a Python script to automatically organize files by type', domain: 'Python Programming Intern', batch: 1, level: 'Beginner' },
      { title: 'Web Scraper', description: 'Build a web scraper using BeautifulSoup and Requests', domain: 'Python Programming Intern', batch: 2, level: 'Intermediate' },
      { title: 'Data Visualization Dashboard', description: 'Create interactive charts using Matplotlib and Pandas', domain: 'Python Programming Intern', batch: 3, level: 'Intermediate' },
      { title: 'Flask REST API', description: 'Build a REST API with Flask and SQLite', domain: 'Python Programming Intern', batch: 4, level: 'Advanced' },
      // Java
      { title: 'Console-Based Bank System', description: 'Build a banking application using OOP concepts', domain: 'Java Programming Intern', batch: 1, level: 'Beginner' },
      { title: 'Student Management System', description: 'Create a student record management system with file I/O', domain: 'Java Programming Intern', batch: 2, level: 'Intermediate' },
      { title: 'Java Spring Boot API', description: 'Build a REST API using Spring Boot', domain: 'Java Programming Intern', batch: 3, level: 'Intermediate' },
      { title: 'Library Management System', description: 'Design a complete library system using JDBC and MySQL', domain: 'Java Programming Intern', batch: 4, level: 'Advanced' },
      // Data Science
      { title: 'Exploratory Data Analysis', description: 'Perform EDA on a public dataset using Pandas', domain: 'Data Science Intern', batch: 1, level: 'Beginner' },
      { title: 'Linear Regression Model', description: 'Build and evaluate a linear regression model using Scikit-learn', domain: 'Data Science Intern', batch: 2, level: 'Intermediate' },
      { title: 'Classification Model', description: 'Train a classification model and measure accuracy', domain: 'Data Science Intern', batch: 3, level: 'Intermediate' },
      { title: 'ML Pipeline Project', description: 'Build a complete ML pipeline with preprocessing and model selection', domain: 'Data Science Intern', batch: 4, level: 'Advanced' },
      // Data Analytics
      { title: 'Sales Data Analysis', description: 'Analyze sales data and create visualizations', domain: 'Data Analytics Intern', batch: 1, level: 'Beginner' },
      { title: 'Power BI Dashboard', description: 'Create an interactive Power BI dashboard from raw data', domain: 'Data Analytics Intern', batch: 2, level: 'Intermediate' },
      { title: 'SQL Business Report', description: 'Write complex SQL queries to generate business reports', domain: 'Data Analytics Intern', batch: 3, level: 'Intermediate' },
      { title: 'Predictive Analytics Model', description: 'Build a forecasting model for business metrics', domain: 'Data Analytics Intern', batch: 4, level: 'Advanced' },
      // Digital Marketing
      { title: 'Social Media Strategy Report', description: 'Create a complete social media marketing plan', domain: 'Digital Marketing Intern', batch: 1, level: 'Beginner' },
      { title: 'SEO Audit Report', description: 'Conduct a full SEO audit for a website', domain: 'Digital Marketing Intern', batch: 2, level: 'Intermediate' },
      { title: 'Email Marketing Campaign', description: 'Design and write a full email marketing campaign', domain: 'Digital Marketing Intern', batch: 3, level: 'Intermediate' },
      { title: 'Google Ads Campaign Setup', description: 'Create and configure a Google Ads campaign', domain: 'Digital Marketing Intern', batch: 4, level: 'Advanced' },
      // UI/UX
      { title: 'Mobile App Wireframes', description: 'Design wireframes for a mobile app using Figma', domain: 'Ul/UX Intern', batch: 1, level: 'Beginner' },
      { title: 'Design System Creation', description: 'Build a reusable component design system in Figma', domain: 'Ul/UX Intern', batch: 2, level: 'Intermediate' },
      { title: 'User Research Report', description: 'Conduct user research and create personas', domain: 'Ul/UX Intern', batch: 3, level: 'Intermediate' },
      { title: 'Full App Prototype', description: 'Create a high-fidelity interactive prototype', domain: 'Ul/UX Intern', batch: 4, level: 'Advanced' },
    ];

    for (const task of tasks) {
      await conn.execute(
        'INSERT INTO Task (title, description, domain, batch, level, roadmap) VALUES (?, ?, ?, ?, ?, ?)',
        [task.title, task.description, task.domain, task.batch, task.level, '']
      );
    }
    console.log(`✅ Seeded ${tasks.length} tasks.`);
  } else {
    console.log(`✅ Tasks already seeded (${taskRows[0].count} tasks found).`);
  }

  await conn.end();
  console.log('🚀 Database setup complete.');
}

setup().catch((err) => {
  console.error('❌ Database setup failed:', err.message);
  console.log('⚠️ Server will continue to start, but database features will be disabled until DATABASE_URL is fixed.');
  // Removed process.exit(1) to prevent 503 errors on Hostinger
});
