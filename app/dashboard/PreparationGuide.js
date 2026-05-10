import React from 'react';

export default function PreparationGuide({ courseTitle }) {
  // Domain Filtering Logic
  if (courseTitle !== 'React.js Web Development Intern') {
    return (
      <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
          <span className="material-symbols-outlined text-4xl text-blue-600">hourglass_empty</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Preparation Guide Coming Soon</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          We are currently updating the specialized preparation materials for the <span className="font-bold text-blue-600">{courseTitle}</span> track. Please check back later.
        </p>
      </div>
    );
  }

  // ReactJS Content
  return (
    <div className="col-span-full space-y-8 animate-in fade-in duration-500">
      
      <div className="bg-blue-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">ReactJS Preparation Guide</h2>
          <p className="text-white/80 text-sm">Master React, ace your interviews, and build stunning applications.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* SECTION 1: React Interview Questions */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">quiz</span>
              React Interview Questions
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {['React Basics', 'JSX', 'Components', 'Props vs State', 'Hooks', 'useEffect', 'Context API', 'React Router', 'API Calls', 'State Management'].map((tag) => (
                <span key={tag} className="bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-800 transition-all active:scale-95 shadow-md">
                View Questions
              </button>
              <button className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all active:scale-95">
                Practice Now
              </button>
            </div>
          </section>

          {/* SECTION 2: JavaScript Coding Challenges */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">code</span>
              JavaScript Coding Challenges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { title: 'Array Problems', diff: 'Easy' },
                { title: 'String Problems', diff: 'Easy' },
                { title: 'DOM Logic', diff: 'Medium' },
                { title: 'ES6 Challenges', diff: 'Medium' },
                { title: 'Async/Await', diff: 'Medium' },
                { title: 'API Challenges', diff: 'Medium' }
              ].map((challenge, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                  <span className="font-bold text-slate-800 text-sm">{challenge.title}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${challenge.diff === 'Easy' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {challenge.diff}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              <button className="bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-800 transition-all active:scale-95 shadow-md">
                Start Challenge
              </button>
              <button className="text-slate-500 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-95 border border-slate-200">
                View Hint
              </button>
            </div>
          </section>

          {/* SECTION 3: ReactJS Learning Roadmap */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">map</span>
              ReactJS Learning Roadmap
            </h3>
            <div className="space-y-4">
              {['HTML', 'CSS', 'JavaScript', 'ES6', 'React Basics', 'Components', 'Hooks', 'API Integration', 'Routing', 'State Management', 'Deployment'].map((step, idx) => {
                const isCompleted = idx < 5;
                const isCurrent = idx === 5;
                return (
                  <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isCurrent ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-700 text-white border-4 border-blue-100' : 'bg-slate-100 text-slate-400'}`}>
                      {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <span className={`text-sm font-bold ${isCurrent ? 'text-blue-700' : 'text-slate-700'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: React Internship Projects */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">rocket_launch</span>
              React Internship Projects
            </h3>
            <div className="space-y-4">
              {['SaaS Dashboard System', 'Internship Management Portal', 'Weather Application', 'Portfolio Website'].map((proj, idx) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-blue-200 hover:shadow-lg transition-all">
                  <h4 className="font-bold text-slate-900 mb-4">{proj}</h4>
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-100 transition-all">View Requirements</button>
                    <button className="bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-800 transition-all shadow-md">Continue Project</button>
                    <button className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all">Submit Task</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Side Column */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* SECTION 5: Resume Preparation */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Resume Preparation</h3>
            <ul className="space-y-3 mb-6">
              {['React developer resume tips', 'Portfolio checklist', 'GitHub optimization', 'ATS-friendly resume suggestions'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="material-symbols-outlined text-blue-600 text-sm mt-0.5">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-blue-700 text-white py-3 rounded-2xl font-bold text-xs hover:bg-blue-800 transition-all active:scale-95 shadow-md">
                View Tips
              </button>
              <button className="w-full bg-blue-50 text-blue-700 py-3 rounded-2xl font-bold text-xs hover:bg-blue-100 transition-all active:scale-95">
                Resume Checklist
              </button>
            </div>
          </section>

          {/* SECTION 6: Mock Interview Preparation */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Mock Interview Prep</h3>
            <ul className="space-y-3 mb-6">
              {['React technical interview', 'JavaScript questions', 'HR interview prep', 'Communication tips'].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="material-symbols-outlined text-amber-500 text-sm mt-0.5">star</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-amber-500 text-white py-3 rounded-2xl font-bold text-xs hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                Start Mock Interview
              </button>
              <button className="w-full text-slate-500 border border-slate-200 py-3 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-all active:scale-95">
                View Common Questions
              </button>
            </div>
          </section>

          {/* SECTION 7: Weekly Progress Tracker */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Weekly Progress Tracker</h3>
            <div className="space-y-5">
              {[
                { label: 'Weekly Progress', score: '85%', color: 'bg-blue-500' },
                { label: 'Coding Readiness', score: '70%', color: 'bg-emerald-500' },
                { label: 'Interview Readiness', score: '50%', color: 'bg-amber-500' },
                { label: 'Project Completion', score: '60%', color: 'bg-purple-500' },
                { label: 'Practice Score', score: '90%', color: 'bg-blue-700' }
              ].map((prog, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-wider">
                    <span className="text-slate-500">{prog.label}</span>
                    <span className="text-slate-800">{prog.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${prog.color} rounded-full transition-all duration-1000`} style={{ width: prog.score }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
