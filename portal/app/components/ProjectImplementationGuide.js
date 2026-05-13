'use client';
import { motion } from 'framer-motion';

export default function ProjectImplementationGuide({ onClose }) {
  const commonMistakes = [
    { title: 'Incorrect Repository Name', desc: 'Ensure your repo name matches "codtech-task-X" exactly as per guidelines.' },
    { title: 'Missing Documentation', desc: 'Your README.md must contain your Name, Intern ID, and Domain details.' },
    { title: 'Private Repositories', desc: 'Always keep your submission repository PUBLIC so our team can review it.' },
    { title: 'Broken Code', desc: 'Verify your project runs locally before pushing the final version to GitHub.' }
  ];

  const faqs = [
    { q: 'When is the submission deadline?', a: 'Submissions are accepted until the last Friday of your internship month.' },
    { q: 'Can I change my projects later?', a: 'Yes, you can update your selection as long as you haven\'t submitted the final links.' },
    { q: 'What if I face technical issues?', a: 'Reach out to support@codtech.in or use the help hub for immediate assistance.' }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white w-full h-full md:max-w-4xl md:h-[80vh] md:rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200/60"
      >
        {/* Compact Header */}
        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 pt-10 md:pt-6">
           <div className="flex items-center gap-3 md:gap-4">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                 <span className="material-symbols-outlined text-white text-lg md:text-xl">auto_awesome</span>
              </div>
              <div>
                 <h3 className="text-sm md:text-lg font-black text-slate-900 tracking-tight uppercase leading-none italic">Implementation <span className="text-indigo-600">Roadmap</span></h3>
                 <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Submission Protocol</p>
              </div>
           </div>
           <button onClick={onClose} className="w-9 h-9 md:w-10 md:h-10 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100">
              <span className="material-symbols-outlined text-lg md:text-xl">close</span>
           </button>
        </div>

        {/* Dense Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          
          {/* Visual Progress - TIGHTER */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: 'architecture', title: 'Plan & Design', desc: 'Draft your project logic and UI structure.' },
              { icon: 'code_blocks', title: 'Develop', desc: 'Write clean, documented, and modular code.' },
              { icon: 'rocket_launch', title: 'Deploy & Submit', desc: 'Push to GitHub and share your live URL.' }
            ].map((step, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-indigo-200 transition-all">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 mb-4 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                   <span className="material-symbols-outlined text-xl">{step.icon}</span>
                </div>
                <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-1">{step.title}</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </section>

          {/* Detailed Guide - COMPACT */}
          <section className="space-y-6">
             {[
               {
                 title: 'Phase 1: Environment Setup',
                 points: ['Install necessary dependencies (React, Node.js, etc.)', 'Initialize a local Git repository', 'Create a baseline project structure']
               },
               {
                 title: 'Phase 2: Core Development',
                 points: ['Implement features as per task requirements', 'Maintain a consistent coding style', 'Regularly commit your progress to Git']
               },
               {
                 title: 'Phase 3: Final Submission',
                 points: ['Update README.md with project details', 'Verify all files are pushed to GitHub', 'Submit the public link via dashboard']
               }
             ].map((phase, i) => (
               <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                     <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shrink-0">{i + 1}</div>
                     {i < 2 && <div className="w-0.5 h-full bg-slate-100 my-2"></div>}
                  </div>
                  <div className="pb-4">
                     <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-3">{phase.title}</h4>
                     <ul className="space-y-2">
                        {phase.points.map((p, j) => (
                           <li key={j} className="flex items-center gap-3 text-[12px] text-slate-500 font-medium">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                              {p}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
             ))}
          </section>

          {/* Submission Example - NEW */}
          <section className="bg-slate-900 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden border border-slate-800 shadow-xl">
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div>
                   <h4 className="text-lg md:text-xl font-black tracking-tight uppercase mb-4 leading-tight">GitHub Submission <br/><span className="text-indigo-400 text-sm md:text-xl">Process Example</span></h4>
                   <p className="text-slate-400 text-[11px] md:text-[13px] font-medium leading-relaxed mb-6">Follow this standard to ensure your project is accepted immediately.</p>
                   <div className="space-y-2 md:space-y-3">
                      {[
                        { step: '01', text: 'Create Repo: codtech-task-1' },
                        { step: '02', text: 'Push Source Code + Assets' },
                        { step: '03', text: 'Add Detailed README.md' },
                        { step: '04', text: 'Submit Public URL' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-3 rounded-xl">
                           <span className="text-indigo-400 font-black text-[9px] md:text-[10px]">{item.step}</span>
                           <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest">{item.text}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 border border-white/10 font-mono text-[10px] md:text-[12px] text-emerald-400 overflow-x-auto">
                   <p className="text-slate-500 mb-4"># Project README Example</p>
                   <p className="mb-2">## INTERN NAME: John Doe</p>
                   <p className="mb-2">## ID: CT/MAY/1234</p>
                   <p className="mb-2">## DOMAIN: Web Development</p>
                   <p className="mb-4">## DURATION: 4 Weeks</p>
                   <p className="text-slate-500 mb-2">### Project Overview</p>
                   <p>A responsive landing page using React...</p>
                </div>
             </div>
          </section>

          {/* Pitfalls & FAQs - NEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
             <section>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100">
                      <span className="material-symbols-outlined text-xl">warning</span>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Common Pitfalls</h4>
                </div>
                <div className="space-y-4">
                   {commonMistakes.map((item, i) => (
                      <div key={i} className="flex gap-4 group">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0 group-hover:scale-150 transition-all"></div>
                         <div>
                            <h5 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-1">{item.title}</h5>
                            <p className="text-[12px] text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             <section>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                      <span className="material-symbols-outlined text-xl">help</span>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Support & FAQs</h4>
                </div>
                <div className="space-y-4">
                   {faqs.map((item, i) => (
                      <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-2">{item.q}</h5>
                         <p className="text-[12px] text-slate-500 font-medium leading-relaxed">{item.a}</p>
                      </div>
                   ))}
                </div>
             </section>
          </div>

          <div className="pt-20 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">End of Roadmap Guide</p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-center items-center gap-6">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">Ready to begin your journey?</p>
           <button 
             onClick={onClose} 
             className="bg-slate-900 text-white px-12 py-4 rounded-xl font-black text-[11px] shadow-xl shadow-black/10 hover:bg-indigo-600 transition-all uppercase tracking-[0.2em] hover:scale-105 active:scale-95"
           >
             Initialize Workspace
           </button>
        </div>
      </motion.div>
    </div>
  );
}
