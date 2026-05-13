'use client';
import { motion } from 'framer-motion';

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
      desc: "Carefully read requirements. Follow category-specific guidelines for your domain.",
      icon: "psychology"
    },
    {
      id: 3,
      title: "Submission & Certificate",
      desc: "After 4 submissions and duration completion, receive your official certificates.",
      icon: "card_membership"
    },
    {
      id: 4,
      title: "Placement & Prep",
      desc: "Join job channels, build your resume, and practice mock interviews.",
      icon: "rocket_launch"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white w-full h-full md:max-w-5xl md:h-[90vh] md:rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200/60"
      >
        {/* Header */}
        <div className="p-5 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 pt-12 md:pt-8">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                 <span className="material-symbols-outlined text-white text-xl md:text-2xl">rocket_launch</span>
              </div>
              <div>
                 <h3 className="text-sm md:text-xl font-black text-slate-900 tracking-tight uppercase leading-none italic">How to do <span className="text-indigo-600">CODTECH Projects</span></h3>
                 <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Step-by-Step Implementation Guide</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100">
              <span className="material-symbols-outlined text-xl">close</span>
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-12 bg-slate-50/20">
          
          {/* Quick Steps Overview */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {steps.map((step) => (
              <div key={step.id} className="p-5 bg-white rounded-2xl md:rounded-3xl border border-slate-100 relative group overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <span className="material-symbols-outlined text-6xl md:text-7xl font-black text-indigo-600">{step.icon}</span>
                </div>
                <div className="text-[10px] font-black text-indigo-600 uppercase mb-2">Step {step.id}</div>
                <h4 className="text-[11px] md:text-[13px] font-black text-slate-900 uppercase tracking-tight mb-2 leading-tight">{step.title}</h4>
                <p className="text-[9px] md:text-[10px] text-slate-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </section>

          {/* Detailed Category Guidelines */}
          <div className="space-y-10">
             <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 whitespace-nowrap">Domain Guidelines</span>
                <div className="h-px flex-1 bg-slate-200"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Technical / Coding */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                         <span className="material-symbols-outlined">terminal</span>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase text-xs italic tracking-tight">Technical & Coding</h4>
                   </div>
                   <ul className="space-y-3">
                      {[
                        'Proper project code & comments',
                        'Organized file structure',
                        'Unique Git repo per project',
                        'Submit GitHub repository link'
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-[11px] text-slate-500 font-medium leading-relaxed">
                           <span className="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                           {item}
                        </li>
                      ))}
                   </ul>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Include in README:</p>
                      <div className="flex flex-wrap gap-2">
                         {['InternID', 'Full Name', 'Weeks', 'Scope'].map(tag => (
                            <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[8px] font-black text-slate-500 uppercase tracking-tighter">{tag}</span>
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
                      <h4 className="font-black text-slate-900 uppercase text-xs italic tracking-tight">Data & AI/ML</h4>
                   </div>
                   <ul className="space-y-3">
                      {[
                        'Use Kaggle/Public datasets',
                        'Exploration & Visualizations',
                        'Jupyter (.ipynb) or Python (.py)',
                        'Add final predictions/results'
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-[11px] text-slate-500 font-medium leading-relaxed">
                           <span className="material-symbols-outlined text-indigo-500 text-sm">check_circle</span>
                           {item}
                        </li>
                      ))}
                   </ul>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Deliverables:</p>
                      <div className="flex flex-wrap gap-2">
                         {['Dataset Source', 'Notebook', 'Charts'].map(tag => (
                            <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[8px] font-black text-slate-500 uppercase tracking-tighter">{tag}</span>
                         ))}
                      </div>
                   </div>
                </div>

                {/* Creative / Non-IT */}
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                         <span className="material-symbols-outlined">brush</span>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase text-xs italic tracking-tight">Creative & Management</h4>
                   </div>
                   <ul className="space-y-3">
                      {[
                        'High-quality content & research',
                        'Posters, PPTs or Case Studies',
                        'UI Designs or Reports',
                        'Convert to PDF/JPG and upload'
                      ].map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-[11px] text-slate-500 font-medium leading-relaxed">
                           <span className="material-symbols-outlined text-rose-500 text-sm">check_circle</span>
                           {item}
                        </li>
                      ))}
                   </ul>
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Required Files:</p>
                      <div className="flex flex-wrap gap-2">
                         {['Posters', 'Presentations', 'Case Studies'].map(tag => (
                            <span key={tag} className="px-2 py-1 bg-white border border-slate-200 rounded text-[8px] font-black text-slate-500 uppercase tracking-tighter">{tag}</span>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Submission & Beyond */}
          <section className="bg-indigo-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1 space-y-6 text-center md:text-left">
                   <div>
                      <h4 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic leading-tight mb-2">Step 3: <br/><span className="text-indigo-200">Wait for Submission & Certificate</span></h4>
                      <p className="text-white/60 text-sm font-medium leading-relaxed max-w-lg">Once you have completed all 4 projects and submitted them correctly, our team will review your work. After completion of your internship duration and successful submission, you will receive your Internship & Project Completion Certificates.</p>
                   </div>
                   
                   <div className="pt-4 border-t border-white/10">
                      <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight italic leading-tight mb-2">Step 4: <br/><span className="text-indigo-200">Join Placement Channels & Prep</span></h4>
                      <p className="text-white/60 text-sm font-medium leading-relaxed max-w-lg">Don’t stop after projects! Join our exclusive Job Alerts Channels (WhatsApp / Telegram / LinkedIn). Start preparing your resume using our Resume Builder and practice Mock Interviews to become industry-ready.</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 shrink-0">
                   {['WhatsApp', 'Telegram', 'LinkedIn', 'Resume'].map(tag => (
                     <div key={tag} className="p-4 bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                        <span className="material-symbols-outlined text-indigo-200">hub</span>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-80">{tag}</span>
                     </div>
                   ))}
                </div>
             </div>
          </section>

          <div className="text-center pb-10">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] italic">Learn • Build • Upload • Grow with CODTECH</p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 md:p-8 border-t border-slate-100 bg-white flex justify-center items-center gap-6 shrink-0">
           <button 
             onClick={onClose} 
             className="bg-slate-900 text-white px-16 py-4 rounded-xl font-black text-[11px] shadow-xl shadow-black/10 hover:bg-indigo-600 transition-all uppercase tracking-[0.2em] hover:scale-105 active:scale-95"
           >
             I Understand & Start
           </button>
        </div>
      </motion.div>
    </div>
  );
}
