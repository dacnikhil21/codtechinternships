import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectImplementationGuide({ onClose }) {
  const steps = [
    {
      step: 'Step 1',
      title: 'Project Selection',
      content: 'Navigate to the Projects section. You must select exactly 4 projects relevant to your domain (e.g., Python, MERN, Java).',
      icon: 'playlist_add_check'
    },
    {
      step: 'Step 2',
      title: 'Technical Implementation',
      content: 'Follow the technical requirements strictly. Ensure your code is clean, documented, and follows industry standards.',
      subSections: [
        {
          title: '✅ Coding Standards',
          points: [
            'Use descriptive variable and function names.',
            'Add meaningful comments explaining complex logic.',
            'Maintain a clean folder structure (e.g., src, docs, assets).',
            'Ensure the project is bug-free and runs successfully.'
          ],
          includes: ['Source Code', 'Comments', 'Modular Design']
        },
        {
          title: '✅ Documentation',
          points: [
            'Create a professional README.md file.',
            'Include installation instructions and dependencies.',
            'Add clear screenshots or output images.',
            'Define the project scope and key features.'
          ],
          includes: ['README.md', 'Screenshots', 'Documentation']
        }
      ],
      readmeRequirements: ['InternID & Full Name', 'Domain Name', 'Project Name', 'Project Scope'],
      icon: 'engineering'
    },
    {
      step: 'Step 3',
      title: 'GitHub Workflow',
      content: 'Create a unique repository for each project on your personal GitHub profile.',
      icon: 'account_tree'
    }
  ];

  const commonMistakes = [
    { title: 'Empty Repositories', desc: 'Submitting a link to an empty repository with no code.' },
    { title: 'Missing README', desc: 'Submitting code without the mandatory README information.' },
    { title: 'Incorrect URLs', desc: 'Submitting links to local files (C:/Users...) instead of GitHub.' },
    { title: 'Legacy Code', desc: 'Copying old projects without adding original value or comments.' }
  ];

  const faqs = [
    { q: 'Can I change my projects?', a: 'Yes, you can change your selection in the dashboard anytime before final submission.' },
    { q: 'How many projects are required?', a: 'Exactly 4 projects must be completed to qualify for the certificate.' },
    { q: 'What is the deadline?', a: 'All submissions must be completed before the last day of your internship duration.' }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 30 }} 
        className="bg-white w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.4)] relative z-10 flex flex-col overflow-hidden border border-white/10"
      >
        {/* Sticky Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Resource Center</span>
               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Success Roadmap</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none italic italic-shorthand">Project Execution <span className="text-indigo-600">& Submission</span></h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-14 h-14 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-12 space-y-20 selection:bg-indigo-100">
          
          {/* Main Steps */}
          <section className="space-y-16">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row gap-12">
                 <div className="lg:w-1/3">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200">
                          <span className="material-symbols-outlined">{step.icon}</span>
                       </div>
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">{step.step}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-tight mb-4">{step.title}</h3>
                    <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{step.content}</p>
                 </div>
                 
                 <div className="lg:w-2/3">
                    {step.subSections && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {step.subSections.map((sub, sIdx) => (
                          <div key={sIdx} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-indigo-200 transition-all group">
                            <h4 className="font-black text-slate-900 text-[13px] mb-6 uppercase tracking-widest flex items-center gap-3">
                               <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                               {sub.title}
                            </h4>
                            <ul className="space-y-4">
                              {sub.points.map((p, pIdx) => (
                                <li key={pIdx} className="flex gap-4 text-[13px] text-slate-500 font-medium leading-relaxed">
                                  <span className="material-symbols-outlined text-[16px] text-emerald-500 mt-0.5">check_circle</span>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        
                        <div className="md:col-span-2 bg-indigo-600 p-10 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                           <div className="absolute top-0 right-0 p-10 opacity-10">
                              <span className="material-symbols-outlined text-[100px]">description</span>
                           </div>
                           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-6 opacity-70">Mandatory README Headers</h4>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {step.readmeRequirements.map((req, rIdx) => (
                                <div key={rIdx} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
                                   <p className="text-[10px] font-black uppercase tracking-tight">{req}</p>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            ))}
          </section>

          {/* Submission Example - NEW */}
          <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                   <h4 className="text-3xl font-black tracking-tight uppercase mb-6 leading-tight">GitHub Submission <br/><span className="text-indigo-400">Process Example</span></h4>
                   <p className="text-slate-400 text-[14px] font-medium leading-relaxed mb-8">Follow this standard to ensure your project is accepted immediately by the review team.</p>
                   <div className="space-y-4">
                      {[
                        { step: '01', text: 'Create Repo: codtech-task-1' },
                        { step: '02', text: 'Push Source Code + Assets' },
                        { step: '03', text: 'Add Detailed README.md' },
                        { step: '04', text: 'Submit Public URL' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl">
                           <span className="text-indigo-400 font-black text-xs">{item.step}</span>
                           <p className="text-[12px] font-bold uppercase tracking-widest">{item.text}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10 font-mono text-[12px] text-emerald-400">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10">
             <section>
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100">
                      <span className="material-symbols-outlined">warning</span>
                   </div>
                   <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Common Pitfalls</h4>
                </div>
                <div className="space-y-6">
                   {commonMistakes.map((item, i) => (
                      <div key={i} className="flex gap-6 group">
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
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                      <span className="material-symbols-outlined">help</span>
                   </div>
                   <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Support & FAQs</h4>
                </div>
                <div className="space-y-6">
                   {faqs.map((item, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
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
        <div className="p-10 border-t border-slate-100 bg-white flex justify-center items-center gap-8">
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">Ready to begin your journey?</p>
           <button 
             onClick={onClose} 
             className="bg-slate-900 text-white px-20 py-5 rounded-[1.5rem] font-black text-[12px] shadow-2xl shadow-black/20 hover:bg-indigo-600 transition-all uppercase tracking-[0.3em] hover:scale-105 active:scale-95"
           >
             Initialize Workspace
           </button>
        </div>
      </motion.div>
    </div>
  );
}
