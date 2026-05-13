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
        return <h3 key={i} className="text-lg font-black text-slate-900 mt-6 mb-3 uppercase tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-5 bg-indigo-600 rounded-full"></span>
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
                   <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold">Implementation Detail</span>
             </div>
             <pre className="p-6 text-[13px] text-[#E6EDF3] font-mono leading-relaxed overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <code>{code}</code>
             </pre>
          </div>
        );
      }

      // Bullet points
      if (!inCodeBlock && (line.startsWith('-') || line.startsWith('*'))) {
        return <div key={i} className="flex gap-3 mb-2 ml-1 group">
          <div className="mt-2 w-1 h-1 rounded-full bg-indigo-400 shrink-0 group-hover:scale-150 transition-all"></div>
          <p className="text-[14px] text-slate-600 font-medium leading-relaxed">{line.substring(1).trim()}</p>
        </div>;
      }
      
      if (line.trim() === '') return <div key={i} className="h-4"></div>;

      return <p key={i} className="text-[14px] text-slate-600 leading-relaxed mb-4 font-medium selection:bg-indigo-100 selection:text-indigo-900">{line}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex bg-white overflow-hidden">
      {/* Sidebar Navigation */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[160]"
            />
            <motion.aside 
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed lg:relative top-0 left-0 w-[280px] md:w-80 border-r border-slate-100 flex flex-col bg-white lg:bg-slate-50/50 z-[170] lg:z-20 h-full shadow-2xl lg:shadow-none"
            >
        <div className="p-6 border-b border-slate-100 bg-white">
          <button 
            onClick={onClose}
            className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-indigo-600 transition-all mb-6 group"
          >
            <div className="w-8 h-8 rounded-xl border border-slate-100 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all">
               <span className="material-symbols-outlined text-xs">west</span>
            </div>
            Back
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
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-3 group relative overflow-hidden ${
                selectedLesson?.id === lesson.id 
                ? 'bg-white border border-indigo-100 shadow-lg shadow-indigo-100/30 text-indigo-600' 
                : 'text-slate-500 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
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

        <div className="p-6 bg-white border-t border-slate-100">
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
          </motion.aside>
        </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-white">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-4 md:px-8 bg-white/90 backdrop-blur-xl z-10 shrink-0">
           <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 flex items-center justify-center transition-all border border-slate-100 shrink-0">
                 <span className="material-symbols-outlined text-lg">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
              </button>
              <div className="truncate">
                 <h1 className="text-[13px] md:text-[15px] font-black text-slate-900 tracking-tight uppercase leading-tight truncate">{selectedLesson?.title || 'Course Content'}</h1>
                 <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5 truncate">{selectedModule.title}</p>
              </div>
           </div>
           <div className="flex items-center gap-2 md:gap-3 ml-2">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                 <span className="material-symbols-outlined text-xs">bookmark</span> Save
              </button>
              <button 
                onClick={() => onToggleLesson(selectedLesson.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg md:rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.1em] transition-all shadow-lg md:shadow-xl shrink-0 ${
                  completedLessons.includes(selectedLesson?.id)
                  ? 'bg-emerald-500 text-white shadow-emerald-100/50'
                  : 'bg-indigo-600 text-white shadow-indigo-200/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                 <span className="material-symbols-outlined text-[14px] md:text-xs">{completedLessons.includes(selectedLesson?.id) ? 'verified' : 'circle'}</span>
                 <span className="hidden xs:inline">{completedLessons.includes(selectedLesson?.id) ? 'Completed' : 'Complete Lesson'}</span>
                 <span className="xs:hidden">{completedLessons.includes(selectedLesson?.id) ? 'Done' : 'Done'}</span>
              </button>
           </div>
        </header>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto bg-white selection:bg-indigo-100">
           <div className="max-w-4xl mx-auto py-8 md:py-12 px-5 md:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedLesson?.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                >
                  <div className="mb-12">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="px-3 py-1 bg-indigo-50 text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em] rounded-full border border-indigo-100">Lesson Objective</div>
                        <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Module 01 • Part A</div>
                     </div>
                     <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-tight mb-6 uppercase italic italic-shorthand">
                        {selectedLesson?.title}
                     </h1>
                     <div className="flex flex-wrap gap-4 md:gap-6 py-6 border-y border-slate-50">
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <span className="material-symbols-outlined text-base">schedule</span>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Duration</p>
                              <p className="text-[10px] font-black text-slate-900 uppercase">12 Minutes</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                              <span className="material-symbols-outlined text-base">trending_up</span>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Difficulty</p>
                              <p className="text-[10px] font-black text-slate-900 uppercase">Beginner</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                           <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                              <span className="material-symbols-outlined text-base">workspace_premium</span>
                           </div>
                           <div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Domain</p>
                              <p className="text-[10px] font-black text-slate-900 uppercase">Intern Track</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="content-area">
                     {selectedLesson?.explanation ? (
                        <div className="space-y-8">
                           {/* Explanation */}
                           <section>
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                                    <span className="material-symbols-outlined text-lg">forum</span>
                                 </div>
                                 <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Teacher's Explanation</h4>
                              </div>
                              <p className="text-[15px] text-slate-600 leading-relaxed font-medium selection:bg-indigo-100 selection:text-indigo-900 bg-indigo-50/30 p-6 rounded-3xl border border-indigo-100/50">
                                 {selectedLesson.explanation}
                              </p>
                           </section>

                           {/* Code Example */}
                           {selectedLesson.example && (
                              <section>
                                 <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-50 text-indigo-600 rounded-xl flex items-center justify-center border border-slate-100">
                                       <span className="material-symbols-outlined text-lg">code_blocks</span>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Live Example</h4>
                                 </div>
                                 <div className="bg-[#0D1117] rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
                                    <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5">
                                       <div className="flex items-center gap-2">
                                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]"></div>
                                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
                                          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]"></div>
                                       </div>
                                       <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">java.main.impl</span>
                                    </div>
                                    <pre className="p-6 text-[13px] text-[#E6EDF3] font-mono leading-relaxed overflow-x-auto">
                                       <code>{selectedLesson.example}</code>
                                    </pre>
                                 </div>
                              </section>
                           )}

                           {/* Summary & Practice */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <section className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden group">
                                 <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                       <span className="material-symbols-outlined text-indigo-400 text-sm">auto_awesome</span>
                                       <h4 className="text-[11px] font-black uppercase tracking-widest">The Core Insight</h4>
                                    </div>
                                    <p className="text-[13px] text-slate-300 font-medium leading-relaxed italic">"{selectedLesson.summary}"</p>
                                 </div>
                              </section>

                              <section className="bg-indigo-600 p-6 rounded-3xl text-white relative overflow-hidden group">
                                 <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                       <span className="material-symbols-outlined text-white/60 text-sm">terminal</span>
                                       <h4 className="text-[11px] font-black uppercase tracking-widest">Practice Task</h4>
                                    </div>
                                    <p className="text-[13px] font-black leading-tight uppercase tracking-tight">{selectedLesson.practiceTask}</p>
                                 </div>
                                 <div className="absolute bottom-0 right-0 p-6 opacity-20">
                                    <span className="material-symbols-outlined text-4xl">edit_square</span>
                                 </div>
                              </section>
                           </div>
                        </div>
                     ) : (
                        renderContent(selectedLesson?.content)
                     )}
                  </div>

                  {/* Navigation Footer */}
                  <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center gap-4">
                     <button 
                        disabled={selectedModule.lessons.indexOf(selectedLesson) === 0}
                        onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) - 1])}
                        className="flex items-center gap-3 md:gap-4 group disabled:opacity-30 disabled:cursor-not-allowed text-left min-w-0"
                     >
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all bg-white shadow-sm shrink-0">
                           <span className="material-symbols-outlined text-lg">west</span>
                        </div>
                        <div className="min-w-0">
                           <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Previous</p>
                           <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors truncate">Go Back</p>
                        </div>
                     </button>

                     <button 
                        disabled={selectedModule.lessons.indexOf(selectedLesson) === selectedModule.lessons.length - 1}
                        onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) + 1])}
                        className="flex items-center gap-3 md:gap-4 group text-right disabled:opacity-30 disabled:cursor-not-allowed justify-end min-w-0"
                     >
                        <div className="min-w-0">
                           <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Up Next</p>
                           <p className="text-[10px] md:text-[11px] font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors truncate">Continue</p>
                        </div>
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-xl shadow-black/10 shrink-0">
                           <span className="material-symbols-outlined text-lg">east</span>
                        </div>
                     </button>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-20 pb-10 text-center">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">End of Lesson Content</p>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
