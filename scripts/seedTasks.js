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
  console.log('Seeding tasks to MySQL...');
  
  // Clear existing tasks
  await prisma.task.deleteMany({});

  const tasks = DOMAINS.map(domain => ({
    title: `Starter Project: ${domain}`,
    description: `Welcome to your ${domain} internship. Your first task is to set up your environment and build a basic hello-world application using the core concepts of this track.`,
    domain: domain,
    level: 'Beginner',
    batch: 1,
    points: 10
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
