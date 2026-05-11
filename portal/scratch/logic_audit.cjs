const domains = [
  "React.js Web Development Intern", "Mern Stack Web Development Intern", ".Net Web Development Intern",
  "Figma Web Development Intern", "Figma App Development Intern", "Full Stack Web Development Intern",
  "Frontend Web Development Intern", "Backend Web Development Intern", "C,C++ programming Intern",
  "Software Development Intern", "Embedded Systems Intern", "Digital Marketing Intern",
  "App Development Intern", "Java Programming Intern", "Python Programming Intern",
  "Data Analytics Intern", "SQL Intern", "Devops Intern", "Power BI Intern",
  "Cloud Computing Intern", "Block Chain Technology Intern", "Software Testing Intern",
  "Automation Testing Intern", "Bigdata Intern", "Dot.Net Intern", "Data Science Intern",
  "UI/UX Intern", "Machine Learning", "Artificial Intelligence", "Internet Of things", "VLSI",
  "Cybersecurity & Ethical Hacking"
];

// Mock normalization function from app/api/tasks/route.js
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

const overrides = {
  'aiml': 'artificialintelligence',
  'ai': 'artificialintelligence',
  'ml': 'machinelearning',
  'cybersec': 'cybersecurity',
  'ux': 'uiux'
};

function testMatch(userCourse) {
  const userCourseNorm = normalize(userCourse);
  
  // 1. Direct Normalized Match
  let targetDomain = domains.find(d => normalize(d) === userCourseNorm);

  // 2. Overrides
  if (!targetDomain) {
    const overrideKey = userCourseNorm;
    if (overrides[overrideKey]) {
      targetDomain = domains.find(d => normalize(d).includes(overrides[overrideKey]));
    }
  }

  // 3. Partial Match
  if (!targetDomain) {
    const coursePrefix = userCourse.split(/[ /]/)[0];
    targetDomain = domains.find(d => normalize(d).includes(normalize(coursePrefix)));
  }

  return targetDomain || 'NO_MATCH';
}

console.log('--- Domain Matching Logic Audit ---');

const testCases = [
  "React.js Web Development Intern",
  "Python Programming",
  "AI/ML",
  "Cybersecurity",
  "UI/UX",
  "Frontend",
  "Backend",
  "Java",
  "MERN Stack",
  "Software Development",
  "App Development",
  "Data Science",
  "Cloud Computing"
];

testCases.forEach(tc => {
  const result = testMatch(tc);
  console.log(`Input: [${tc.padEnd(25)}] -> Matched: [${result}]`);
});
