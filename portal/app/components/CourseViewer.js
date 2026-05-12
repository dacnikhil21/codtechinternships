'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseViewer({ selectedModule, completedLessons = [], onToggleLesson, onClose }) {
  const [selectedLesson, setSelectedLesson] = useState(selectedModule?.lessons[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredLessons = selectedModule.lessons.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedModule?.lessons.length > 0) {
      setSelectedLesson(selectedModule.lessons[0]);
    }
  }, [selectedModule]);

  const renderContent = (content) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeLines = [];
    
    return lines.map((line, i) => {
      // Heading detection
      if (!inCodeBlock && (line.match(/^\d+\./) || line.startsWith('###') || line.endsWith(':'))) {
        return <h3 key={i} className="text-xl font-black text-slate-900 mt-10 mb-5 uppercase tracking-tight flex items-center gap-3">
          <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
          {line.replace('###', '')}
        </h3>;
      }
      
      // Code block detection
      const isCodeLine = line.includes('function') || line.includes('const ') || line.includes('import ') || 
                        line.includes('var ') || line.includes('let ') || line.includes('=>') || 
                        line.includes('{') || line.includes('}') || line.includes('console.log') ||
                        line.includes('class ') || line.includes('public static void');
      
      if (isCodeLine && !inCodeBlock) {
        inCodeBlock = true;
        codeLines = [line];
        return null;
      } else if (inCodeBlock && isCodeLine) {
        codeLines.push(line);
        return null;
      } else if (inCodeBlock && !isCodeLine && line.trim() !== '') {
        const code = codeLines.join('\n');
        inCodeBlock = false;
        codeLines = [];
        return (
          <div key={`code-${i}`} className="bg-[#0D1117] rounded-3xl my-8 overflow-hidden border border-slate-800 shadow-2xl">
             <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                   <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                   <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold">Implementation Detail</span>
             </div>
             <pre className="p-8 text-[14px] text-[#E6EDF3] font-mono leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <code>{code}</code>
             </pre>
          </div>
        );
      }

      // Bullet points
      if (!inCodeBlock && (line.startsWith('-') || line.startsWith('*'))) {
        return <div key={i} className="flex gap-4 mb-3 ml-2 group">
          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 group-hover:scale-150 transition-all"></div>
          <p className="text-[15px] text-slate-600 font-medium leading-relaxed">{line.substring(1).trim()}</p>
        </div>;
      }
      
      if (line.trim() === '') return <div key={i} className="h-4"></div>;

      return <p key={i} className="text-[15px] text-slate-600 leading-relaxed mb-6 font-medium selection:bg-indigo-100 selection:text-indigo-900">{line}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex bg-white overflow-hidden">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -320 }}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
        className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 relative z-20 h-full"
      >
        <div className="p-8 border-b border-slate-100 bg-white">
          <button 
            onClick={onClose}
            className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-indigo-600 transition-all mb-8 group"
          >
            <div className="w-8 h-8 rounded-xl border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
               <span className="material-symbols-outlined text-sm">west</span>
            </div>
            Back to Dashboard
          </button>
          
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">In Progress</span>
             </div>
             <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-tight">{selectedModule.title}</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">{selectedModule.lessons.length} Learning Steps</p>
             </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 bg-white/40">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search curriculum..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/50 border border-transparent focus:border-indigo-500/20 rounded-2xl pl-11 pr-4 py-3 text-[13px] font-medium transition-all outline-none"
              />
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredLessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={`w-full text-left p-5 rounded-[2rem] transition-all flex items-start gap-4 group relative overflow-hidden ${
                selectedLesson?.id === lesson.id 
                ? 'bg-white border border-indigo-100 shadow-xl shadow-indigo-100/40 text-indigo-600' 
                : 'text-slate-500 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 transition-all ${
                selectedLesson?.id === lesson.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="text-[13px] font-black tracking-tight leading-snug uppercase line-clamp-1">{lesson.title}</h4>
                    {completedLessons.includes(lesson.id) && (
                       <span className="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span>
                    )}
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">⏱ 12 MIN</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300">BEGINNER</span>
                 </div>
              </div>
              {selectedLesson?.id === lesson.id && (
                <motion.div layoutId="nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 bg-white border-t border-slate-100">
           <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(selectedModule.lessons.filter(l => completedLessons.includes(l.id)).length / selectedModule.lessons.length) * 100}%` }}
                className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full"
              />
           </div>
           <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Progress</p>
              <p className="text-[11px] font-black text-indigo-600 uppercase tracking-tight">
                 {Math.round((selectedModule.lessons.filter(l => completedLessons.includes(l.id)).length / selectedModule.lessons.length) * 100)}%
              </p>
           </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
        {/* Top Header */}
        <header className="h-24 border-b border-slate-100 flex items-center justify-between px-12 bg-white/90 backdrop-blur-xl z-10">
           <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-12 h-12 rounded-[1.25rem] bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 flex items-center justify-center transition-all border border-slate-100">
                 <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
              </button>
              <div>
                 <h1 className="text-[15px] font-black text-slate-900 tracking-tight uppercase leading-tight">{selectedLesson?.title || 'Course Content'}</h1>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{selectedModule.title}</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                 <span className="material-symbols-outlined text-sm">bookmark</span> Save
              </button>
              <button 
                onClick={() => onToggleLesson(selectedLesson.id)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl ${
                  completedLessons.includes(selectedLesson?.id)
                  ? 'bg-emerald-500 text-white shadow-emerald-100/50'
                  : 'bg-indigo-600 text-white shadow-indigo-200/50 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                 <span className="material-symbols-outlined text-sm">{completedLessons.includes(selectedLesson?.id) ? 'verified' : 'circle'}</span>
                 {completedLessons.includes(selectedLesson?.id) ? 'Completed' : 'Complete Lesson'}
              </button>
           </div>
        </header>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto bg-white selection:bg-indigo-100">
           <div className="max-w-4xl mx-auto py-24 px-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedLesson?.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                >
                  <div className="mb-20">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="px-4 py-1.5 bg-indigo-50 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] rounded-full border border-indigo-100">Lesson Objective</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Module 01 • Part A</div>
                     </div>
                     <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-10 uppercase italic italic-shorthand">
                        {selectedLesson?.title}
                     </h1>
                     <div className="flex flex-wrap gap-8 py-8 border-y border-slate-50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <span className="material-symbols-outlined text-lg">schedule</span>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Duration</p>
                              <p className="text-[11px] font-black text-slate-900 uppercase">12 Minutes</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <span className="material-symbols-outlined text-lg">trending_up</span>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Difficulty</p>
                              <p className="text-[11px] font-black text-slate-900 uppercase">Beginner</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                              <span className="material-symbols-outlined text-lg">workspace_premium</span>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Domain</p>
                              <p className="text-[11px] font-black text-slate-900 uppercase">Internship Track</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="content-area">
                     {renderContent(selectedLesson?.content)}
                  </div>

                  {/* Summary Section - NEW */}
                  <div className="mt-20 p-10 bg-slate-50 rounded-[3rem] border border-slate-100">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                           <span className="material-symbols-outlined text-2xl">lightbulb</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Key Takeaways</h4>
                     </div>
                     <ul className="space-y-4">
                        {[
                           "Master the core concepts of this technical module",
                           "Understand the industry standard implementation patterns",
                           "Ready to apply these skills in your internship projects"
                        ].map((point, i) => (
                           <li key={i} className="flex items-start gap-4">
                              <span className="material-symbols-outlined text-emerald-500 mt-0.5">check_circle</span>
                              <p className="text-[14px] text-slate-600 font-medium">{point}</p>
                           </li>
                        ))}
                     </ul>
                  </div>

                  {/* Navigation Footer */}
                  <div className="mt-20 pt-12 border-t border-slate-100 flex justify-between items-center">
                     <button 
                        disabled={selectedModule.lessons.indexOf(selectedLesson) === 0}
                        onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) - 1])}
                        className="flex items-center gap-6 group disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                        <div className="w-14 h-14 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all bg-white shadow-sm">
                           <span className="material-symbols-outlined">west</span>
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Previous Lesson</p>
                           <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">Go Back</p>
                        </div>
                     </button>

                     <button 
                        disabled={selectedModule.lessons.indexOf(selectedLesson) === selectedModule.lessons.length - 1}
                        onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) + 1])}
                        className="flex items-center gap-6 group text-right disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Coming Up Next</p>
                           <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">Continue Learning</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-2xl shadow-black/20">
                           <span className="material-symbols-outlined">east</span>
                        </div>
                     </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-32 pb-10 text-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">End of Lesson Content</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
