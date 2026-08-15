// app/utils/skillSuggestions.js

/**
 * Mapping of internship domain names to comprehensive resume data.
 * Updated to support the new Zety-style builder with object structures.
 */
export const DOMAIN_DATA = {
  'React.js Web Development Intern': {
    skills: ['React.js', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux', 'REST APIs', 'Git/GitHub', 'Responsive Design', 'Next.js', 'TypeScript', 'Context API'],
    projectSuggestions: [
      {
        title: 'Ecommerce Storefront',
        description: 'Built a responsive ecommerce application with product filtering, cart management, and Stripe checkout integration. Optimized component rendering reducing load time by 30%.',
        techStack: 'React, Redux, Tailwind CSS, Stripe API',
        github: '',
        liveLink: ''
      },
      {
        title: 'Personal Portfolio Dashboard',
        description: 'Developed an interactive developer portfolio with dark mode, animations using Framer Motion, and a headless CMS integration for dynamic blog posts.',
        techStack: 'React.js, Next.js, Framer Motion',
        github: '',
        liveLink: ''
      },
      {
        title: 'Real-time Chat Application',
        description: 'Created a real-time messaging app supporting multiple rooms, typing indicators, and read receipts. Implemented secure user authentication.',
        techStack: 'React, Firebase, Socket.io',
        github: '',
        liveLink: ''
      }
    ],
    experienceBullets: [
      'Developed and maintained responsive user interfaces using React.js and Tailwind CSS.',
      'Collaborated with backend teams to integrate RESTful APIs and ensure seamless data flow.',
      'Optimized application performance by implementing code splitting and lazy loading.',
      'Participated in daily stand-ups and code reviews to ensure code quality and maintainability.',
      'Refactored legacy components to modern functional components with React Hooks.',
      'Resolved cross-browser compatibility issues and improved accessibility (a11y) scores.'
    ],
    summarySuggestions: [
      'Passionate Frontend Developer skilled in React.js, JavaScript, and responsive design, with strong problem-solving skills and a track record of building user-centric web applications.',
      'Detail-oriented React.js Developer with experience in building scalable UI components. Eager to leverage skills in modern JavaScript frameworks to deliver high-quality digital experiences.',
      'Results-driven web development intern specializing in the React ecosystem. Adept at translating Figma designs into pixel-perfect, high-performance web applications.'
    ]
  },
  'Python Programming Intern': {
    skills: ['Python', 'Django', 'Flask', 'Pandas', 'NumPy', 'REST APIs', 'SQL', 'Git', 'Data Structures', 'Automation Scripting'],
    projectSuggestions: [
      {
        title: 'Automated Web Scraper',
        description: 'Designed a Python script using BeautifulSoup and Selenium to extract e-commerce data, saving it into an SQLite database and scheduling daily runs via Cron.',
        techStack: 'Python, BeautifulSoup, Selenium, SQLite',
        github: '',
        liveLink: ''
      },
      {
        title: 'REST API for Blog Engine',
        description: 'Built a scalable RESTful backend using Django Rest Framework supporting CRUD operations, JWT authentication, and automated tests.',
        techStack: 'Python, Django, PostgreSQL, Docker',
        github: '',
        liveLink: ''
      },
      {
        title: 'Data Analysis Dashboard',
        description: 'Analyzed large datasets using Pandas and created an interactive web dashboard with Dash/Plotly to visualize sales trends.',
        techStack: 'Python, Pandas, Dash, Plotly',
        github: '',
        liveLink: ''
      }
    ],
    experienceBullets: [
      'Authored clean, maintainable, and efficient Python code for various backend services and automation tasks.',
      'Developed and tested RESTful APIs using Flask/Django frameworks.',
      'Wrote automation scripts that reduced manual data entry time by 40%.',
      'Optimized database queries and integrated PostgreSQL databases with Python backends.',
      'Collaborated with data scientists to deploy machine learning models into production.'
    ],
    summarySuggestions: [
      'Adaptable Python Developer with a strong foundation in backend frameworks and scripting. Eager to solve complex problems and automate workflows.',
      'Enthusiastic Python Programmer skilled in data manipulation and API development. Proven ability to quickly learn and apply new technologies.',
      'Motivated software engineering intern with expertise in Python and Django, focused on building scalable backend architectures and writing clean code.'
    ]
  },
  'Java Programming Intern': {
    skills: ['Java (Core & Advanced)', 'Spring Boot', 'Hibernate', 'MySQL', 'OOP Concepts', 'Data Structures', 'Maven', 'Git', 'JUnit'],
    projectSuggestions: [
      {
        title: 'Library Management System',
        description: 'Developed an enterprise-level inventory system supporting role-based access, book tracking, and penalty calculations using Spring Boot.',
        techStack: 'Java, Spring Boot, MySQL, Hibernate',
        github: '',
        liveLink: ''
      },
      {
        title: 'Online Examination Portal',
        description: 'Built a secure web application for conducting timed online tests with automated grading and detailed result analytics.',
        techStack: 'Java, Servlets, JSP, JDBC',
        github: '',
        liveLink: ''
      }
    ],
    experienceBullets: [
      'Designed and implemented robust backend services using Java and the Spring framework.',
      'Applied Object-Oriented Programming (OOP) principles to create scalable and modular application components.',
      'Wrote unit and integration tests using JUnit and Mockito to ensure 80%+ code coverage.',
      'Integrated Hibernate for efficient ORM and database management with MySQL.',
      'Participated in Agile sprints and contributed to software architecture discussions.'
    ],
    summarySuggestions: [
      'Solid Java Developer with a strong understanding of object-oriented principles and enterprise-level frameworks like Spring Boot. Dedicated to writing efficient, testable code.',
      'Aspiring Software Engineer specializing in Java backend development. Passionate about designing robust architectures and optimizing database interactions.',
      'Detail-oriented Java Programmer with experience in building secure, scalable applications and a deep understanding of Data Structures and Algorithms.'
    ]
  },
  'Data Analytics Intern': {
    skills: ['Python', 'SQL', 'Excel (Advanced)', 'Data Cleaning', 'Exploratory Data Analysis (EDA)', 'Pandas', 'Tableau', 'Power BI', 'Statistics'],
    projectSuggestions: [
      {
        title: 'Sales Performance Dashboard',
        description: 'Cleaned and analyzed 50K+ rows of sales data to create interactive Power BI dashboards, identifying a 15% revenue growth opportunity.',
        techStack: 'SQL, Power BI, Excel',
        github: '',
        liveLink: ''
      },
      {
        title: 'Customer Churn Prediction Analysis',
        description: 'Performed exploratory data analysis on telecom data using Python and Pandas to identify key factors leading to customer attrition.',
        techStack: 'Python, Pandas, Seaborn',
        github: '',
        liveLink: ''
      }
    ],
    experienceBullets: [
      'Extracted, cleaned, and analyzed complex datasets using SQL and Python to drive business decisions.',
      'Designed interactive dashboards in Power BI/Tableau that improved stakeholder visibility into key KPIs.',
      'Automated weekly reporting processes using Python scripts, saving 10+ hours of manual work per week.',
      'Identified data anomalies and ensured data integrity across multiple relational databases.',
      'Collaborated with marketing and sales teams to translate data findings into actionable strategies.'
    ],
    summarySuggestions: [
      'Analytical Data Analyst with a knack for transforming raw data into actionable business insights using Python, SQL, and data visualization tools.',
      'Detail-oriented Data Analytics intern passionate about uncovering trends and patterns in complex datasets to support data-driven decision making.',
      'Proactive data enthusiast skilled in statistical analysis and reporting. Dedicated to improving operational efficiency through rigorous data evaluation.'
    ]
  },
  'Ul/UX Intern': {
    skills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems', 'Responsive UI', 'Typography', 'Usability Testing'],
    projectSuggestions: [
      {
        title: 'Healthcare App Redesign',
        description: 'Conducted user research and completely redesigned a telehealth app interface, improving task completion rates by 25%. Created interactive prototypes in Figma.',
        techStack: 'Figma, Miro, User Testing',
        github: '',
        liveLink: ''
      },
      {
        title: 'E-commerce Design System',
        description: 'Built a comprehensive design system including typography, color palettes, and reusable components to ensure consistency across web and mobile platforms.',
        techStack: 'Figma, Adobe Illustrator',
        github: '',
        liveLink: ''
      }
    ],
    experienceBullets: [
      'Created wireframes, user flows, and high-fidelity prototypes using Figma for web and mobile applications.',
      'Conducted user research and usability testing sessions to gather feedback and iterate on designs.',
      'Collaborated closely with developers to ensure accurate implementation of UI components and design systems.',
      'Redesigned existing interfaces to improve accessibility and adhere to modern UX best practices.',
      'Maintained and expanded the internal design system, creating reusable components and design guidelines.'
    ],
    summarySuggestions: [
      'Creative UI/UX Designer passionate about user-centric design and building intuitive, accessible digital experiences. Proficient in Figma and rapid prototyping.',
      'Empathetic User Experience Designer focused on solving complex problems through elegant, simple interfaces. Strong background in user research and visual design.',
      'Detail-oriented UI Designer dedicated to bridging the gap between user needs and business goals through thoughtful, engaging digital products.'
    ]
  }
};

/**
 * Fallback values for generic or unrecognized domains
 */
const DEFAULT_DOMAIN_DATA = {
  skills: ['Problem Solving', 'Communication', 'Teamwork', 'Git', 'Critical Thinking', 'Project Management'],
  projectSuggestions: [
    {
      title: 'Academic Capstone Project',
      description: 'Led a team of 4 to deliver a comprehensive software solution addressing a specific industry problem. Managed timelines and project scope.',
      techStack: 'Various Tech',
      github: '',
      liveLink: ''
    }
  ],
  experienceBullets: [
    'Collaborated effectively within a cross-functional team to deliver project milestones on time.',
    'Conducted research and applied theoretical knowledge to practical, real-world problems.',
    'Communicated complex technical concepts clearly to both technical and non-technical stakeholders.',
    'Demonstrated strong problem-solving skills by identifying bottlenecks and proposing effective solutions.'
  ],
  summarySuggestions: [
    'Motivated student and aspiring professional eager to contribute to innovative projects and grow in the industry. Quick learner with a strong foundation in analytical problem solving.',
    'Dedicated intern seeking to leverage academic knowledge and strong work ethic in a professional environment. Committed to continuous learning and team success.',
    'Hardworking and detail-oriented individual passionate about applying technical skills to create meaningful impact and drive results.'
  ]
};

/**
 * Return data (skills, projects, summary) for a given domain.
 * If the domain is not recognized, returns default values.
 */
export function getDomainData(domain) {
  if (!domain) return DEFAULT_DOMAIN_DATA;
  
  const courseNorm = domain.toLowerCase().replace(/[^a-z0-9]/g, '');
  let bestMatchKey = null;

  for (const key of Object.keys(DOMAIN_DATA)) {
     const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
     if (keyNorm.includes(courseNorm) || courseNorm.includes(keyNorm)) {
        bestMatchKey = key; break;
     }
  }

  // Manual fallbacks
  if (!bestMatchKey) {
     if (courseNorm.includes('react') || courseNorm.includes('frontend') || courseNorm.includes('mern') || courseNorm.includes('web')) bestMatchKey = 'React.js Web Development Intern';
     else if (courseNorm.includes('java')) bestMatchKey = 'Java Programming Intern';
     else if (courseNorm.includes('python')) bestMatchKey = 'Python Programming Intern';
     else if (courseNorm.includes('data') || courseNorm.includes('ml') || courseNorm.includes('ai')) bestMatchKey = 'Data Analytics Intern';
     else if (courseNorm.includes('ui') || courseNorm.includes('ux') || courseNorm.includes('figma') || courseNorm.includes('design')) bestMatchKey = 'Ul/UX Intern';
  }

  return DOMAIN_DATA[bestMatchKey] || DEFAULT_DOMAIN_DATA;
}
