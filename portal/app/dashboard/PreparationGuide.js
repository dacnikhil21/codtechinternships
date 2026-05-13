import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PreparationGuide({ courseTitle, prepContent, onView }) {
  const [selectedGuide, setSelectedGuide] = useState(null);
  
  // High-fidelity GFG Video for Interview Prep
  const prepVideoId = "3v0Bv0Uf0Y4"; // GeeksforGeeks Complete Roadmap

  const ROADMAP_CONTENT = {
    'Data Structures & Algorithms': {
       title: 'DSA Masterclass',
       icon: 'code_blocks',
       color: 'bg-emerald-500',
       intro: 'Data Structures and Algorithms are the most important weapon in your arsenal. Almost every tech company emphasizes DSA during interviews.',
       sections: [
         {
           subtitle: 'Data Structures',
           items: [
             'Arrays: Learn Array Data Structure Guide & Practice Categorized Problems.',
             'Linked Lists: Master Singly, Doubly and Circular Linked Lists.',
             'Stacks & Queues: Understand LIFO/FIFO and their real-world applications.',
             'Trees & Graphs: Deep dive into Binary Trees, BST, and Graph traversals.',
             'Hashing: Learn efficient data retrieval with Hash Tables.'
           ]
         },
         {
           subtitle: 'Algorithms',
           items: [
             'Searching & Sorting: Linear Search, Binary Search, QuickSort, MergeSort.',
             'Greedy Algorithms: Local optimization for global solutions.',
             'Dynamic Programming: Solving complex problems by breaking them into sub-problems.',
             'Backtracking: Exploring all possibilities (N-Queens, Sudoku).'
           ]
         }
       ]
    },
    'Core CS Subjects': {
       title: 'Core Fundamentals',
       icon: 'database',
       color: 'bg-amber-500',
       intro: 'Acing technical rounds requires a strong grip on core Computer Science subjects.',
       sections: [
         {
           subtitle: 'Operating Systems',
           items: [
             'Process Management: Threads, Scheduling Algorithms, and IPC.',
             'Memory Management: Paging, Segmentation, and Virtual Memory.',
             'Deadlocks: Prevention, Avoidance, and Detection.'
           ]
         },
         {
           subtitle: 'Database Management',
           items: [
             'SQL & NoSQL: Queries, Joins, and Indexing.',
             'Normalization: 1NF, 2NF, 3NF, and BCNF.',
             'Transactions: ACID properties and Concurrency Control.'
           ]
         },
         {
           subtitle: 'Computer Networks',
           items: [
             'OSI Model: All 7 layers and their protocols.',
             'TCP/IP: Handshaking, Congestion Control, and Flow Control.',
             'HTTP/HTTPS: SSL/TLS and Web Security.'
           ]
         }
       ]
    },
    'Aptitude & Reasoning': {
       title: 'Screening Round Prep',
       icon: 'calculate',
       color: 'bg-rose-500',
       intro: 'Most tech interviews begin with a screening round focused on Aptitude and Reasoning.',
       sections: [
         {
           subtitle: 'Quantitative Aptitude',
           items: [
             'Number Systems & Percentages',
             'Profit & Loss, Time & Work',
             'Probability and Statistics'
           ]
         },
         {
           subtitle: 'Logical Reasoning',
           items: [
             'Data Interpretation',
             'Syllogisms and Blood Relations',
             'Puzzles and Pattern Recognition'
           ]
         }
       ]
    },
    'HR & Soft Skills': {
       title: 'Final Round Mastery',
       icon: 'history_edu',
       color: 'bg-indigo-500',
       intro: 'Your resume gets you the interview, but your personality gets you the job.',
       sections: [
         {
           subtitle: 'HR Interview Tips',
           items: [
             'Tell me about yourself: How to craft a 2-minute pitch.',
             'Strengths & Weaknesses: Being honest yet professional.',
             'Why should we hire you? Highlighting your project contributions.'
           ]
         },
         {
           subtitle: 'Resume Building',
           items: [
             'Project Highlights: Quantify your impact.',
             'Keyword Optimization: Make it ATS-friendly.',
             'Formatting: Keep it clean and professional.'
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
                <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10">Official Guide</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             </div>
             <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-tight italic">
                Interview <span className="text-primary underline decoration-white/20 underline-offset-8">Blueprint</span>
             </h2>
             <p className="text-white/60 text-base font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
                A 1:1 in-platform recreation of the industry-standard GeeksforGeeks interview preparation guide. No external links, just pure preparation.
             </p>
             <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                   <span className="material-symbols-outlined text-emerald-400">task_alt</span>
                   <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">In-Platform Guides</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                   <span className="material-symbols-outlined text-indigo-400">play_circle</span>
                   <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">Tutorial Video</span>
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
              <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-8 flex-1">Complete roadmap covering technical concepts, screening, and HR rounds.</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-3 transition-all">
                 Read Guide <span className="material-symbols-outlined text-sm">menu_book</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Domain Specific Tracks */}
      <div className="bg-white rounded-[3rem] p-10 border border-slate-200/60 shadow-sm">
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
                  <div key={idx} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
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
