'use client';
import { motion } from 'framer-motion';

export default function ProjectImplementationGuide({ onClose }) {
  const steps = [
    { id: 1, title: "Select Any 4 Projects", desc: "Go to the Projects Section and choose any four projects based on your enrolled domain!", icon: "task_alt" },
    { id: 2, title: "Understand & Work", desc: "Carefully read requirements. Follow category-specific guidelines for your domain.", icon: "psychology" },
    { id: 3, title: "Submission & Certificate", desc: "After 4 submissions and duration completion, receive your official certificates.", icon: "card_membership" },
    { id: 4, title: "Keep Learning More", desc: "Continue with placement materials, resume building, aptitude and career guidance.", icon: "rocket_launch" }
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
              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Step-by-Step Implementation Guide 🚀</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center border border-slate-100">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-slate-50/20">

          {/* 🚨 IMPORTANT NOTE – FIRST PRIORITY */}
          <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl md:rounded-3xl p-5 md:p-7 flex items-start gap-4 shadow-md shadow-indigo-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
              <span className="material-symbols-outlined text-2xl">info</span>
            </div>
            <div className="relative z-10 flex-1">
              <h4 className="text-[14px] md:text-[16px] font-black text-indigo-900 uppercase tracking-tight mb-2 flex flex-wrap items-center gap-2">
                📋 Important Project Note
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[8px] tracking-widest font-black uppercase">Guidance</span>
              </h4>
              <p className="text-[13px] md:text-[14px] text-indigo-800/90 font-semibold leading-relaxed">
                We have just provided the <span className="font-black underline underline-offset-4 decoration-2 decoration-indigo-300">title of the project</span>. The complete development approach is up to you — whether you build it as a <span className="font-black">basic, intermediate, or advanced-level project</span>, everything is acceptable.
              </p>
            </div>
          </div>

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

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4 whitespace-nowrap">Domain Guidelines</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          {/* Step 1 */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-[11px] font-black">01</div>
              <h4 className="font-black text-slate-900 uppercase text-sm md:text-base italic tracking-tight">Step – 1 : Select Any 4 Projects</h4>
            </div>
            <p className="text-[13px] md:text-[14px] text-slate-600 font-medium leading-relaxed">
              Go to the <span className="font-black text-indigo-600">Projects Section</span> and choose <span className="font-black text-slate-900">any four projects</span> based on your enrolled domain!
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-[11px] font-black">02</div>
              <h4 className="font-black text-slate-900 uppercase text-sm md:text-base italic tracking-tight">Step – 2 : Understand the Project & Start Working</h4>
            </div>
            <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Carefully read and understand the project requirements before starting.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Technical */}
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-lg">terminal</span></div>
                  <h5 className="font-black text-emerald-800 text-xs uppercase tracking-tight">✅ Technical / Coding Projects</h5>
                </div>
                <ul className="space-y-2">
                  {[
                    'Create the complete project code properly',
                    'Add comments in your code for better understanding',
                    'Organize all files neatly in folders',
                    'Upload entire project to GitHub repository',
                    'Submit the GitHub project link to us',
                    'For each project, create a unique GitHub repository'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[11px] text-emerald-900 font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-emerald-500 text-sm shrink-0 mt-0.5">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-white rounded-xl p-4 border border-emerald-100 space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Include in README file:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Intern ID', 'Full Name', 'No. of Weeks', 'Project Name', 'Project Scope'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded text-[8px] font-black text-emerald-700 uppercase tracking-tighter">{tag}</span>
                    ))}
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Also include:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Source Code', 'README File', 'Screenshots', 'Output Images', 'Documentation'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[8px] font-black text-slate-500 uppercase tracking-tighter">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Non-IT */}
              <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-rose-600 text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-lg">brush</span></div>
                  <h5 className="font-black text-rose-800 text-xs uppercase tracking-tight">✅ Non-IT / Creative / Design Projects</h5>
                </div>
                <p className="text-[11px] text-rose-900 font-medium leading-relaxed">Create project-related:</p>
                <ul className="space-y-2">
                  {['Images', 'Posters', 'Visuals', 'Presentations', 'Datasets', 'Research Materials', 'UI Designs', 'Reports'].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[11px] text-rose-900 font-medium leading-relaxed">
                      <span className="material-symbols-outlined text-rose-500 text-sm shrink-0 mt-0.5">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-rose-800 font-semibold leading-relaxed">Upload all files to GitHub and submit the repository link.</p>
              </div>

              {/* Data Science */}
              <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center"><span className="material-symbols-outlined text-lg">analytics</span></div>
                  <h5 className="font-black text-indigo-800 text-xs uppercase tracking-tight">✅ Data Science & Analytics</h5>
                </div>
                <p className="text-[11px] text-indigo-900 font-medium">You can use <span className="font-black">dummy datasets</span> or public datasets.</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Perform:</p>
                <ul className="space-y-2">
                  {['Data Cleaning', 'Visualization', 'Analysis', 'Prediction Models', 'Dashboard Creation'].map((item, i) => (
                    <li key={i} className="flex gap-2 text-[11px] text-indigo-900 font-medium">
                      <span className="material-symbols-outlined text-indigo-500 text-sm shrink-0 mt-0.5">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="bg-white rounded-xl p-4 border border-indigo-100 space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended Sources:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Kaggle', 'Govt Open Data', 'Public CSV'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded text-[8px] font-black text-indigo-600 uppercase">{tag}</span>
                    ))}
                  </div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Also upload:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Dataset Files', 'Notebook/Code', 'Graphs & Charts', 'Output Screenshots', 'Documentation'].map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[8px] font-black text-slate-500 uppercase">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-indigo-600 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-[11px] font-black">03</div>
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">Step – 3 : Wait for Internship Completion</h4>
                </div>
                <p className="text-white/70 text-[13px] md:text-sm font-medium leading-relaxed max-w-lg">
                  After successfully completing your internship duration and project submissions:
                </p>
                <div className="space-y-2">
                  <p className="text-indigo-200 font-black text-[12px] uppercase tracking-widest">🎓 You will receive:</p>
                  {['Internship Completion Certificate', 'Project Completion Recognition', 'Experience Benefits'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px] text-white/80 font-medium">
                      <span className="material-symbols-outlined text-indigo-200 text-sm">star</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 shrink-0">
                {['Internship\nCertificate', 'Project\nRecognition', 'Experience\nBenefits', 'Career\nGrowth'].map(tag => (
                  <div key={tag} className="p-4 bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-indigo-200">card_membership</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-80 text-center whitespace-pre-line">{tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-[11px] font-black">04</div>
              <h4 className="font-black text-slate-900 uppercase text-sm md:text-base italic tracking-tight">Step – 4 : Keep Learning More 📚</h4>
            </div>
            <p className="text-[13px] text-slate-600 font-medium leading-relaxed">Don't stop with project submission. Continue learning through the platform modules:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Placement Materials', 'Domain Knowledge', 'Resume Building', 'Mock Interviews', 'Aptitude Practice', 'Communication Skills', 'Technical Preparation', 'Career Guidance'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="material-symbols-outlined text-indigo-500 text-sm shrink-0">check_circle</span>
                  <span className="text-[10px] md:text-[11px] font-bold text-slate-700 leading-tight">{item}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-slate-700 font-semibold leading-relaxed bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <span className="text-indigo-600 font-black">The more you practice and learn, the better your career opportunities become 🚀</span>
            </p>
          </div>

          {/* Important Note Final */}
          <div className="bg-slate-900 rounded-[2rem] p-7 md:p-10 text-white space-y-5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/20 rounded-full blur-[60px]"></div>
            <div className="relative z-10">
              <h4 className="text-lg md:text-2xl font-black uppercase tracking-tight italic mb-5">Important Note ✅</h4>
              <ul className="space-y-3">
                {[
                  'Maintain proper GitHub repositories',
                  'Submit projects before deadlines',
                  'Ensure your work is original and properly structured',
                  'Keep learning consistently throughout the internship'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[13px] text-white/80 font-medium items-start">
                    <span className="material-symbols-outlined text-indigo-400 text-sm shrink-0 mt-0.5">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pb-6">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] italic">✨ Learn • Build • Upload • Grow with CODTECH</p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 md:p-8 border-t border-slate-100 bg-white flex justify-center items-center gap-6 shrink-0">
          <button
            onClick={onClose}
            className="bg-slate-900 text-white px-16 py-4 rounded-xl font-black text-[11px] shadow-xl shadow-black/10 hover:bg-indigo-600 transition-all uppercase tracking-[0.2em] hover:scale-105 active:scale-95"
          >
            I Understand &amp; Start
          </button>
        </div>
      </motion.div>
    </div>
  );
}
