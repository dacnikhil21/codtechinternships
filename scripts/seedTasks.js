import mongoose from 'mongoose';
import Task from '../models/Task.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/internship_portal";

const DOMAINS = [
  "React.js Web Development Intern", "Mern Stack Web Development Intern", ".Net Web Development Intern",
  "Figma Web Development Intern", "Figma App Development Intern", "Full Stack Web Development Intern",
  "Frontend Web Development Intern", "Backend Web Development Intern", "C,C++ programming Intern",
  "Software Development Intern", "Embedded Systems Intern", "Digital Marketing Intern",
  "App Development Intern", "Java Programming Intern", "Python Programming Intern",
  "Data Analytics Intern", "SQL Intern", "Devops Intern", "Power BI Intern",
  "Cloud Computing Intern", "Block Chain Technology Intern", "Software Testing Intern",
  "Automation Testing Intern", "Bigdata Intern", "Big Data", "Data Science Intern", "Data Science",
  "Ul/UX Intern", "UI/UX", "ML, AI & IoT", "Machine Language", "Artificial Intelligence", "Internet Of things",
  "VLSI", "Cybersecurity & Ethical Hacking"
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing tasks to avoid duplicates during development
    await Task.deleteMany({});

    const tasks = DOMAINS.map(domain => ({
      title: `Getting Started with ${domain}`,
      description: `Complete the environment setup and follow the initial orientation guide for ${domain}. Submit your setup confirmation screenshot.`,
      domain: domain,
      level: 'Beginner',
      batch: 1,
      points: 100
    }));

    await Task.insertMany(tasks);
    console.log(`Successfully seeded ${tasks.length} starter tasks!`);
    process.exit();
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
}

seed();
