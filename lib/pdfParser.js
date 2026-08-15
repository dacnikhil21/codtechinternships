export function parsePdfTextToCurriculum(rawText) {
  // 1. Clean and chunk lines
  const lines = rawText.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 5 && !l.includes('CODTECH') && !l.includes('Hyderabad') && !l.toLowerCase().includes('page '));

  const paragraphs = [];
  let currentPara = [];
  
  for (const line of lines) {
    // If line is short and doesn't end with punctuation, it's likely a heading
    if (line.length < 80 && !line.match(/[.,:;?!]$/) && currentPara.length > 0) {
      paragraphs.push(currentPara.join(' '));
      currentPara = [line];
    } else {
      currentPara.push(line);
    }
  }
  if (currentPara.length > 0) paragraphs.push(currentPara.join(' '));

  // 2. Identify Modules and Lessons
  const modules = [];
  let currentModule = null;
  let currentLesson = null;

  for (const para of paragraphs) {
    // Match something like "1. Introduction" or "Module 1:"
    if ((/^(Module\s+\d+|[1-9]\d*[\.\)])/i.test(para) || para.toUpperCase() === para) && para.length < 100) {
      if (currentModule && currentModule.lessons.length > 0) modules.push(currentModule);
      
      let cleanTitle = para.replace(/^(Module\s+\d+|[1-9]\d*[\.\)])\s*/i, '').trim();
      if (cleanTitle.length < 5) cleanTitle = para; // Fallback
      if (cleanTitle === cleanTitle.toUpperCase()) {
        cleanTitle = cleanTitle.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
      }

      currentModule = {
        title: cleanTitle.substring(0, 60),
        description: `Comprehensive study material covering ${cleanTitle}.`,
        lessons: []
      };
      currentLesson = null;
      continue;
    }

    // Match Lesson Heading (short line, no period)
    if (para.length < 80 && !para.match(/[.!?]$/)) {
      if (!currentModule) {
        currentModule = { title: "Course Fundamentals", description: "Core concepts and principles.", lessons: [] };
      }
      
      let lessonTitle = para.trim();
      if (lessonTitle === lessonTitle.toUpperCase()) {
        lessonTitle = lessonTitle.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
      }

      currentLesson = {
        title: lessonTitle,
        rawContent: [],
      };
      currentModule.lessons.push(currentLesson);
      continue;
    }

    // Content paragraph
    if (currentLesson) {
      currentLesson.rawContent.push(para);
    } else if (currentModule) {
      if (currentModule.lessons.length === 0) {
        currentLesson = { title: "Introduction & Overview", rawContent: [para] };
        currentModule.lessons.push(currentLesson);
      } else {
        currentModule.lessons[currentModule.lessons.length - 1].rawContent.push(para);
      }
    } else {
      currentModule = { title: "Core Concepts", description: "Foundation knowledge.", lessons: [] };
      currentLesson = { title: "Understanding the Basics", rawContent: [para] };
      currentModule.lessons.push(currentLesson);
    }
  }
  
  if (currentModule && currentModule.lessons.length > 0) modules.push(currentModule);

  // 3. Transform Content into Student-Friendly Structured JSON
  for (const mod of modules) {
    for (const les of mod.lessons) {
      const fullText = les.rawContent.join(' ');
      const sentences = fullText.split(/(?<=\.)\s+/).filter(s => s.length > 10);
      
      const simpleExplanation = sentences.slice(0, Math.min(3, sentences.length)).join(' ') || `This section covers the fundamental concepts of ${les.title}. Understanding this is key to mastering the domain.`;
      
      const whyItMatters = [
        "Provides a robust foundation for advanced topics.",
        "Improves system design and code maintainability.",
        "Frequently asked in technical interviews."
      ];
      
      const summary = sentences.length > 3 ? sentences.slice(-2).join(' ') : "Mastering this concept will significantly improve your technical execution.";
      
      // Store as a JSON string so the frontend can parse it into rich UI components
      les.content = JSON.stringify({
        simpleExplanation: simpleExplanation,
        whyItMatters: whyItMatters,
        example: `// Example Concept: ${les.title}\n// Apply these principles in your projects to ensure robust functionality.`,
        summary: summary,
        practiceTask: `Review ${les.title} and identify 3 real-world applications where this principle is used.`
      });

      les.keyPoints = ["Core Theory", "Practical Application", "Best Practices"];
      delete les.rawContent;
    }
    
    // Filter out empty lessons
    mod.lessons = mod.lessons.filter(l => l.content);
  }

  // Fallback if parsing failed completely
  if (modules.length === 0) {
    modules.push({
      title: "Course Overview",
      description: "General concepts.",
      lessons: [{
        title: "Introduction",
        content: JSON.stringify({
          simpleExplanation: "Overview of the technical concepts.",
          whyItMatters: ["Fundamental knowledge"],
          example: "// Basics",
          summary: "Important foundation.",
          practiceTask: "Review the materials."
        }),
        keyPoints: ["Overview"]
      }]
    });
  }

  return modules;
}
