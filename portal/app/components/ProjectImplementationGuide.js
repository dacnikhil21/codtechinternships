'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectImplementationGuide({ onClose }) {
  const steps = [
    {
      id: 1,
      title: "Select Any 4 Projects",
      desc: "Go to the Projects Section and choose any four projects based on your enrolled domain!",
      icon: "task_alt"
    },
    {
      id: 2,
      title: "Understand & Work",
      desc: "Carefully read requirements before starting. Follow category-specific guidelines.",
      icon: "psychology"
    },
    {
      id: 3,
      title: "Wait for Completion",
      desc: "Receive your certificate and project recognition after duration and submissions.",
      icon: "card_membership"
    },
    {
      id: 4,
      title: "Keep Learning More",
      desc: "Continue through platform modules like Placement, Resume, and Mock Interviews.",
      icon: "school"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white w-full h-full md:max-w-4xl md:h-[85vh] md:rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200/60"
      >
        {/* Header */}
        <div className="p-5 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 pt-12 md:pt-8">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                 <span className="material-symbols-outlined text-white text-xl md:text-2xl">rocket_launch</span>
              </div>
              <div>
                 <h3 className="text-sm md:text-xl font-black text-slate-900 tracking-tight uppercase leading-none italic">How to do <span className="text-primary">CODTECH Projects</span></h3>
                 <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ultimate Step-by-Step Guide</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100">
              <span className="material-symbols-outlined text-xl">close</span>
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12">
          
          {/* Quick Steps Overview */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {steps.map((step) => (
              <div key={step.id} className="p-5 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100 relative group overflow-hidden">
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <span className="material-symbols-outlined text-6xl md:text-7xl font-black">{step.icon}</span>
                </div>
                <div className="text-[10px] font-black text-primary uppercase mb-2">Step {step.id}</div>
                <h4 className="text-[11px] md:text-[13px] font-black text-slate-900 uppercase tracking-tight mb-2 leading-tight">{step.title}</h4>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </section>

          {/* Detailed Category Guidelines */}
          <div className="space-y-10">
             <div className="flex items-center gap-3">
                <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] px-4 whitespace-nowrap">Domain Guidelines</span>
                <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Technical / Coding */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                         <span className="material-symbols-outlined">terminal</span>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase text-sm italic tracking-tight">Technical & Coding</h4>
                   </div>
                   <ul className="space-y-3">
                      {[
                        'Create complete project code properly',
                        'Add comments for better understanding',
                        'Organize files neatly in folders',
                        'Submit unique Git repo per project'
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-[12px] text-slate-500 font-medium">
                           <span className="material-symbols-outlined text-emerald-500 text-sm mt-0.5">check_circle</span>
                           {item}
                        </li>
                      ))}
                   </ul>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Must Include in README:</p>
                      <div className="grid grid-cols-2 gap-2">
                         {['Intern ID', 'Full Name', 'Weeks', 'Scope'].map(tag => (
                           <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-500 text-center uppercase tracking-tighter">✓ {tag}</span>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Data Science */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                         <span className="material-symbols-outlined">analytics</span>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase text-sm italic tracking-tight">Data Science & Analytics</h4>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[11px] text-slate-400 font-medium italic">Use Kaggle or Public CSVs for cleaning, visualization, and prediction.</p>
                      <div className="grid grid-cols-2 gap-3">
                         {['Dataset Files', 'Jupyter Code', 'Graphs/Charts', 'Output Images'].map((p, i) => (
                           <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                              {p}
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between">
                      <span className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">Recommended: Kaggle</span>
                      <span className="material-symbols-outlined text-white/20">data_exploration</span>
                   </div>
                </div>

                {/* Creative / Non-IT */}
                <div className="md:col-span-2 bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                   <div className="flex-1 space-y-4 text-center md:text-left">
                      <h4 className="font-black text-slate-900 uppercase text-sm italic tracking-tight">Creative & Design Projects</h4>
                      <p className="text-[11px] text-slate-400 font-medium">Create posters, visual reports, UI designs, or datasets and upload to GitHub.</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-2">
                         {['Posters', 'Presentations', 'Reports', 'UI Designs', 'Visuals'].map(item => (
                           <span key={item} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{item}</span>
                         ))}
                      </div>
                   </div>
                   <div className="w-full md:w-48 aspect-square bg-white rounded-3xl border border-slate-200 flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-200">brush</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Post Submission Info */}
          <section className="bg-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-4">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[9px] font-black uppercase tracking-widest">Rewards & Growth</span>
                   </div>
                   <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic leading-tight">After Submission: <br/><span className="text-indigo-200">The 🎓 Graduation Phase</span></h4>
                   <p className="text-white/60 text-sm font-medium leading-relaxed max-w-lg">Once completed, you receive your Internship & Project Certificates, but don't stop there. Continue through our placement modules to maximize your career.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 shrink-0">
                   {['Resume Prep', 'Mock Mocks', 'Aptitude', 'Career Guide'].map(tag => (
                     <div key={tag} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-indigo-200">verified</span>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-80">{tag}</span>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          {/* Important Note */}
          <div className="bg-amber-50 border border-amber-200/50 rounded-3xl p-6 md:p-8 flex items-start gap-5">
             <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">info</span>
             </div>
             <div>
                <h4 className="text-[12px] font-black text-amber-900 uppercase tracking-widest mb-2">Important Final Notes ✅</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                   {['Maintain proper GitHub repositories', 'Submit before deadlines', 'Ensure original work', 'Keep learning consistently'].map(note => (
                      <p key={note} className="text-[11px] text-amber-800/70 font-bold uppercase tracking-tight flex items-center gap-2">
                         <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                         {note}
                      </p>
                   ))}
                </div>
             </div>
          </div>

          <div className="text-center pb-10">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.8em] italic">Learn • Build • Upload • Grow with CODTECH</p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 md:p-8 border-t border-slate-100 bg-white flex justify-center items-center gap-6 shrink-0">
           <button 
             onClick={onClose} 
             className="bg-slate-900 text-white px-16 py-4 rounded-xl font-black text-[11px] shadow-xl shadow-black/10 hover:bg-primary transition-all uppercase tracking-[0.2em] hover:scale-105 active:scale-95"
           >
             Acknowledge & Start
           </button>
        </div>
      </motion.div>
    </div>
  );
}
