import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreparationGuide({ courseTitle, prepContent, onView }) {
  const [expandedSection, setExpandedSection] = useState(0);

  const ROADMAP = [
    {
      id: 0,
      title: "1. Programming Languages",
      subtitle: "The Foundation of Coding",
      icon: "terminal",
      content: {
        intro: "Pick one programming language and master its fundamentals, memory management, and libraries.",
        topics: [
          { name: "C / C++", detail: "Focus on Pointers, STL (Vector, Map, Set), and Memory Management.", videoId: "vLnPwxZdW4Y" },
          { name: "Java", detail: "Master Collections Framework, Multi-threading, and JVM Architecture.", videoId: "A74TOX803D0" },
          { name: "Python", desc: "Understand Generators, Decorators, and Data Science libraries.", videoId: "rfscVS0vtbw" },
          { name: "JavaScript", detail: "Closure, Prototypes, Async/Await, and ES6+ features.", videoId: "W6NZfCO5SIk" }
        ],
        practiceQuestions: [
          "Explain the difference between Stack and Heap memory.",
          "What is the difference between C++ and Java memory management?",
          "How does Python's Garbage Collection work?"
        ]
      }
    },
    {
      id: 1,
      title: "2. Data Structures & Algorithms",
      subtitle: "The Core of Tech Interviews",
      icon: "code_blocks",
      content: {
        intro: "DSA is the most critical part of any technical interview. Master these to solve complex problems efficiently.",
        subsections: [
          {
            name: "Data Structures",
            items: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees & BST", "Heaps & Hashing", "Graphs", "Trie & Matrix"]
          },
          {
            name: "Algorithms",
            items: ["Searching (Binary Search)", "Sorting (Merge, Quick)", "Greedy Algorithms", "Dynamic Programming", "Backtracking", "Divide & Conquer"]
          }
        ],
        videoResource: { title: "Complete DSA Roadmap", id: "3v0Bv0Uf0Y4" },
        practiceQuestions: [
          "Reverse a Linked List in-place.",
          "Find the middle element of a Stack in O(1).",
          "Implement a LRU Cache."
        ]
      }
    },
    {
      id: 2,
      title: "3. Core CS Subjects",
      subtitle: "Engineering Fundamentals",
      icon: "database",
      content: {
        intro: "Core subjects test your depth of engineering knowledge beyond just coding.",
        topics: [
          { name: "DBMS", detail: "SQL Queries, Normalization, ACID Properties, Indexing.", videoId: "dl00fX18mmE" },
          { name: "Operating Systems", detail: "Process vs Thread, Deadlocks, Paging, CPU Scheduling.", videoId: "bkSWNj5mqK0" },
          { name: "Computer Networks", detail: "OSI Layers, TCP/IP, DNS, HTTP/HTTPS protocols.", videoId: "IPvYjX9bas8" },
          { name: "OOPs Concepts", detail: "Inheritance, Polymorphism, Abstraction, Encapsulation.", videoId: "pTB0EiLXUC8" }
        ]
      }
    },
    {
      id: 3,
      title: "4. Aptitude & Reasoning",
      subtitle: "Initial Screening Mastery",
      icon: "calculate",
      content: {
        intro: "Prepare for the first round of selection involving quantitative and logical tests.",
        areas: [
          { name: "Quantitative", items: ["Profit & Loss", "Time & Work", "Probability", "Averages"] },
          { name: "Logical", items: ["Blood Relations", "Syllogisms", "Data Interpretation", "Puzzles"] },
          { name: "Verbal", items: ["Reading Comprehension", "Grammar", "Critical Reasoning"] }
        ]
      }
    },
    {
      id: 4,
      title: "5. Interview Questions",
      subtitle: "Topic-wise Top 50",
      icon: "quiz",
      content: {
        intro: "Practice the most frequently asked questions in product-based companies.",
        categories: [
          { name: "Top 50 DSA Questions", items: ["Two Sum", "Merge Intervals", "Longest Palindromic Substring", "Graph Cycle"] },
          { name: "Puzzles", items: ["3 Ants on a Triangle", "The Heaviest Coin", "2 Eggs 100 Floors"] }
        ]
      }
    },
    {
      id: 5,
      title: "6. HR Round Preparation",
      subtitle: "Personality & Cultural Fit",
      icon: "emoji_people",
      content: {
        intro: "Your soft skills are as important as your technical skills in the final round.",
        questions: [
          "Tell me about yourself.",
          "Why do you want to join our company?",
          "What is your greatest weakness and how did you overcome it?",
          "Describe a situation where you led a team through a challenge."
        ]
      }
    },
    {
      id: 6,
      title: "7. Resume Preparation",
      subtitle: "Getting Shortlisted",
      icon: "description",
      content: {
        intro: "Build an ATS-friendly resume that highlights your projects and skills correctly.",
        tips: [
          "Use a single-column layout for better ATS parsing.",
          "Quantify your results (e.g., Optimized code performance by 30%).",
          "Include a clean link to your GitHub and Portfolio.",
          "Focus on 2-3 high-quality projects with clear impact."
        ]
      }
    },
    {
      id: 7,
      title: "8. Company-wise Preparation",
      subtitle: "Targeted Interview Tracks",
      icon: "business",
      content: {
        intro: "Deep dive into the specific interview patterns of tech giants.",
        companies: [
          { name: "FAANG / MAANG", focus: "Heavy emphasis on DSA and System Design." },
          { name: "Top Product Startups", focus: "Emphasis on Development skills and Problem Solving." },
          { name: "Service-based Giants", focus: "Emphasis on Aptitude, Basics, and Communication." }
        ]
      }
    }
  ];

  return (
    <div className="col-span-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header & Progress */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
               <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">Interview <span className="text-primary">Preparation Portal</span></h2>
               <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Follow the GeeksforGeeks Master Roadmap</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preparation Progress</div>
                  <div className="text-xl font-black text-slate-900 italic">{( (expandedSection + 1) / ROADMAP.length * 100 ).toFixed(0)}%</div>
               </div>
               <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((expandedSection + 1) / ROADMAP.length) * 100}%` }}></div>
               </div>
            </div>
         </div>
      </div>

      {/* Roadmap Modules */}
      <div className="space-y-4">
        {ROADMAP.map((section, index) => (
          <div key={section.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all">
            {/* Section Header */}
            <button 
              onClick={() => setExpandedSection(expandedSection === index ? -1 : index)}
              className={`w-full p-8 flex items-center justify-between transition-colors ${expandedSection === index ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
            >
              <div className="flex items-center gap-6">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${expandedSection === index ? 'bg-primary text-white shadow-primary/20' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">{section.icon}</span>
                 </div>
                 <div className="text-left">
                    <h3 className={`text-xl font-black uppercase tracking-tight italic leading-tight ${expandedSection === index ? 'text-slate-900' : 'text-slate-500'}`}>
                       {section.title}
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{section.subtitle}</p>
                 </div>
              </div>
              <span className={`material-symbols-outlined text-3xl transition-transform duration-300 ${expandedSection === index ? 'rotate-180 text-primary' : 'text-slate-300'}`}>
                 expand_more
              </span>
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
               {expandedSection === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                     <div className="p-10 pt-4 border-t border-slate-100 bg-white space-y-10">
                        {/* Section Introduction */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                           <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{section.content.intro}"</p>
                        </div>

                        {/* Custom Content based on Section */}
                        {section.id === 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {section.content.topics.map((topic, i) => (
                               <div key={i} className="p-6 rounded-3xl border border-slate-100 space-y-4 hover:border-primary/30 transition-all group">
                                  <div className="flex justify-between items-start">
                                     <h4 className="font-black text-slate-900 uppercase text-sm">{topic.name}</h4>
                                     <span className="text-[9px] font-black text-primary uppercase tracking-widest px-2 py-1 bg-primary/5 rounded-lg border border-primary/10">Embedded Tutorial</span>
                                  </div>
                                  <p className="text-[12px] text-slate-400 font-medium leading-relaxed">{topic.detail}</p>
                                  <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg">
                                     <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${topic.videoId}`} frameBorder="0" allowFullScreen></iframe>
                                  </div>
                               </div>
                             ))}
                          </div>
                        )}

                        {section.id === 1 && (
                          <div className="space-y-10">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {section.content.subsections.map((sub, i) => (
                                   <div key={i} className="space-y-4">
                                      <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                         <span className="w-2 h-2 rounded-full bg-primary"></span>
                                         {sub.name}
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                         {sub.items.map(item => (
                                           <span key={item} className="px-3 py-1.5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded-lg border border-slate-100">{item}</span>
                                         ))}
                                      </div>
                                   </div>
                                ))}
                             </div>
                             <div className="bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                   <div className="flex-1 space-y-4">
                                      <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Master {section.content.videoResource.title}</h4>
                                      <p className="text-white/40 text-[12px] font-medium leading-relaxed">Watch the complete roadmap video inside the platform to understand the priority and sequence of DSA topics.</p>
                                   </div>
                                   <div className="w-full md:w-64 aspect-video bg-black rounded-2xl overflow-hidden border border-white/10">
                                      <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${section.content.videoResource.id}`} frameBorder="0" allowFullScreen></iframe>
                                   </div>
                                </div>
                             </div>
                          </div>
                        )}

                        {section.id === 2 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {section.content.topics.map((topic, i) => (
                                <div key={i} className="p-8 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-all group">
                                   <div className="flex items-center gap-4 mb-4">
                                      <div className="w-10 h-10 bg-slate-50 text-primary rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                                         <span className="material-symbols-outlined text-xl">menu_book</span>
                                      </div>
                                      <h4 className="font-black text-slate-900 uppercase text-sm italic">{topic.name}</h4>
                                   </div>
                                   <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-6">{topic.detail}</p>
                                   <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-inner">
                                      <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${topic.videoId}`} frameBorder="0" allowFullScreen></iframe>
                                   </div>
                                </div>
                             ))}
                          </div>
                        )}

                        {/* Generic Lists for other sections */}
                        {section.content.areas && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             {section.content.areas.map((area, i) => (
                                <div key={i} className="space-y-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{area.name}</h4>
                                   <ul className="space-y-2">
                                      {area.items.map(item => (
                                         <li key={item} className="flex items-center gap-3 text-[12px] font-medium text-slate-500 uppercase tracking-tight">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                            {item}
                                         </li>
                                      ))}
                                   </ul>
                                </div>
                             ))}
                          </div>
                        )}

                        {section.content.practiceQuestions && (
                           <div className="space-y-6">
                              <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                                 <span className="w-8 h-[2px] bg-primary/20"></span>
                                 Self-Assessment Questions
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                 {section.content.practiceQuestions.map((q, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 flex gap-4 items-start group hover:border-primary/20 transition-all">
                                       <span className="text-[10px] font-black text-slate-300 group-hover:text-primary transition-colors mt-1">{i + 1}.</span>
                                       <p className="text-[13px] text-slate-600 font-bold uppercase tracking-tight leading-relaxed">{q}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}

                        {/* HR Round / Resume / Companies Lists */}
                        {section.content.questions && (
                           <div className="grid grid-cols-1 gap-3">
                              {section.content.questions.map((q, i) => (
                                 <div key={i} className="p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                    <span className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">{q}</span>
                                    <button className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">Read Model Answer</button>
                                 </div>
                              ))}
                           </div>
                        )}

                        {section.content.tips && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {section.content.tips.map((tip, i) => (
                                 <div key={i} className="p-6 rounded-3xl border border-dashed border-slate-200 flex gap-4 items-start">
                                    <span className="material-symbols-outlined text-primary">lightbulb</span>
                                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{tip}</p>
                                 </div>
                              ))}
                           </div>
                        )}

                        {section.content.companies && (
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {section.content.companies.map((company, i) => (
                                 <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm text-center space-y-4 hover:shadow-xl transition-all">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
                                       <span className="material-symbols-outlined text-3xl text-slate-300">business</span>
                                    </div>
                                    <h4 className="font-black text-slate-900 uppercase text-[12px] tracking-widest">{company.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{company.focus}</p>
                                    <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all">View Pattern</button>
                                 </div>
                              ))}
                           </div>
                        )}
                        
                        {/* Action Bar */}
                        <div className="pt-6 flex justify-between items-center border-t border-slate-50">
                           <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Complete?</span>
                           </div>
                           <button 
                             onClick={() => setExpandedSection(index + 1 < ROADMAP.length ? index + 1 : -1)}
                             className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all"
                           >
                              Next: {ROADMAP[index + 1]?.title || "Finish Roadmap"}
                           </button>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Domain Content Tracker - Maintaining existing logic */}
      {prepContent && prepContent.length > 0 && (
         <div className="bg-slate-50/50 rounded-[3rem] p-12 border border-slate-100">
            <div className="flex items-center gap-6 mb-12">
               <div className="w-2 h-16 bg-primary rounded-full"></div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none italic">Internship <span className="text-primary">Materials</span></h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2">Specialized tracks for {courseTitle}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {prepContent.map((item, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 hover:shadow-xl transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-50 text-primary rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all">
                           <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight italic leading-none">{item.title}</h4>
                           <p className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-1">{item.description}</p>
                        </div>
                     </div>
                     <button onClick={() => onView(item)} className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                     </button>
                  </div>
               ))}
            </div>
         </div>
      )}

    </div>
  );
}
