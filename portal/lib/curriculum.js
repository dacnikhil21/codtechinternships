export const CURRICULUM = {
  "JAVA PROGRAMMING": [
    {
      id: "j1",
      title: "Introduction to Java",
      description: "Getting started with the Java ecosystem and JDK installation.",
      time: "15 mins",
      difficulty: "Beginner",
      lessons: [
        { id: "l1", title: "History & Features", content: "Java was created by James Gosling..." },
        { id: "l2", title: "Setting up the Environment", content: "Download and install JDK 17..." }
      ]
    },
    {
      id: "j2",
      title: "Variables & Data Types",
      description: "Understanding how data is stored in Java applications.",
      time: "20 mins",
      difficulty: "Beginner",
      lessons: [
        { id: "l3", title: "Primitive Types", content: "int, double, float, boolean..." },
        { id: "l4", title: "Type Casting", content: "Implicit vs Explicit casting..." }
      ]
    },
    {
      id: "j3",
      title: "OOP Concepts",
      description: "The core pillars: Encapsulation, Inheritance, Polymorphism, Abstraction.",
      time: "45 mins",
      difficulty: "Intermediate",
      lessons: [
        { id: "l5", title: "Classes & Objects", content: "A class is a blueprint..." }
      ]
    }
  ],
  "PYTHON PROGRAMMING": [
    {
      id: "p1",
      title: "Python Basics",
      description: "Syntax, Indentation, and the Python interpreter.",
      time: "10 mins",
      difficulty: "Beginner",
      lessons: [
        { id: "l1", title: "Print & Input", content: "Using print() and input()..." }
      ]
    }
  ],
  "WEB DEVELOPMENT": [
    {
      id: "w1",
      title: "HTML5 Fundamentals",
      description: "Semantic HTML and document structure.",
      time: "15 mins",
      difficulty: "Beginner",
      lessons: [
        { id: "l1", title: "Tags & Elements", content: "Understanding <div>, <p>, and <a>..." }
      ]
    }
  ],
  "DATA SCIENCE": [
    {
      id: "ds1",
      title: "Intro to Data Science",
      description: "The data science lifecycle and toolsets.",
      time: "20 mins",
      difficulty: "Intermediate",
      lessons: []
    }
  ]
};

// Default modules for unknown domains
export const DEFAULT_MODULES = [
  {
    id: "gen1",
    title: "General Internship Orientation",
    description: "Welcome to your internship journey at Codtech.",
    time: "10 mins",
    difficulty: "Beginner",
    lessons: []
  }
];
