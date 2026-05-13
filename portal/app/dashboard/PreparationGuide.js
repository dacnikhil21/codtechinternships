import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreparationGuide({ courseTitle, prepContent, onView }) {
  const [selectedGuide, setSelectedGuide] = useState(null);
  
  // High-fidelity GFG Video for Interview Prep
  const prepVideoId = "3v0Bv0Uf0Y4"; // GeeksforGeeks Complete Roadmap

  const ROADMAP_CONTENT = {
    'Programming Languages': {
       title: 'Programming Mastery',
       icon: 'code',
       color: 'bg-blue-500',
       intro: 'During interviews, companies usually don\'t require proficiency in any particular language, but you must have your programming fundamentals cleared in one.',
       sections: [
         {
           subtitle: 'Language Options',
           items: [
             'C: The mother of all languages. Great for understanding memory management.',
             'C++: High-performance language with robust STL support, ideal for competitive programming.',
             'Java: Platform-independent, object-oriented, and widely used in enterprise applications.',
             'Python: Versatile, easy to read, and the standard for Data Science and Scripting.',
             'JavaScript: The language of the web. Essential for Full Stack and Frontend roles.'
           ]
         },
         {
           subtitle: 'Key Concepts to Clear',
           items: [
             'Object-Oriented Programming (Inheritance, Polymorphism, Abstraction, Encapsulation).',
             'Memory Management (Stack vs Heap, Pointers/References).',
             'Multi-threading and Concurrency.',
             'Functional Programming basics.'
           ]
         }
       ]
    },
    'Data Structures & Algorithms': {
       title: 'DSA Masterclass',
       icon: 'code_blocks',
       color: 'bg-emerald-500',
       intro: 'DSA is the most important weapon in your arsenal. Almost every tech company emphasizes these concepts during technical rounds.',
       sections: [
         {
           subtitle: 'Data Structures (The Foundation)',
           items: [
             'Arrays & Strings: The most frequent topics (Searching, Sorting, Two Pointers).',
             'Linked Lists: Singly, Doubly, and Circular (Reversing, Cycle Detection).',
             'Stacks & Queues: Implementation and apps like Parenthesis matching or LRU Cache.',
             'Trees & BST: Level Order Traversal, Views, and Path-based problems.',
             'Heaps & Hashing: Efficient priority management and O(1) lookups.',
             'Graphs: BFS, DFS, Dijkstra, and MST (Prim/Kruskal).',
             'Advanced: Trie, Matrix, and Binary Indexed Tree (BIT).'
           ]
         },
         {
           subtitle: 'Algorithms (The Logic)',
           items: [
             'Analysis of Algorithms: Big O, Omega, and Theta notations.',
             'Sorting Algorithms: MergeSort, QuickSort, and HeapSort.',
             'Greedy Algorithms: Local optima leading to global solutions.',
             'Dynamic Programming: Overlapping subproblems and Optimal substructure.',
             'Backtracking: Recursively exploring all possibilities (N-Queens).',
             'Divide and Conquer: Breaking problems into smaller, manageable parts.'
           ]
         }
       ]
    },
    'Core CS Subjects': {
       title: 'CS Fundamentals',
       icon: 'database',
       color: 'bg-amber-500',
       intro: 'You are often asked several questions based on core subjects like Operating Systems, DBMS, and Networks.',
       sections: [
         {
           subtitle: 'Operating System',
           items: [
             'Process Management: CPU Scheduling, Threads, and Deadlocks.',
             'Memory Management: Paging, Segmentation, and Virtual Memory.',
             'File Systems and I/O Management.'
           ]
         },
         {
           subtitle: 'Database Management (DBMS)',
           items: [
             'SQL & NoSQL: Data models and Query Optimization.',
             'Normalization: Eliminating redundancy (1NF to BCNF).',
             'Transactions: ACID properties and Concurrency control.'
           ]
         },
         {
           subtitle: 'Computer Networks',
           items: [
             'OSI & TCP/IP Models: Protocol stack understanding.',
             'Networking Protocols: HTTP, HTTPS, FTP, DNS, and IP.',
             'Security: SSL/TLS handshakes and Data encryption.'
           ]
         }
       ]
    },
    'Soft Skills & System Design': {
       title: 'Final Round Prep',
       icon: 'history_edu',
       color: 'bg-indigo-500',
       intro: 'The final hurdle involves showcasing your project depth, design thinking, and cultural fit.',
       sections: [
         {
           subtitle: 'HR Round Questions',
           items: [
             'Tell me about yourself: Structuring your professional journey.',
             'Why should we hire you? Matching your skills to the company needs.',
             'Strengths & Weaknesses: Demonstrating self-awareness and growth.',
             'Explaining Gaps: How to honestly discuss employment or education breaks.'
           ]
         },
         {
           subtitle: 'System Design',
           items: [
             'LLD (Low-Level Design): Class diagrams and Design Patterns.',
             'HLD (High-Level Design): Scalability, Load Balancers, and Caching.',
             'System Architecture: Understanding how large-scale apps like Netflix or Uber work.'
           ]
         },
         {
           subtitle: 'Interview Experience',
           items: [
             'Amazon, Microsoft, Google, Facebook: Learning from previous candidates.',
             'Company-wise recruitment patterns and frequently asked problem types.'
           ]
         }
       ]
    }
  };

  return (
    <div className="col-span-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Guide Detail View */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b flex justify-between items-center bg-slate-50">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${ROADMAP_CONTENT[selectedGuide].color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                       <span className="material-symbols-outlined text-2xl">{ROADMAP_CONTENT[selectedGuide].icon}</span>
                    </div>
                    <div>
                       <h3 className="font-black text-xl uppercase tracking-tight text-slate-900">{ROADMAP_CONTENT[selectedGuide].title}</h3>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">In-Platform Preparation Guide</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedGuide(null)} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-xl">close</span>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                 <p className="text-base text-slate-600 font-medium leading-relaxed italic border-l-4 border-slate-100 pl-6">
                    "{ROADMAP_CONTENT[selectedGuide].intro}"
                 </p>

                 {ROADMAP_CONTENT[selectedGuide].sections.map((section, idx) => (
                   <div key={idx} className="space-y-4">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                         {section.subtitle}
                      </h4>
                      <div className="grid grid-cols-1 gap-3 pl-4">
                         {section.items.map((item, i) => (
                           <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                              <span className="text-primary font-black text-[10px] mt-0.5">{i + 1}.</span>
                              <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{item}</p>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>

              <div className="p-8 border-t bg-slate-50 flex justify-center">
                 <button 
                   onClick={() => setSelectedGuide(null)}
                   className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-primary transition-all"
                 >
                    Finish Reading
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Hero Section */}
      <section className="relative bg-slate-900 rounded-[3rem] p-10 overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
             <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10">Official Roadmap</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             </div>
             <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-tight italic">
                Interview <span className="text-primary underline decoration-white/20 underline-offset-8">Preparation</span>
             </h2>
             <p className="text-white/60 text-base font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
                A 1:1 detailed recreation of the official GeeksforGeeks interview preparation guide. Master DSA, Core Subjects, and HR rounds without leaving the platform.
             </p>
             <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                   <span className="material-symbols-outlined text-emerald-400">menu_book</span>
                   <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Detailed Content</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                   <span className="material-symbols-outlined text-indigo-400">no_accounts</span>
                   <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">No Redirection</span>
                </div>
             </div>
          </div>

          <div className="w-full lg:w-[450px] aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 group relative">
             <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${prepVideoId}?autoplay=0`}
                title="Interview Prep Roadmap"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
             ></iframe>
             <div className="absolute inset-0 bg-primary/20 pointer-events-none group-hover:opacity-0 transition-opacity"></div>
          </div>
        </div>
      </section>

      {/* Roadmap Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(ROADMAP_CONTENT).map((key, i) => {
          const cat = ROADMAP_CONTENT[key];
          return (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedGuide(key)}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className={`w-14 h-14 ${cat.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                 <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{cat.icon}</span>
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-3 leading-tight">{key}</h3>
              <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-8 flex-1">Complete roadmap including languages, core concepts, and HR prep.</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-3 transition-all">
                 Study Roadmap <span className="material-symbols-outlined text-sm">auto_stories</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* GFG Official Content Header - THE STUFF TO MAKE IT LOOK GOOD */}
      <section className="bg-white rounded-[3rem] p-10 border border-slate-200/60 shadow-sm relative overflow-hidden">
         <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="max-w-xl space-y-4 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <span className="material-symbols-outlined text-[14px]">history_edu</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Master Blueprint</span>
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-tight">
                  Why <span className="text-emerald-500">GeeksforGeeks?</span>
               </h3>
               <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                  We've mapped the exact preparation plan provided by industry experts. This guide ensures you cover 100% of the topics required for product-based company interviews.
               </p>
               <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  {['Languages', 'DSA', 'Core CS', 'Aptitude', 'HR Round', 'System Design'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-lg border border-slate-100">{tag}</span>
                  ))}
               </div>
            </div>
            <div className="flex-shrink-0">
               <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-dashed border-primary/20">
                  <span className="material-symbols-outlined text-3xl text-primary animate-bounce">expand_more</span>
               </div>
            </div>
         </div>
      </section>

      {/* Specialized Tracks */}
      <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100">
         <div className="flex items-center gap-4 mb-10 px-2">
            <div className="w-1.5 h-12 bg-primary rounded-full"></div>
            <div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">Domain <span className="text-primary">Deep-Dive</span></h3>
               <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-2">Specialized tracks for {courseTitle} track</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prepContent && prepContent.length > 0 ? (
               prepContent.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 text-primary rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                           <span className="material-symbols-outlined text-xl">school</span>
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 text-[13px] uppercase tracking-tight">{item.title}</h4>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5 line-clamp-1">{item.description}</p>
                        </div>
                     </div>
                     <button onClick={() => onView(item)} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                     </button>
                  </div>
               ))
            ) : (
               <div className="col-span-full py-12 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">
                  Additional tracks loading...
               </div>
            )}
         </div>
      </div>

    </div>
  );
}
