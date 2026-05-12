'use client';
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonViewer({ selectedModule, selectedLesson, setSelectedLesson, setSelectedModule }) {
  if (!selectedModule) return null;

  let structuredContent = null;
  if (selectedLesson) {
    try {
      structuredContent = JSON.parse(selectedLesson.content);
    } catch (e) {
      if (selectedLesson.explanation) {
        structuredContent = {
          simpleExplanation: selectedLesson.explanation,
          example: selectedLesson.example,
          summary: selectedLesson.summary,
          practiceTask: selectedLesson.practiceTask
        };
      }
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 lg:p-10 bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="bg-white w-full h-full lg:max-w-6xl lg:rounded-[48px] shadow-2xl flex overflow-hidden border border-slate-200/60"
        >
          {/* Sidebar */}
          <div className="w-72 bg-slate-50/50 border-r border-slate-200/60 flex-col hidden lg:flex">
            <div className="p-6 border-b border-slate-100 bg-white">
              <button
                onClick={() => { setSelectedModule(null); setSelectedLesson(null); }}
                className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-all mb-3"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span> Back
              </button>
              <h5 className="font-bold text-slate-900 text-sm tracking-tight uppercase leading-tight">{selectedModule.title}</h5>
              <p className="text-[11px] text-slate-400 mt-1">{selectedModule.lessons.length} lessons</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {selectedModule.lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${
                    selectedLesson?.id === lesson.id
                      ? 'bg-white border border-primary/10 shadow-sm text-primary'
                      : 'text-slate-500 hover:bg-white/60'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    selectedLesson?.id === lesson.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                  }`}>{i + 1}</div>
                  <span className="text-[12px] font-bold tracking-tight leading-tight">{lesson.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Mobile header */}
            <div className="p-4 flex justify-between items-center border-b border-slate-100 lg:hidden">
              <button onClick={() => { setSelectedModule(null); setSelectedLesson(null); }} className="material-symbols-outlined text-slate-500">arrow_back</button>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate mx-4">{selectedModule.title}</span>
              <div className="w-6" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 lg:p-16">
              {selectedLesson ? (
                <div className="max-w-2xl mx-auto space-y-8">
                  {/* Header */}
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2 block">{selectedModule.title}</span>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{selectedLesson.title}</h2>
                  </div>

                  {/* Structured Content Block */}
                  {structuredContent ? (
                    <div className="space-y-8">
                      {/* Simple Explanation */}
                      {structuredContent.simpleExplanation && (
                        <div className="prose prose-slate max-w-none">
                          <p className="text-slate-700 text-[15px] leading-relaxed">{structuredContent.simpleExplanation}</p>
                        </div>
                      )}

                      {/* Why It Matters */}
                      {structuredContent.whyItMatters && structuredContent.whyItMatters.length > 0 && (
                        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6">
                          <h6 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">psychology</span> Why It Matters
                          </h6>
                          <ul className="space-y-3">
                            {structuredContent.whyItMatters.map((point, i) => (
                              <li key={i} className="flex items-start gap-3 text-[13px] text-slate-700 font-medium leading-relaxed">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Code / Example */}
                      {structuredContent.example && (
                        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg shadow-slate-900/10">
                          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <span className="text-[10px] text-slate-500 font-mono ml-2 uppercase tracking-widest">Example Snippet</span>
                          </div>
                          <div className="p-6 overflow-x-auto">
                            <pre className="text-[13px] text-slate-100 font-mono leading-relaxed whitespace-pre-wrap">{structuredContent.example}</pre>
                          </div>
                        </div>
                      )}

                      {/* Summary & Practice */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {structuredContent.summary && (
                          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
                            <h6 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">bolt</span> Quick Summary
                            </h6>
                            <p className="text-[13px] text-slate-700 font-medium leading-relaxed">{structuredContent.summary}</p>
                          </div>
                        )}
                        {structuredContent.practiceTask && (
                          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5">
                            <h6 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <span className="material-symbols-outlined text-sm">edit_note</span> Mini Practice
                            </h6>
                            <p className="text-[13px] text-slate-700 font-medium leading-relaxed">{structuredContent.practiceTask}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Fallback Raw Content Block */
                    <div className="bg-slate-900 rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <span className="text-[10px] text-slate-500 font-mono ml-2 uppercase tracking-widest">lesson content</span>
                      </div>
                      <div className="p-6 overflow-x-auto">
                        <pre className="text-sm text-slate-100 font-mono leading-relaxed whitespace-pre-wrap">{selectedLesson.content}</pre>
                      </div>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {selectedLesson.keyPoints && selectedLesson.keyPoints.length > 0 && (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
                      <h6 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">lightbulb</span> Key Takeaways
                      </h6>
                      <ul className="space-y-3">
                        {selectedLesson.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-3 text-[13px] text-slate-700 font-medium leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        const idx = selectedModule.lessons.findIndex(l => l.id === selectedLesson.id);
                        if (idx > 0) setSelectedLesson(selectedModule.lessons[idx - 1]);
                      }}
                      className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">west</span> Previous
                    </button>
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-md hover:scale-105 transition-all">
                      Mark Complete
                    </button>
                    <button
                      onClick={() => {
                        const idx = selectedModule.lessons.findIndex(l => l.id === selectedLesson.id);
                        if (idx < selectedModule.lessons.length - 1) setSelectedLesson(selectedModule.lessons[idx + 1]);
                      }}
                      className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-all"
                    >
                      Next <span className="material-symbols-outlined text-sm">east</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl">auto_stories</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Select a lesson</h4>
                  <p className="text-[13px] text-slate-400 font-medium max-w-xs">
                    Pick a topic from the sidebar to begin learning {selectedModule.title}.
                  </p>
                  {selectedModule.lessons.length > 0 && (
                    <button
                      onClick={() => setSelectedLesson(selectedModule.lessons[0])}
                      className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-md hover:scale-105 transition-all"
                    >
                      Start First Lesson
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
