import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectImplementationGuide({ onClose }) {
  const steps = [
    {
      step: 'Step 1',
      title: 'Select Any 4 Projects',
      content: 'Go to the **Projects Section** and choose **any four projects** based on your enrolled domain!',
      icon: 'playlist_add_check'
    },
    {
      step: 'Step 2',
      title: 'Understand the Project & Start Working',
      content: 'Carefully read and understand the project requirements before starting.',
      subSections: [
        {
          title: '✅ For Technical / Coding Projects',
          points: [
            'Create the complete project code properly.',
            'Add **comments** in your code for better understanding.',
            'Organize all files neatly in folders.',
            'Upload the entire project to your GitHub repository.',
            'Submit the GitHub project link to us (Unique repo for each project).'
          ],
          includes: ['Source Code', 'README File', 'Screenshots', 'Output Images', 'Documentation']
        },
        {
          title: '✅ For Non-IT / Creative / Design Projects',
          desc: 'Create project-related visuals and documentation.',
          points: ['Images, Posters, Visuals', 'Presentations, Datasets', 'Research Materials', 'UI Designs, Reports']
        },
        {
          title: '✅ For Data Science & Analytics Projects',
          desc: 'Use dummy or public datasets (Kaggle, Gov Data).',
          points: ['Data Cleaning & Visualization', 'Analysis & Prediction Models', 'Dashboard Creation'],
          includes: ['Dataset Files', 'Jupyter Notebook / Code', 'Graphs & Charts', 'Final Output Screenshots']
        }
      ],
      readmeRequirements: ['InternID & Full Name', 'Number of Weeks', 'Project Name', 'Project Scope'],
      icon: 'engineering'
    },
    {
      step: 'Step 3',
      title: 'Wait for Internship Completion',
      content: 'After completing your duration and submissions, you will receive your certification and recognition.',
      icon: 'workspace_premium'
    },
    {
      step: 'Step 4',
      title: 'Keep Learning More 📚',
      content: 'Continue learning through platform modules like Placement Materials, Resume Building, and Mock Interviews.',
      icon: 'school'
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-10 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }} 
        className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200/60"
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">How to Do Projects</h2>
            <p className="text-[13px] text-slate-400 font-medium mt-1 uppercase tracking-widest">Step-by-Step Internship Guide 🚀</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:text-red-500 hover:bg-red-50 transition-all border border-slate-200/60"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {steps.map((step, idx) => (
            <section key={idx} className="relative">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                  <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">{step.step}</span>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{step.title}</h3>
                    <p className="text-slate-500 mt-2 text-[14px] leading-relaxed font-medium">{step.content}</p>
                  </div>

                  {step.subSections && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                      {step.subSections.map((sub, sIdx) => (
                        <div key={sIdx} className="bg-slate-50 rounded-[2rem] p-6 border border-slate-200/60 hover:border-primary/20 transition-all">
                          <h4 className="font-bold text-slate-900 text-sm mb-4 uppercase tracking-tight">{sub.title}</h4>
                          {sub.desc && <p className="text-[12px] text-slate-500 mb-4 font-medium italic">{sub.desc}</p>}
                          <ul className="space-y-3">
                            {sub.points.map((p, pIdx) => (
                              <li key={pIdx} className="flex gap-3 text-[12px] text-slate-600 font-medium leading-relaxed">
                                <span className="text-primary mt-1 select-none">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                          {sub.includes && (
                            <div className="mt-6 flex flex-wrap gap-2">
                              {sub.includes.map((inc, iIdx) => (
                                <span key={iIdx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-400 uppercase tracking-widest">{inc}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* README Requirements */}
                      <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 lg:col-span-2">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 bg-white text-primary rounded-xl flex items-center justify-center shadow-sm border border-primary/10">
                            <span className="material-symbols-outlined text-lg">description</span>
                          </div>
                          <h4 className="font-bold text-primary text-[13px] uppercase tracking-widest">Mandatory README Requirements</h4>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {step.readmeRequirements.map((req, rIdx) => (
                            <div key={rIdx} className="bg-white p-4 rounded-2xl border border-primary/5 text-center">
                              <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight leading-tight">{req}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className="absolute left-7 top-14 bottom-[-48px] w-px bg-slate-100 hidden md:block"></div>
              )}
            </section>
          ))}

          {/* Important Note */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <span className="material-symbols-outlined text-[120px]">verified</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-6 uppercase tracking-widest flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                Important Note
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ul className="space-y-4">
                  <li className="flex gap-4 text-sm font-medium text-slate-300">
                    <span className="text-emerald-400">•</span> Maintain proper GitHub repositories.
                  </li>
                  <li className="flex gap-4 text-sm font-medium text-slate-300">
                    <span className="text-emerald-400">•</span> Submit projects before deadlines.
                  </li>
                </ul>
                <ul className="space-y-4">
                  <li className="flex gap-4 text-sm font-medium text-slate-300">
                    <span className="text-emerald-400">•</span> Ensure work is original and structured.
                  </li>
                  <li className="flex gap-4 text-sm font-medium text-slate-300">
                    <span className="text-emerald-400">•</span> Learn consistently throughout.
                  </li>
                </ul>
              </div>
              <p className="mt-12 text-center text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Learn • Build • Upload • Grow with CODTECH</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 bg-white flex justify-center">
          <button 
            onClick={onClose} 
            className="bg-primary text-white px-16 py-4 rounded-2xl font-bold text-[12px] shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Building
          </button>
        </div>
      </motion.div>
    </div>
  );
}
