// app/utils/skillSuggestions.js

/**
 * Mapping of internship domain names to comprehensive resume data.
 * Each domain contains:
 * - skills: Array of relevant technical skills.
 * - projects: Array of specific project ideas.
 * - summary: A professional summary tailored for a fresher.
 */
export const DOMAIN_DATA = {
  // WEB & APP DEVELOPMENT
  'React.js Web Development Intern': {
    skills: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'REST APIs', 'Git/GitHub', 'Responsive Design'],
    projects: ['Personal Portfolio Website', 'Weather Dashboard using OpenWeather API', 'E-commerce Product Page', 'Real-time Chat Application'],
    summary: 'Aspiring React.js Developer with a strong foundation in building responsive and interactive web applications. Proficient in modern JavaScript and CSS frameworks.'
  },
  'Mern Stack Web Development Intern': {
    skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JavaScript', 'JWT Authentication', 'Mongoose', 'RESTful APIs', 'Postman'],
    projects: ['Full-stack Task Manager', 'Social Media API', 'Online Book Store', 'Inventory Management System'],
    summary: 'Passionate MERN Stack Developer interested in building scalable full-stack applications. Experienced in developing both frontend and backend components.'
  },
  'Full Stack Web Development Intern': {
    skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Node.js', 'SQL/NoSQL Databases', 'Git', 'API Integration', 'Cloud Deployment'],
    projects: ['Full-stack Blog Platform', 'Community Forum Application', 'Service Marketplace', 'Collaborative Whiteboard'],
    summary: 'Versatile Full Stack Developer intern focused on creating seamless user experiences and robust backend logic.'
  },
  'Frontend Web Development Intern': {
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'SASS', 'Version Control (Git)', 'Responsive Design', 'Web Accessibility'],
    projects: ['Interactive Dashboard UI', 'Landing Page Optimization', 'CSS Animation Gallery', 'Multi-step Form Component'],
    summary: 'Creative Frontend Developer intern dedicated to crafting visually stunning and highly functional user interfaces.'
  },
  'Backend Web Development Intern': {
    skills: ['Node.js', 'Express.js', 'Python/Django', 'SQL (PostgreSQL/MySQL)', 'NoSQL (MongoDB)', 'REST APIs', 'Authentication', 'Docker'],
    projects: ['Authentication Microservice', 'E-commerce API Engine', 'Real-time Notification System', 'Database Schema Design'],
    summary: 'Focused Backend Developer intern with expertise in server-side logic, database management, and API development.'
  },
  'App Development Intern': {
    skills: ['React Native', 'Flutter', 'Dart', 'Java/Kotlin', 'Mobile UI Patterns', 'Firebase Integration', 'App Store Deployment'],
    projects: ['Fitness Tracking App', 'Local Food Delivery App UI', 'Budget Planner Mobile App', 'Quiz Application'],
    summary: 'Dedicated Mobile App Developer intern passionate about creating intuitive and high-performance cross-platform applications.'
  },

  // DATA, AI & ANALYTICS
  'Data Analytics Intern': {
    skills: ['Python', 'SQL', 'Excel (Advanced)', 'Data Cleaning', 'Exploratory Data Analysis (EDA)', 'Pandas/NumPy', 'Matplotlib/Seaborn'],
    projects: ['Sales Data Analysis Dashboard', 'Customer Segmentation Analysis', 'Stock Market Trend Visualization', 'Hospital Readmission Prediction'],
    summary: 'Analytical Data Analyst intern with a knack for transforming raw data into actionable business insights using Python and SQL.'
  },
  'Data Science Intern': {
    skills: ['Python', 'R', 'Machine Learning', 'Statistics', 'Scikit-learn', 'TensorFlow', 'Data Wrangling', 'Big Data Technologies'],
    projects: ['Sentiment Analysis on Twitter Data', 'Housing Price Prediction Model', 'Iris Flow Classification', 'Recommendation Engine'],
    summary: 'Aspiring Data Scientist with a deep interest in statistical modeling and machine learning algorithms to solve complex problems.'
  },
  'Machine Learning': {
    skills: ['Python', 'Supervised/Unsupervised Learning', 'Deep Learning', 'Neural Networks', 'Keras', 'NLP', 'Computer Vision'],
    projects: ['Image Recognition System', 'Spam Email Detection', 'Handwritten Digit Classifier', 'Chatbot using NLP'],
    summary: 'Machine Learning enthusiast focused on developing intelligent models and leveraging data-driven solutions.'
  },
  'Artificial Intelligence': {
    skills: ['Python', 'Neural Networks', 'Natural Language Processing', 'Generative AI', 'Algorithms', 'Logic Programming'],
    projects: ['AI-driven Game Bot', 'Language Translation Tool', 'Face Detection App', 'Autonomous Navigation Simulation'],
    summary: 'AI Intern passionate about the future of automation and building intelligent systems that mimic human cognition.'
  },
  'Power BI Intern': {
    skills: ['Power BI Desktop', 'DAX Queries', 'Power Query', 'Data Modeling', 'SQL', 'Dashboard Design', 'Data Visualization'],
    projects: ['Financial Performance Dashboard', 'HR Analytics Report', 'Supply Chain Visibility Tool', 'Marketing ROI Tracker'],
    summary: 'Proficient Power BI Intern skilled in creating dynamic reports and dashboards to visualize complex datasets.'
  },
  'SQL Intern': {
    skills: ['SQL (MySQL/PostgreSQL)', 'Database Design', 'Stored Procedures', 'Joins & Subqueries', 'Query Optimization', 'ETL Processes'],
    projects: ['Library Management Database', 'Employee Payroll System', 'Customer Order Tracking Database', 'Inventory Audit Logs'],
    summary: 'Detail-oriented SQL Intern with a strong focus on database architecture, query efficiency, and data integrity.'
  },

  // LANGUAGES & CORE SOFTWARE
  'Java Programming Intern': {
    skills: ['Java (Core & Advanced)', 'Spring Boot', 'Hibernate', 'OOP Concepts', 'Data Structures & Algorithms', 'Maven', 'MySQL'],
    projects: ['Bank Management System', 'Online Examination Portal', 'Inventory System using Spring', 'Library Management App'],
    summary: 'Solid Java Developer intern with a strong understanding of object-oriented principles and enterprise-level frameworks.'
  },
  'Python Programming Intern': {
    skills: ['Python', 'Django', 'Flask', 'OOP', 'Data Structures', 'Scripting', 'Automation', 'Unit Testing'],
    projects: ['Web Scraper Tool', 'File Organizer Script', 'Personal Finance Tracker', 'Portfolio Website with Django'],
    summary: 'Adaptable Python Developer intern experienced in web development, scripting, and building clean, modular code.'
  },
  'Software Development Intern': {
    skills: ['C/C++', 'Java', 'Data Structures', 'Algorithms', 'SDLC', 'Object-Oriented Design', 'Git', 'Problem Solving'],
    projects: ['Operating System Simulator', 'Compiler Construction', 'Pathfinding Algorithm Visualizer', 'Socket Programming App'],
    summary: 'Problem-solving Software Developer intern with a robust foundation in computer science fundamentals and algorithm design.'
  },
  'C,C++ programming Intern': {
    skills: ['C', 'C++', 'Memory Management', 'Pointers', 'STL', 'Algorithms', 'Data Structures', 'Embedded C'],
    projects: ['Sudoku Solver', 'File Encryption Utility', 'Graphics Library Implementation', 'Simple Game Engine'],
    summary: 'Technical C/C++ Developer intern focused on low-level programming, optimization, and system efficiency.'
  },

  // DESIGN & MARKETING
  'Ul/UX Intern': {
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Responsive UI', 'Typography'],
    projects: ['E-learning App Redesign', 'Healthcare Dashboard UI', 'E-commerce Mobile App Prototype', 'Personal Branding Identity'],
    summary: 'Creative UI/UX Designer intern passionate about user-centric design and building intuitive digital experiences.'
  },
  'Digital Marketing Intern': {
    skills: ['SEO/SEM', 'Social Media Marketing', 'Google Analytics', 'Content Strategy', 'Email Marketing', 'Copywriting', 'Ad Campaigns'],
    projects: ['Social Media Growth Campaign', 'SEO Audit Report', 'Brand Awareness Strategy', 'Email Newsletter Series'],
    summary: 'Result-oriented Digital Marketer intern focused on driving engagement and growing brand presence through strategic online campaigns.'
  },

  // INFRASTRUCTURE & SPECIALIZATIONS
  'Devops Intern': {
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS/Azure', 'Terraform', 'CI/CD Pipelines', 'Linux Administration', 'Monitoring Tools'],
    projects: ['Automated Deployment Pipeline', 'Infrastructure as Code (IaC) Setup', 'Containerized Web App', 'Server Monitoring Dashboard'],
    summary: 'Efficiency-driven DevOps Intern focused on streamlining software delivery and managing cloud infrastructure.'
  },
  'Cybersecurity & Ethical Hacking': {
    skills: ['Network Security', 'Vulnerability Assessment', 'Penetration Testing', 'Cryptography', 'Linux', 'Security Auditing', 'Firewalls'],
    projects: ['Network Vulnerability Scan', 'Secure Login System', 'Encryption/Decryption Tool', 'Security Audit Report'],
    summary: 'Security-conscious Cyber Intern dedicated to identifying vulnerabilities and protecting digital assets.'
  },
  'Cloud Computing Intern': {
    skills: ['AWS (EC2, S3, RDS)', 'Microsoft Azure', 'Google Cloud Platform', 'Serverless Architecture', 'Cloud Security', 'Networking'],
    projects: ['Cloud-native File Storage', 'Auto-scaling Web Cluster', 'Serverless API Backend', 'Hybrid Cloud Setup'],
    summary: 'Cloud Computing intern interested in architecting scalable and reliable solutions in the cloud.'
  },
  'Internet Of things': {
    skills: ['Arduino', 'Raspberry Pi', 'Sensors & Actuators', 'MQTT Protocol', 'C/C++', 'Python', 'Embedded Systems'],
    projects: ['Smart Home Automation System', 'IoT-based Weather Station', 'Asset Tracking System', 'Smart Irrigation System'],
    summary: 'Innovative IoT Intern focused on connecting the physical world with digital systems through smart devices.'
  },
  'Software Testing Intern': {
    skills: ['Manual Testing', 'SDLC', 'Test Cases', 'Bug Reporting', 'STLC', 'Regression Testing', 'Quality Assurance'],
    projects: ['E-commerce Test Plan', 'Mobile App Quality Audit', 'Cross-browser Testing Report', 'Usability Testing Study'],
    summary: 'Detail-oriented QA Intern committed to ensuring software quality through rigorous testing methodologies.'
  },
  'Automation Testing Intern': {
    skills: ['Selenium', 'Java/Python', 'TestNG', 'Cypress', 'API Testing (Postman)', 'Maven', 'Cucumber/BDD'],
    projects: ['Automated Regression Suite', 'Load Testing Script', 'API Automation Framework', 'UI Test Automation for Web'],
    summary: 'Technical Automation Tester intern skilled in building robust test frameworks to improve software reliability.'
  }
};

/**
 * Return data (skills, projects, summary) for a given domain.
 * If the domain is not recognized, returns default values.
 */
export function getSkillsForDomain(domain) {
  return DOMAIN_DATA[domain] || {
    skills: ['Problem Solving', 'Communication', 'Teamwork', 'Git', 'Critical Thinking'],
    projects: ['Personal Project 1', 'Industry Case Study', 'Academic Capstone'],
    summary: 'Motivated student and aspiring professional eager to contribute to innovative projects and grow in the industry.'
  };
}
