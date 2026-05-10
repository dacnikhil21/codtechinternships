import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DOMAINS = [
  "React.js Web Development Intern", "Mern Stack Web Development Intern", ".Net Web Development Intern",
  "Figma Web Development Intern", "Figma App Development Intern", "Full Stack Web Development Intern",
  "Frontend Web Development Intern", "Backend Web Development Intern", "C,C++ programming Intern",
  "Software Development Intern", "Embedded Systems Intern", "Digital Marketing Intern",
  "App Development Intern", "Java Programming Intern", "Python Programming Intern",
  "Data Analytics Intern", "SQL Intern", "Devops Intern", "Power BI Intern",
  "Cloud Computing Intern", "Block Chain Technology Intern", "Software Testing Intern",
  "Automation Testing Intern", "Bigdata Intern", "Dot.Net Intern", "Data Science Intern",
  "Ul/UX Intern", "Machine Language", "Artificial Intelligence", "Internet Of things",
  "VLSI", "Cybersecurity & Ethical Hacking"
];

async function seed() {
  console.log('Seeding 32 tasks to Hostinger MySQL...');
  
  // Clear existing tasks to avoid duplicates
  await prisma.task.deleteMany({});

  const tasks = DOMAINS.map(domain => ({
    title: `Project: ${domain} (Week 1)`,
    description: `Complete the initial setup and core features of a ${domain} application.`,
    domain: domain,
    level: 'Beginner',
    batch: 1,
    points: 10,
    roadmap: `Step 1: Set up the development environment.\nStep 2: Initialize the project folder.\nStep 3: Create the basic UI components.\nStep 4: Implement core logic.\nStep 5: Submit the GitHub repository link.`
  }));

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log(`Successfully seeded ${tasks.length} tasks!`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
