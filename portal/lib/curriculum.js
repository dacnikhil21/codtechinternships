export const CURRICULUM = {
  "JAVA PROGRAMMING": [
    {
      id:"j1", title:"Introduction to Java", description:"History, features, JDK/JRE/JVM setup and your first Java program.", time:"20 mins", difficulty:"Beginner",
      lessons:[
        { 
          id:"j1l1", 
          title:"History & Platform Independence", 
          explanation: "Java was created by James Gosling in 1995 with a revolutionary goal: 'Write Once, Run Anywhere'. Unlike other languages that need to be rewritten for every OS, Java code runs on a 'Virtual Machine' (JVM), making it perfectly portable across Windows, Mac, and Linux.",
          example: "// No setup needed to understand this concept!\n// Think of JVM as a universal translator.",
          summary: "Java is an Object-Oriented, platform-independent language that powers everything from Android apps to enterprise servers.",
          practiceTask: "Research why 'strongly typed' languages like Java are safer for large-scale applications."
        },
        { 
          id:"j1l2", 
          title:"Your First Java Program", 
          explanation: "Every Java program is built inside a 'Class'. The entry point—where the computer starts reading—is always the 'main' method. Think of the class as a house and the main method as the front door.",
          example: "public class HelloWorld {\n  public static void main(String[] args) {\n    System.out.println(\"Hello, Intern!\");\n  }\n}",
          summary: "Classes wrap your code, and the main() method launches it.",
          practiceTask: "Try writing a program that prints your name and your Intern ID."
        },
      ]
    },
    {
      id:"j2", title:"Variables & Data Types", description:"Primitive types, type casting, and variable scope.", time:"25 mins", difficulty:"Beginner",
      lessons:[
        { id:"j2l1", title:"Primitive Data Types", content:"Java has 8 primitive types:\n\nbyte   — 1 byte  (-128 to 127)\nshort  — 2 bytes\nint    — 4 bytes  (most common)\nlong   — 8 bytes  (append L: 100L)\nfloat  — 4 bytes  (append f: 3.14f)\ndouble — 8 bytes  (default decimal)\nchar   — 2 bytes  (single character: 'A')\nboolean — true/false\n\nExample:\nint age = 25;\ndouble salary = 75000.50;\nchar grade = 'A';\nboolean isActive = true;", keyPoints:["int is the default for integers","double is the default for decimals","char uses single quotes","String is NOT a primitive — it's a class"] },
        { id:"j2l2", title:"Type Casting", content:"Converting one data type to another.\n\nWidening (automatic — no data loss):\nint x = 10;\ndouble y = x; // OK\n\nNarrowing (manual — possible data loss):\ndouble pi = 3.14;\nint approx = (int) pi; // approx = 3\n\nString Conversion:\nString s = String.valueOf(42);\nint n = Integer.parseInt(\"42\");", keyPoints:["Widening = smaller to larger type","Narrowing requires explicit cast","Use wrapper classes for String conversion","parseInt(), parseDouble() for parsing"] },
      ]
    },
    {
      id:"j3", title:"OOP Concepts", description:"Classes, Objects, Inheritance, Polymorphism, Encapsulation, Abstraction.", time:"45 mins", difficulty:"Intermediate",
      lessons:[
        { id:"j3l1", title:"Classes & Objects", content:"A class is a blueprint. An object is an instance.\n\nclass Student {\n  String name;\n  int age;\n\n  void display() {\n    System.out.println(name + \" is \" + age);\n  }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Student s = new Student();\n    s.name = \"Alice\";\n    s.age = 20;\n    s.display();\n  }\n}", keyPoints:["new keyword creates an object","Dot (.) accesses members","Constructor initializes an object","this keyword refers to current object"] },
        { id:"j3l2", title:"Inheritance & Polymorphism", content:"Inheritance: Child class extends Parent class.\n\nclass Animal {\n  void sound() { System.out.println(\"Some sound\"); }\n}\n\nclass Dog extends Animal {\n  @Override\n  void sound() { System.out.println(\"Woof!\"); }\n}\n\nPolymorphism:\nAnimal a = new Dog();\na.sound(); // prints: Woof!\n\nTypes:\n• Compile-time (Method Overloading)\n• Runtime (Method Overriding)", keyPoints:["extends keyword for inheritance","@Override annotation for overriding","Java supports single inheritance","super keyword calls parent methods"] },
      ]
    },
    {
      id:"j4", title:"Collections Framework", description:"List, Set, Map and their implementations.", time:"35 mins", difficulty:"Intermediate",
      lessons:[
        { id:"j4l1", title:"ArrayList & LinkedList", content:"ArrayList: Dynamic array, fast random access.\nLinkedList: Doubly-linked, fast insert/delete.\n\nArrayList<String> list = new ArrayList<>();\nlist.add(\"Java\");\nlist.add(\"Python\");\nlist.remove(0);\nSystem.out.println(list.size());\n\nIteration:\nfor(String item : list) {\n  System.out.println(item);\n}", keyPoints:["ArrayList is backed by array","LinkedList uses nodes","Both implement List interface","Collections.sort() sorts lists"] },
        { id:"j4l2", title:"HashMap & HashSet", content:"HashMap: Key-value pairs, O(1) average lookup.\nHashSet: Unique elements only.\n\nHashMap<String, Integer> map = new HashMap<>();\nmap.put(\"Alice\", 90);\nmap.put(\"Bob\", 85);\nSystem.out.println(map.get(\"Alice\")); // 90\n\nfor(Map.Entry<String, Integer> e : map.entrySet()) {\n  System.out.println(e.getKey() + \": \" + e.getValue());\n}", keyPoints:["HashMap allows one null key","HashSet rejects duplicates","LinkedHashMap maintains insertion order","TreeMap sorts by key"] },
      ]
    },
    {
      id:"j5", title:"Exception Handling", description:"try-catch-finally, custom exceptions, checked vs unchecked.", time:"25 mins", difficulty:"Intermediate",
      lessons:[
        { id:"j5l1", title:"try-catch-finally", content:"Exception handling prevents program crashes.\n\ntry {\n  int result = 10 / 0; // ArithmeticException\n} catch(ArithmeticException e) {\n  System.out.println(\"Error: \" + e.getMessage());\n} finally {\n  System.out.println(\"Always runs\");\n}\n\nMultiple catch:\ntry {\n  String s = null;\n  s.length();\n} catch(NullPointerException e) {\n  System.out.println(\"Null reference!\");\n} catch(Exception e) {\n  System.out.println(\"Generic error\");\n}", keyPoints:["finally always executes","Catch specific exceptions first","throws keyword declares checked exceptions","throw keyword raises an exception"] },
      ]
    },
    {
      id:"j6", title:"Spring Boot Basics", description:"REST APIs, dependency injection, and Spring Boot auto-configuration.", time:"50 mins", difficulty:"Advanced",
      lessons:[
        { id:"j6l1", title:"Your First REST API", content:"Spring Boot makes building REST APIs simple.\n\n@RestController\n@RequestMapping(\"/api\")\npublic class HelloController {\n\n  @GetMapping(\"/hello\")\n  public String hello() {\n    return \"Hello from Spring Boot!\";\n  }\n\n  @PostMapping(\"/users\")\n  public User createUser(@RequestBody User user) {\n    return userService.save(user);\n  }\n}\n\nKey Annotations:\n@SpringBootApplication — marks main class\n@RestController — handles HTTP requests\n@GetMapping — maps GET requests\n@PostMapping — maps POST requests\n@RequestBody — parses JSON body", keyPoints:["application.properties configures the app","Default port is 8080","@Autowired injects dependencies","Spring Data JPA handles database operations"] },
      ]
    },
  ],

  "PYTHON PROGRAMMING": [
    {
      id:"p1", title:"Python Basics", description:"Syntax, variables, input/output and control flow.", time:"20 mins", difficulty:"Beginner",
      lessons:[
        { 
          id:"p1l1", 
          title:"The Zen of Python", 
          explanation: "Python was designed by Guido van Rossum with a simple philosophy: 'Readability counts'. It uses indentation instead of curly braces, making it look almost like plain English. It's the most beginner-friendly language because it focuses on *what* you want to do, not complex syntax.",
          example: "# Python is clean and elegant\ndef greet(name):\n    print(f\"Hello, {name}! Welcome to CodTech.\")\n\ngreet(\"Intern\")",
          summary: "Python is a high-level, interpreted language that prioritizes human-readable code and rapid development.",
          practiceTask: "Open a terminal and run 'import this' to see the 19 principles of Python's design."
        },
        { id:"p1l2", title:"Control Flow", content:"if-elif-else and loops.\n\n# If-elif-else\nscore = 85\nif score >= 90:\n    print(\"A\")\nelif score >= 80:\n    print(\"B\")\nelse:\n    print(\"C\")\n\n# for loop\nfor i in range(5):\n    print(i)  # 0,1,2,3,4\n\n# while loop\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\n\n# List comprehension\nsquares = [x**2 for x in range(10)]", keyPoints:["range(start, stop, step)","break exits loop, continue skips iteration","List comprehensions are Pythonic","Indentation defines code blocks"] },
      ]
    },
    {
      id:"p2", title:"Functions & Modules", description:"Defining functions, args, kwargs, decorators and imports.", time:"25 mins", difficulty:"Beginner",
      lessons:[
        { id:"p2l1", title:"Functions", content:"def greet(name, greeting=\"Hello\"):\n    return f\"{greeting}, {name}!\"\n\nprint(greet(\"Alice\"))         # Hello, Alice!\nprint(greet(\"Bob\", \"Hi\"))     # Hi, Bob!\n\n# *args and **kwargs\ndef total(*numbers):\n    return sum(numbers)\n\nprint(total(1, 2, 3, 4))  # 10\n\n# Lambda\nsquare = lambda x: x ** 2\nprint(square(5))  # 25\n\n# Map and Filter\nnums = [1, 2, 3, 4, 5]\nevens = list(filter(lambda x: x % 2 == 0, nums))", keyPoints:["Default args must come after required args","*args collects positional args as tuple","**kwargs collects keyword args as dict","Lambda is a single-expression anonymous function"] },
      ]
    },
    {
      id:"p3", title:"OOP in Python", description:"Classes, inheritance, dunder methods and properties.", time:"35 mins", difficulty:"Intermediate",
      lessons:[
        { id:"p3l1", title:"Classes & Objects", content:"class Student:\n    school = \"CodTech\"  # class variable\n\n    def __init__(self, name, age):\n        self.name = name  # instance variable\n        self.age = age\n\n    def display(self):\n        return f\"{self.name} ({self.age})\"\n\n    def __str__(self):\n        return self.display()\n\n    def __repr__(self):\n        return f\"Student('{self.name}', {self.age})\"\n\ns = Student(\"Alice\", 20)\nprint(s)  # Alice (20)", keyPoints:["__init__ is the constructor","self refers to the current instance","__str__ defines print() behavior","@property creates getters/setters"] },
      ]
    },
    {
      id:"p4", title:"NumPy & Pandas", description:"Array operations, DataFrames, and data analysis.", time:"40 mins", difficulty:"Intermediate",
      lessons:[
        { id:"p4l1", title:"NumPy Arrays", content:"import numpy as np\n\n# Create arrays\narr = np.array([1, 2, 3, 4, 5])\nmatrix = np.zeros((3, 3))\nidentity = np.eye(3)\n\n# Operations\nprint(arr * 2)      # [2 4 6 8 10]\nprint(arr.mean())   # 3.0\nprint(arr.std())    # std deviation\n\n# Slicing\nprint(arr[1:4])     # [2 3 4]\n\n# Shape manipulation\nreshaped = arr.reshape(1, 5)", keyPoints:["NumPy arrays are faster than Python lists","Broadcasting applies operations element-wise","axis=0 operates on columns, axis=1 on rows","np.linspace() creates evenly spaced arrays"] },
        { id:"p4l2", title:"Pandas DataFrames", content:"import pandas as pd\n\ndf = pd.DataFrame({\n    'Name': ['Alice', 'Bob', 'Charlie'],\n    'Score': [90, 85, 92],\n    'Grade': ['A', 'B', 'A']\n})\n\n# Exploration\nprint(df.head())\nprint(df.describe())\nprint(df.dtypes)\n\n# Filtering\nhigh = df[df['Score'] > 88]\n\n# Grouping\navg = df.groupby('Grade')['Score'].mean()\n\n# Read CSV\ndf = pd.read_csv('data.csv')", keyPoints:["df.shape gives (rows, cols)","df.isnull().sum() finds missing values","df.dropna() removes nulls","df.merge() joins DataFrames"] },
      ]
    },
    {
      id:"p5", title:"REST APIs with Flask", description:"Build and consume REST APIs using Flask.", time:"40 mins", difficulty:"Advanced",
      lessons:[
        { id:"p5l1", title:"Building a Flask API", content:"from flask import Flask, request, jsonify\n\napp = Flask(__name__)\n\nusers = []\n\n@app.route('/users', methods=['GET'])\ndef get_users():\n    return jsonify(users)\n\n@app.route('/users', methods=['POST'])\ndef create_user():\n    data = request.get_json()\n    users.append(data)\n    return jsonify(data), 201\n\n@app.route('/users/<int:id>', methods=['DELETE'])\ndef delete_user(id):\n    users.pop(id)\n    return jsonify({'message': 'Deleted'})\n\nif __name__ == '__main__':\n    app.run(debug=True)", keyPoints:["@app.route() maps URLs to functions","request.get_json() parses JSON body","jsonify() converts dict to JSON response","Status codes: 200=OK, 201=Created, 404=Not Found"] },
      ]
    },
  ],

  "WEB DEVELOPMENT": [
    {
      id:"w1", title:"HTML5 Fundamentals", description:"Semantic HTML, forms, and document structure.", time:"20 mins", difficulty:"Beginner",
      lessons:[
        { id:"w1l1", title:"Semantic HTML", content:"Semantic tags describe meaning, not appearance.\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>My Page</title>\n</head>\n<body>\n  <header>\n    <nav>\n      <a href=\"/\">Home</a>\n      <a href=\"/about\">About</a>\n    </nav>\n  </header>\n  <main>\n    <article>\n      <h1>Main Heading</h1>\n      <p>Content here...</p>\n    </article>\n    <aside>Sidebar</aside>\n  </main>\n  <footer>Footer content</footer>\n</body>\n</html>", keyPoints:["Use <header>, <nav>, <main>, <footer>","h1 should be unique per page","alt attribute on images is mandatory","<section> groups related content"] },
      ]
    },
    {
      id:"w2", title:"CSS3 & Flexbox", description:"Selectors, box model, flexbox and responsive design.", time:"30 mins", difficulty:"Beginner",
      lessons:[
        { id:"w2l1", title:"Flexbox Layout", content:"Flexbox makes alignment simple.\n\n.container {\n  display: flex;\n  flex-direction: row;     /* or column */\n  justify-content: center; /* horizontal */\n  align-items: center;     /* vertical */\n  gap: 16px;\n  flex-wrap: wrap;\n}\n\n.item {\n  flex: 1;           /* grow equally */\n  flex: 0 0 200px;   /* fixed 200px */\n}\n\n/* Responsive */\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}", keyPoints:["Parent gets display:flex","justify-content for main axis","align-items for cross axis","flex-wrap prevents overflow"] },
      ]
    },
    {
      id:"w3", title:"JavaScript ES6+", description:"Modern JS: arrow functions, promises, async/await.", time:"40 mins", difficulty:"Intermediate",
      lessons:[
        { id:"w3l1", title:"ES6 Features", content:"const name = 'Alice';\nconst age = 20;\n\n// Template literals\nconsole.log(`Hello ${name}, you are ${age}`);\n\n// Destructuring\nconst { x, y } = { x: 1, y: 2 };\nconst [first, ...rest] = [1, 2, 3, 4];\n\n// Arrow functions\nconst square = x => x * x;\nconst add = (a, b) => a + b;\n\n// Spread operator\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5];\n\n// Optional chaining\nconst city = user?.address?.city ?? 'Unknown';", keyPoints:["const/let replace var","Arrow functions inherit this from parent","Destructuring simplifies extraction","?? is nullish coalescing (not ||)"] },
        { id:"w3l2", title:"Async/Await & Fetch", content:"// Fetch API\nasync function getUsers() {\n  try {\n    const response = await fetch('/api/users');\n    if (!response.ok) throw new Error('Failed');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error(error);\n  }\n}\n\n// POST request\nasync function createUser(user) {\n  const res = await fetch('/api/users', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(user)\n  });\n  return res.json();\n}", keyPoints:["async functions return Promises","await pauses until Promise resolves","Always wrap in try/catch","response.ok checks 2xx status"] },
      ]
    },
    {
      id:"w4", title:"React Fundamentals", description:"Components, props, state, hooks and lifecycle.", time:"50 mins", difficulty:"Intermediate",
      lessons:[
        { 
          id:"w4l1", 
          title:"Components & Hooks", 
          explanation: "In React, everything is a 'Component'—a reusable piece of UI. 'Hooks' like useState allow these components to 'remember' things, like how many times a button was clicked. It's like giving your UI a memory.",
          example: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}",
          summary: "Components are building blocks, and Hooks manage their internal state.",
          practiceTask: "Create a simple component that toggles between 'ON' and 'OFF' when clicked."
        },
      ]
    },
  ],

  "DATA SCIENCE": [
    {
      id:"ds1", title:"Data Analysis Foundations", description:"Statistics, data types, and exploratory data analysis.", time:"30 mins", difficulty:"Beginner",
      lessons:[
        { 
          id:"p4l1", 
          title:"Pandas DataFrames", 
          explanation: "In Data Science, a 'DataFrame' is just a fancy table—like an Excel sheet inside your code. Pandas allows you to slice, dice, and analyze thousands of rows of data with just a single line of code.",
          example: "import pandas as pd\n\n# Creating a simple dataset\ndata = {\"Name\": [\"Alice\", \"Bob\"], \"Score\": [95, 88]}\ndf = pd.DataFrame(data)\n\nprint(df.describe()) # Instant math summary!",
          summary: "Pandas DataFrames are the industry standard for handling and cleaning structured data.",
          practiceTask: "Try loading a small CSV file and printing the first 5 rows using df.head()."
        },
      ]
    },
    {
      id:"ds2", title:"Data Visualization", description:"Matplotlib and Seaborn for insights.", time:"35 mins", difficulty:"Beginner",
      lessons:[
        { id:"ds2l1", title:"Matplotlib & Seaborn", content:"import matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Line chart\nplt.plot([1,2,3,4], [10,20,15,25])\nplt.title('Trend')\nplt.xlabel('Month')\nplt.ylabel('Value')\nplt.show()\n\n# Bar chart\nsns.barplot(data=df, x='category', y='sales')\n\n# Heatmap (correlation)\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')\n\n# Histogram\nsns.histplot(df['age'], bins=20, kde=True)\n\n# Scatter\nsns.scatterplot(data=df, x='experience', y='salary', hue='department')", keyPoints:["Seaborn is built on Matplotlib","kde=True adds smooth density curve","hue adds a color grouping dimension","plt.savefig() saves charts to file"] },
      ]
    },
  ],

  "ARTIFICIAL INTELLIGENCE": [
    {
      id:"ai1", title:"ML Foundations", description:"Supervised vs unsupervised learning, training and evaluation.", time:"30 mins", difficulty:"Intermediate",
      lessons:[
        { id:"ai1l1", title:"Supervised Learning", content:"from sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# Split data\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\n# Train model\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\n\n# Evaluate\ny_pred = model.predict(X_test)\nprint(f'Accuracy: {accuracy_score(y_test, y_pred):.2f}')\nprint(classification_report(y_test, y_pred))", keyPoints:["Always split data before training","random_state ensures reproducibility","Accuracy alone is misleading — check precision/recall","Normalize features for better performance"] },
      ]
    },
  ],

  "CYBER SECURITY": [
    {
      id:"cs1", title:"Security Fundamentals", description:"CIA triad, threats, attacks and defense strategies.", time:"25 mins", difficulty:"Beginner",
      lessons:[
        { id:"cs1l1", title:"CIA Triad & Common Attacks", content:"The CIA Triad is the foundation of cybersecurity:\n\n1. CONFIDENTIALITY — Only authorized users access data\n   • Encryption (AES-256, RSA)\n   • Access control lists\n   • Multi-factor authentication\n\n2. INTEGRITY — Data is accurate and unaltered\n   • Hashing (SHA-256, MD5)\n   • Digital signatures\n   • Checksums\n\n3. AVAILABILITY — Systems are accessible when needed\n   • DDoS protection\n   • Redundancy & backups\n   • Load balancing\n\nCommon Attacks:\n• SQL Injection — malicious SQL in input fields\n• XSS — injecting scripts into web pages\n• MITM — intercepting communications\n• Phishing — social engineering via fake emails\n• Brute Force — trying all password combinations", keyPoints:["Never store passwords in plain text — use bcrypt","HTTPS encrypts data in transit","Input validation prevents injection attacks","Principle of least privilege limits damage from breaches"] },
      ]
    },
  ],

  "CLOUD COMPUTING": [
    {
      id:"cc1", title:"Cloud Fundamentals", description:"IaaS, PaaS, SaaS, deployment models and AWS basics.", time:"25 mins", difficulty:"Beginner",
      lessons:[
        { id:"cc1l1", title:"Cloud Service Models", content:"CLOUD SERVICE MODELS:\n\n1. IaaS (Infrastructure as a Service)\n   • You manage: OS, middleware, apps, data\n   • Provider manages: servers, storage, networking\n   • Examples: AWS EC2, Azure VMs, Google Compute Engine\n\n2. PaaS (Platform as a Service)\n   • You manage: applications and data only\n   • Provider manages: OS, runtime, middleware\n   • Examples: Heroku, Google App Engine, AWS Elastic Beanstalk\n\n3. SaaS (Software as a Service)\n   • You manage: nothing (just use the software)\n   • Examples: Gmail, Salesforce, Dropbox\n\nDEPLOYMENT MODELS:\n• Public Cloud — shared infrastructure (AWS, GCP, Azure)\n• Private Cloud — dedicated to one organization\n• Hybrid Cloud — mix of public and private\n• Multi-Cloud — multiple cloud providers", keyPoints:["EC2 = Elastic Compute Cloud (virtual machines)","S3 = Simple Storage Service (object storage)","RDS = Relational Database Service","Lambda = serverless functions (pay per execution)"] },
      ]
    },
  ],
};

export const DEFAULT_MODULES = [
  {
    id:"gen1", title:"Internship Orientation", description:"Welcome to your internship at CodTech. Learn the platform, workflow, and expectations.", time:"10 mins", difficulty:"Beginner",
    lessons:[
      { id:"gen1l1", title:"Welcome to CodTech", content:"Welcome to CodTech IT Solutions internship program!\n\nYour internship journey:\n1. Complete 4 domain-specific projects\n2. Submit each via GitHub\n3. Attend orientation sessions\n4. Build your professional portfolio\n\nTools you'll need:\n• GitHub account (free)\n• VS Code (recommended editor)\n• Domain-specific SDK/runtime\n• CodTech intern portal (you're here!)\n\nSuccess tips:\n• Start projects early\n• Document your code thoroughly\n• Include your Intern ID in all submissions\n• Reach out via WhatsApp group for doubts", keyPoints:["4 projects required for certification","GitHub repo must be public","README must include InternID","Deadline is end of internship period"] },
    ]
  }
];
