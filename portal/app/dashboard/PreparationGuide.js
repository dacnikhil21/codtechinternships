import React from 'react';
import { motion } from 'framer-motion';

export default function PreparationGuide({ courseTitle, prepContent, onView }) {
  
  // High-fidelity GFG Video for Interview Prep
  const prepVideoId = "3v0Bv0Uf0Y4"; // GeeksforGeeks Complete Roadmap

  return (
    <div className="col-span-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Premium Hero Section */}
      <section className="relative bg-slate-900 rounded-[3.5rem] p-12 overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
             <div className="flex items-center justify-center lg:justify-start gap-3">
                <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-emerald-500/20">Official Learning Portal</div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             </div>
             <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] italic">
                Interview <br /> <span className="text-primary">Preparation</span>
             </h2>
             <p className="text-white/50 text-lg font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                A comprehensive, 1:1 in-platform roadmap to acing technical interviews. Master every domain from DSA to HR rounds with the official GeeksforGeeks blueprint.
             </p>
             <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-4">
                <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-xl">
                   <span className="material-symbols-outlined text-emerald-400 text-2xl">verified</span>
                   <span className="text-[12px] font-black text-white/90 uppercase tracking-[0.2em]">Verified Content</span>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-6 py-4 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-xl">
                   <span className="material-symbols-outlined text-indigo-400 text-2xl">auto_stories</span>
                   <span className="text-[12px] font-black text-white/90 uppercase tracking-[0.2em]">Native Reading</span>
                </div>
             </div>
          </div>

          <div className="w-full lg:w-[550px] aspect-video bg-black rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(var(--primary-rgb),0.2)] border-8 border-white/5 group relative">
             <iframe 
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${prepVideoId}?autoplay=0&rel=0&modestbranding=1`}
                title="Interview Prep Roadmap"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
             ></iframe>
             <div className="absolute inset-0 bg-primary/10 pointer-events-none group-hover:opacity-0 transition-opacity duration-500"></div>
          </div>
        </div>
      </section>

      {/* THE MASTER ROADMAP - DIRECT CONTENT FROM GFG BLOG */}
      <div className="max-w-6xl mx-auto space-y-20">
         
         {/* Introduction */}
         <section className="bg-white rounded-[4rem] p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
            <div className="relative z-10 space-y-8">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">The <span className="text-primary">Roadmap</span> to Success</h3>
               <div className="w-20 h-2 bg-primary rounded-full"></div>
               <p className="text-xl text-slate-500 font-medium leading-relaxed italic border-l-8 border-slate-100 pl-10 max-w-4xl">
                  "The preparation for acing a tech interview starts with a complete and worthwhile roadmap. Until and unless you won't know what to prepare, where to prepare, and what subjects hold more weightage, you can't get prepared for any tech interview."
               </p>
               <p className="text-base text-slate-400 font-medium leading-relaxed max-w-3xl">
                  Below is the required preparation plan along with quality learning resources to make your interview preparation journey convenient and easier. Follow this detailed roadmap to prepare for the tech interviews:
               </p>
            </div>
         </section>

         {/* Section 1: Programming Languages */}
         <section className="space-y-10 px-4">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200">
                  <span className="material-symbols-outlined text-3xl">terminal</span>
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">1. Programming <span className="text-blue-600">Language</span></h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Pick your primary weapon</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                  <p className="text-slate-500 font-medium leading-relaxed">
                     Companies usually don't require you to have proficiency with any particular programming language - hence, you can pick any of these languages to get your fundamentals cleared:
                  </p>
                  <div className="space-y-4">
                     {[
                        { name: 'C', desc: 'The base of modern programming. Essential for memory logic.' },
                        { name: 'C++', desc: 'Most popular for Competitive Programming and DSA.' },
                        { name: 'Java', desc: 'Enterprise standard. Platform independent and robust.' },
                        { name: 'Python', desc: 'Easiest to learn, versatile for AI and Web.' },
                        { name: 'JavaScript', desc: 'Essential for modern Full Stack Development.' }
                     ].map((lang, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all">{lang.name[0]}</div>
                           <div>
                              <h4 className="font-black text-slate-900 text-sm uppercase">{lang.name}</h4>
                              <p className="text-[11px] text-slate-400 font-medium">{lang.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl space-y-8 flex flex-col justify-center border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                  <h4 className="text-xl font-black text-white uppercase italic tracking-tight">Pro Tip for <span className="text-blue-400 text-2xl block mt-1">Placements</span></h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                     Focus on Mastering ONE language thoroughly rather than skimming through many. For placements, C++, Java, or Python are highly recommended due to their extensive library support and industry demand.
                  </p>
                  <div className="pt-6">
                     <div className="h-[1px] w-full bg-white/10"></div>
                     <div className="flex justify-between mt-6">
                        <div className="text-center">
                           <div className="text-2xl font-black text-white italic tracking-tighter">95%</div>
                           <div className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-1">Placement Parity</div>
                        </div>
                        <div className="text-center">
                           <div className="text-2xl font-black text-white italic tracking-tighter">STL</div>
                           <div className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-1">Rich Libraries</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Section 2: DSA */}
         <section className="space-y-10 px-4">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-emerald-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-200">
                  <span className="material-symbols-outlined text-3xl">code_blocks</span>
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">2. Data Structures <span className="text-emerald-600">& Algorithms</span></h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">The most important weapon</p>
               </div>
            </div>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
               <div className="grid grid-cols-1 lg:grid-cols-3">
                  <div className="p-12 lg:border-r border-slate-100 space-y-10">
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-3">
                           <span className="w-6 h-[2px] bg-emerald-600"></span>
                           Data Structures
                        </h4>
                        <div className="space-y-3">
                           {['Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Tree', 'BST', 'Heap', 'Hashing', 'Graph', 'Matrix', 'Trie'].map(item => (
                              <div key={item} className="flex items-center justify-between group cursor-default">
                                 <span className="text-[13px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{item}</span>
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-emerald-400">Mastered</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="p-12 lg:border-r border-slate-100 space-y-10">
                     <div className="space-y-4">
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
                           <span className="w-6 h-[2px] bg-indigo-600"></span>
                           Algorithms
                        </h4>
                        <div className="space-y-3">
                           {['Analysis', 'Searching', 'Sorting', 'Greedy', 'DP', 'Backtracking', 'Divide & Conquer', 'Geometric', 'Mathematical', 'Graph Algo'].map(item => (
                              <div key={item} className="flex items-center justify-between group cursor-default">
                                 <span className="text-[13px] font-bold text-slate-600 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{item}</span>
                                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-indigo-400">Essential</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="p-12 bg-slate-50 space-y-8 flex flex-col justify-center">
                     <div className="space-y-4">
                        <h4 className="text-xl font-black text-slate-900 uppercase italic leading-tight tracking-tight">Crucial for <span className="text-emerald-500">Battle</span></h4>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                           Almost every renowned tech company emphasizes more on candidates' DSA skills during the interviews. These are the building blocks of efficient software.
                        </p>
                        <div className="pt-6 space-y-4">
                           <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                                 <span className="material-symbols-outlined text-xl">psychology</span>
                              </div>
                              <div>
                                 <h5 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Problem Solving</h5>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Logic development</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                                 <span className="material-symbols-outlined text-xl">speed</span>
                              </div>
                              <div>
                                 <h5 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Efficiency</h5>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Time & Space Complexity</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Section 3: Core Subjects */}
         <section className="space-y-10 px-4">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-amber-500 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-200">
                  <span className="material-symbols-outlined text-3xl">database</span>
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">3. Core CS <span className="text-amber-600">Subjects</span></h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Foundation of Engineering</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { title: 'Operating Systems', icon: 'settings_suggest', color: 'text-rose-500', bg: 'bg-rose-50', desc: 'Process Management, Threads, Memory Management, and CPU Scheduling.' },
                  { title: 'DBMS', icon: 'storage', color: 'text-amber-500', bg: 'bg-amber-50', desc: 'Normalization, SQL Queries, Joins, and Transaction (ACID) properties.' },
                  { title: 'Computer Networks', icon: 'hub', color: 'text-blue-500', bg: 'bg-blue-50', desc: 'OSI Layers, TCP/UDP, IP Addressing, and Web Protocols (HTTP/HTTPS).' }
               ].map((subject, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                     <div className={`w-14 h-14 ${subject.bg} ${subject.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined text-2xl">{subject.icon}</span>
                     </div>
                     <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4 italic leading-none">{subject.title}</h4>
                     <p className="text-[13px] text-slate-400 font-medium leading-relaxed">{subject.desc}</p>
                  </div>
               ))}
            </div>
         </section>

         {/* Section 4: HR & Aptitude */}
         <section className="space-y-10 px-4">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200">
                  <span className="material-symbols-outlined text-3xl">groups</span>
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">4. HR Round <span className="text-indigo-600">& Aptitude</span></h3>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Final Selection Criteria</p>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[4rem] p-16 shadow-2xl border border-white/5 relative overflow-hidden">
               <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
               <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-8">
                     <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">Technical <span className="text-primary">Aptitude</span></h4>
                     <p className="text-white/50 text-sm leading-relaxed">
                        Most interviews begin with a screening round focused on Aptitude and Reasoning. You should prepare for:
                     </p>
                     <ul className="grid grid-cols-1 gap-4">
                        {['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability (English)', 'Data Interpretation'].map(item => (
                           <li key={item} className="flex items-center gap-4 text-white/80 font-bold text-[12px] uppercase tracking-widest">
                              <span className="w-2 h-2 rounded-full bg-primary"></span>
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-8">
                     <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">HR Round <span className="text-primary">Mastery</span></h4>
                     <p className="text-white/50 text-sm leading-relaxed">
                        Enhance relevant soft and analytical skills to get an edge over other candidates. Prepare for:
                     </p>
                     <ul className="grid grid-cols-1 gap-4">
                        {['Tell Me About Yourself', 'Why Should We Hire You?', 'Strengths and Weaknesses', 'Project Explanations'].map(item => (
                           <li key={item} className="flex items-center gap-4 text-white/80 font-bold text-[12px] uppercase tracking-widest">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              {item}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
            </div>
         </section>

         {/* Final Inspiration Track */}
         <section className="bg-primary/5 rounded-[4rem] p-16 border border-primary/10 text-center space-y-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl border border-primary/10">
               <span className="material-symbols-outlined text-4xl text-primary animate-pulse">auto_awesome</span>
            </div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">Your Dream Job is <br /> <span className="text-primary underline decoration-primary/20 underline-offset-8">One Roadmap Away</span></h3>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
               Undoubtedly, if you'll get prepared with all the above-mentioned areas for a tech interview then you will surely get into your dream job. The CodTech platform is here to support your journey.
            </p>
         </section>

      </div>

      {/* Domain Specific Tracks - Keeping this as requested */}
      <div className="max-w-6xl mx-auto bg-white rounded-[4rem] p-16 border border-slate-100 shadow-sm">
         <div className="flex items-center gap-6 mb-12">
            <div className="w-2 h-16 bg-primary rounded-full"></div>
            <div>
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none italic">Domain <span className="text-primary">Deep-Dive</span></h3>
               <p className="text-[12px] text-slate-400 font-black uppercase tracking-[0.3em] mt-2">Specialized tracks for your internship</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prepContent && prepContent.length > 0 ? (
               prepContent.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-primary/30 hover:bg-white hover:shadow-xl transition-all">
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white text-primary rounded-[1.5rem] flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                           <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <div>
                           <h4 className="font-black text-slate-900 text-base uppercase tracking-tight italic">{item.title}</h4>
                           <p className="text-[11px] text-slate-400 font-medium mt-1 line-clamp-1">{item.description}</p>
                        </div>
                     </div>
                     <button onClick={() => onView(item)} className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                     </button>
                  </div>
               ))
            ) : (
               <div className="col-span-full py-20 text-center text-slate-300 font-black uppercase text-[12px] tracking-[0.5em] italic">
                  Additional tracks loading...
               </div>
            )}
         </div>
      </div>

    </div>
  );
}
