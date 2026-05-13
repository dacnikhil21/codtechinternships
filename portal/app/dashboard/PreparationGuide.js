import React from 'react';
import { motion } from 'framer-motion';

export default function PreparationGuide({ courseTitle, prepContent, onView }) {
  
  // High-fidelity GFG Video for Interview Prep
  const prepVideoId = "3v0Bv0Uf0Y4"; // GeeksforGeeks Complete Roadmap

  const categories = [
    { 
      title: 'Data Structures & Algorithms', 
      icon: 'code_blocks', 
      color: 'bg-emerald-500', 
      desc: 'Master the foundation of tech interviews with Arrays, Trees, and DP.',
      link: 'https://www.geeksforgeeks.org/dsa-tutorial-learn-data-structures-and-algorithms/'
    },
    { 
      title: 'Core CS Subjects', 
      icon: 'database', 
      color: 'bg-amber-500', 
      desc: 'Deep dive into OS, DBMS, and Computer Networks fundamentals.',
      link: 'https://www.geeksforgeeks.org/computer-science-fundamentals/'
    },
    { 
      title: 'Interview Experiences', 
      icon: 'history_edu', 
      color: 'bg-indigo-500', 
      desc: 'Read real-world interview patterns from Amazon, Google, and Microsoft.',
      link: 'https://www.geeksforgeeks.org/interview-experiences/'
    },
    { 
      title: 'Aptitude & Reasoning', 
      icon: 'calculate', 
      color: 'bg-rose-500', 
      desc: 'Clear the initial screening rounds with quantitative and logical tests.',
      link: 'https://www.geeksforgeeks.org/aptitude-questions-and-answers/'
    }
  ];

  return (
    <div className="col-span-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Hero Section */}
      <section className="relative bg-slate-900 rounded-[3rem] p-10 overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
             <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10">Placement-Ready</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             </div>
             <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-tight italic">
                Interview <span className="text-primary underline decoration-white/20 underline-offset-8">Masterclass</span>
             </h2>
             <p className="text-white/60 text-base font-medium max-w-lg leading-relaxed">
                Your end-to-end roadmap to cracking technical interviews at top product companies. Follow the GeeksforGeeks blueprint curated for <span className="text-white font-bold">{courseTitle}</span> interns.
             </p>
             <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                   <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                   <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">DSA Roadmap</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5">
                   <span className="material-symbols-outlined text-indigo-400">check_circle</span>
                   <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">HR Round Prep</span>
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
        {categories.map((cat, i) => (
          <motion.a
            href={cat.link}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
            whileHover={{ y: -8 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group flex flex-col h-full"
          >
            <div className={`w-14 h-14 ${cat.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
               <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>{cat.icon}</span>
            </div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight mb-3 leading-tight">{cat.title}</h3>
            <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-8 flex-1">{cat.desc}</p>
            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-3 transition-all">
               Explore Roadmap <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* GFG Official Blog Reference - THE STUFF TO MAKE IT LOOK GOOD */}
      <section className="bg-white rounded-[3rem] p-10 border border-slate-200/60 shadow-sm relative overflow-hidden">
         <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="max-w-xl space-y-4 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  <span className="text-[9px] font-black uppercase tracking-widest">Premium Resource</span>
               </div>
               <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">
                  End-to-End <span className="text-emerald-500">Interview Blueprint</span>
               </h3>
               <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                  We've integrated the official GeeksforGeeks interview preparation blog as your core roadmap. Master every round from Aptitude to the Final HR interview.
               </p>
               <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  {['DSA', 'System Design', 'DBMS', 'OS', 'Aptitude'].map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-400 text-[9px] font-black uppercase rounded-lg border border-slate-100">{tag}</span>
                  ))}
               </div>
            </div>
            <div className="flex-shrink-0">
               <a 
                 href="https://www.geeksforgeeks.org/blogs/interview-preparation/" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:bg-primary transition-all flex items-center gap-3"
               >
                  Read Official Blog <span className="material-symbols-outlined text-lg">open_in_new</span>
               </a>
            </div>
         </div>
      </section>

      {/* Additional Preparation Tracks */}
      <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100">
         <div className="flex items-center gap-4 mb-10 px-2">
            <div className="w-1.5 h-12 bg-primary rounded-full"></div>
            <div>
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none italic">Technical <span className="text-primary">Deep-Dive</span></h3>
               <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest mt-2">Specialized tracks for your internship domain</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prepContent && prepContent.length > 0 ? (
               prepContent.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
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
