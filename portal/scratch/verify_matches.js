
const allDomains = [
  { id: 1, name: "Artificial Intelligence" },
  { id: 2, name: "Machine Learning" },
  { id: 3, name: "Cybersecurity & Ethical Hacking" },
  { id: 4, name: "Frontend Web Development Intern" },
  { id: 5, name: "React.js Web Development Intern" },
  { id: 6, name: "Mern Stack Web Development Intern" },
  { id: 7, name: "Java Programming Intern" },
  { id: 8, name: "Python Programming Intern" },
  { id: 9, name: "Embedded Systems Intern" },
  { id: 10, name: "Devops Intern" },
  { id: 11, name: "Full Stack Web Development Intern" },
  { id: 12, name: "Data Science Intern" },
  { id: 13, name: "SQL Intern" },
  { id: 14, name: ".Net Web Development Intern" },
  { id: 15, name: "Figma Web Development Intern" },
  { id: 16, name: "UI/UX Intern" },
  { id: 17, name: "Cloud Computing Intern" },
  { id: 18, name: "Power BI Intern" },
  { id: 19, name: "Block Chain Technology Intern" },
  { id: 20, name: "Software Testing Intern" },
  { id: 21, name: "Bigdata Intern" },
  { id: 22, name: "Software Development Intern" },
  { id: 23, name: "Backend Web Development Intern" },
  { id: 24, name: "App Development Intern" },
  { id: 25, name: "Automation Testing Intern" },
  { id: 26, name: "Data Analytics Intern" },
  { id: 27, name: "Dot.Net Intern" },
  { id: 28, name: "Internet Of things" },
  { id: 29, name: "VLSI" },
  { id: 30, name: "Digital Marketing Intern" },
  { id: 31, name: "Figma App Development Intern" },
  { id: 32, name: "Mern Stack Intern" }
];

function matchDomain(courseName) {
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const userCourseNorm = normalize(courseName);
    
    // 1. Try Exact Match
    let targetDomain = allDomains.find(d => normalize(d.name) === userCourseNorm);

    // 2. Intelligent Overrides & Substring Match
    if (!targetDomain) {
      const overrides = {
        'aiml': 'artificialintelligence',
        'ai': 'artificialintelligence',
        'ml': 'machinelearning',
        'cybersec': 'cybersecurity',
        'ux': 'uiux',
        'softwaretesting': 'softwaretestingintern',
        'automationtesting': 'automationtestingintern',
        'figmaapp': 'figmaappdevelopmentintern',
        'figmaweb': 'figmawebdevelopmentintern',
        'fullstack': 'fullstackwebdevelopmentintern',
        'frontend': 'frontendwebdevelopmentintern',
        'backend': 'backendwebdevelopmentintern',
        'datascience': 'datascienceintern'
      };
      
      // Check for direct override match
      for (const [key, val] of Object.entries(overrides)) {
        if (userCourseNorm.includes(key)) {
          targetDomain = allDomains.find(d => normalize(d.name).includes(val));
          if (targetDomain) break;
        }
      }
    }

    // 3. Last resort: Partial match but prioritize longer domain names to avoid broad matches
    if (!targetDomain) {
      const coursePrefix = courseName.split(/[ /]/)[0].toLowerCase();
      if (coursePrefix.length > 2) {
        // Sort domains by length descending to match most specific first
        const sortedDomains = [...allDomains].sort((a, b) => b.name.length - a.name.length);
        targetDomain = sortedDomains.find(d => normalize(d.name).includes(normalize(coursePrefix)));
      }
    }
    
    return targetDomain ? targetDomain.name : "NO MATCH";
}

const testCases = [
    "React.js Web Development",
    "MERN Stack",
    "Python",
    "Java",
    "Software Development",
    "Automation Testing",
    "Software Testing",
    "Figma App Development",
    "Figma Web Development",
    "Cybersecurity",
    "AI/ML",
    "UI/UX Design",
    "Data Science",
    "Data Analytics",
    "Cloud Computing",
    "Power BI",
    "Full Stack",
    "Frontend",
    "Backend"
];

console.log("--- DOMAIN MATCHING AUDIT ---");
testCases.forEach(tc => {
    console.log(`Input: "${tc.padEnd(25)}" -> Match: ${matchDomain(tc)}`);
});
