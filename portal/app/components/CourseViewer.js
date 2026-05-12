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
    
    // Simple parser for code blocks and headings
    const lines = content.split('\n');
    let inCodeBlock = false;
    let codeLines = [];
    
    return lines.map((line, i) => {
      // Heading detection (e.g. "1. Introduction" or "Concept:")
      if (!inCodeBlock && (line.match(/^\d+\./) || line.endsWith(':'))) {
        return <h3 key={i} className="text-lg font-black text-slate-900 mt-8 mb-4 uppercase tracking-tight">{line}</h3>;
      }
      
      // Code block detection (heuristic: lines with lots of symbols or specific keywords)
      const isCode = line.includes('function') || line.includes('const ') || line.includes('import ') || line.includes('var ') || line.includes('let ') || line.includes('=>') || line.includes('{') || line.includes('}');
      
      if (isCode && !inCodeBlock) {
        inCodeBlock = true;
        codeLines = [line];
        return null;
      } else if (inCodeBlock && isCode) {
        codeLines.push(line);
        return null;
      } else if (inCodeBlock && !isCode && line.trim() !== '') {
        const code = codeLines.join('\n');
        inCodeBlock = false;
        codeLines = [];
        return (
          <div key={`code-${i}`} className="bg-slate-900 rounded-2xl my-6 overflow-hidden border border-slate-800 shadow-xl">
             <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/50 border-b border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20"></div>
                <span className="text-[10px] font-mono text-slate-500 ml-2 uppercase tracking-widest">Source Snippet</span>
             </div>
             <pre className="p-6 text-[13px] text-emerald-400 font-mono leading-relaxed overflow-x-auto">
                <code>{code}</code>
             </pre>
          </div>
        );
      }
      
      return <p key={i} className="text-[14px] text-slate-600 leading-relaxed mb-4 font-medium">{line}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex bg-white">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30"
      >
        <div className="p-8 border-b border-slate-100 bg-white">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-all mb-6"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
          </button>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10">
                <span className="material-symbols-outlined text-xl">auto_stories</span>
             </div>
             <div>
                <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-tight">{selectedModule.title}</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedModule.lessons.length} Modules</p>
             </div>
          </div>
        </div>

        <div className="p-4 border-b border-slate-100 bg-white/50">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search lessons..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/50 border border-transparent focus:border-primary/20 rounded-xl pl-9 pr-4 py-2.5 text-[12px] font-medium transition-all"
              />
           </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {filteredLessons.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-start gap-4 group relative overflow-hidden ${
                selectedLesson?.id === lesson.id 
                ? 'bg-white border border-primary/10 shadow-lg shadow-indigo-100/50 text-primary' 
                : 'text-slate-500 hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 transition-all ${
                selectedLesson?.id === lesson.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[12px] font-black tracking-tight leading-snug uppercase">{lesson.title}</h4>
                    {completedLessons.includes(lesson.id) && (
                       <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
                    )}
                 </div>
                 <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${selectedLesson?.id === lesson.id ? 'text-primary/60' : 'text-slate-300'}`}>
                    {lesson.content?.slice(0, 40)}...
                 </p>
              </div>
              {selectedLesson?.id === lesson.id && (
                <motion.div layoutId="nav-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 bg-white border-t border-slate-100">
           <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                 <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Progress</p>
                 <p className="text-[12px] font-bold text-emerald-600">
                    {Math.round((selectedModule.lessons.filter(l => completedLessons.includes(l.id)).length / selectedModule.lessons.length) * 100)}% Complete
                 </p>
              </div>
           </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 border-b border-slate-100 flex items-center justify-between px-10 bg-white/80 backdrop-blur-md z-10">
           <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-10 h-10 rounded-xl hover:bg-slate-50 text-slate-400 flex items-center justify-center transition-all">
                 <span className="material-symbols-outlined">{isSidebarOpen ? 'menu_open' : 'menu'}</span>
              </button>
              <div className="h-6 w-[1px] bg-slate-100 mx-2"></div>
              <h1 className="text-sm font-black text-slate-900 tracking-tight uppercase">{selectedLesson?.title || 'Learning Content'}</h1>
           </div>
           <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                 <span className="material-symbols-outlined text-sm">bookmark</span> Save
              </button>
              <button 
                onClick={() => onToggleLesson(selectedLesson.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  completedLessons.includes(selectedLesson?.id)
                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-100'
                  : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95'
                }`}
              >
                 <span className="material-symbols-outlined text-sm">{completedLessons.includes(selectedLesson?.id) ? 'check_circle' : 'circle'}</span>
                 {completedLessons.includes(selectedLesson?.id) ? 'Completed' : 'Mark as Done'}
              </button>
           </div>
        </header>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto bg-white">
           <div className="max-w-4xl mx-auto py-20 px-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedLesson?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-12">
                     <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Module Lesson</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">12 min read</span>
                     </div>
                     <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6 uppercase">
                        {selectedLesson?.title}
                     </h1>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary font-black text-[10px]">CT</div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">CodTech Education Team • Updated Today</p>
                     </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                     {renderContent(selectedLesson?.content)}
                  </div>

                  {/* Navigation Footer */}
                  <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
                     <button 
                        disabled={selectedModule.lessons.indexOf(selectedLesson) === 0}
                        onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) - 1])}
                        className="flex items-center gap-4 group disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                        <div className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-primary group-hover:text-primary transition-all">
                           <span className="material-symbols-outlined">west</span>
                        </div>
                        <div className="text-left">
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Previous Module</p>
                           <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">Previous Lesson</p>
                        </div>
                     </button>

                     <button 
                        disabled={selectedModule.lessons.indexOf(selectedLesson) === selectedModule.lessons.length - 1}
                        onClick={() => setSelectedLesson(selectedModule.lessons[selectedModule.lessons.indexOf(selectedLesson) + 1])}
                        className="flex items-center gap-4 group text-right disabled:opacity-30 disabled:cursor-not-allowed"
                     >
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Next Up</p>
                           <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">Next Lesson</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-primary transition-all shadow-xl shadow-black/10">
                           <span className="material-symbols-outlined">east</span>
                        </div>
                     </button>
                  </div>
                </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </main>
    </div>
  );
}
