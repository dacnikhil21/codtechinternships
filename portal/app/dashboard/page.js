'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM, DEFAULT_MODULES } from '@/lib/curriculum';
import LessonViewer from '@/app/components/LessonViewer';
import PreparationGuide from '@/app/dashboard/PreparationGuide';
import ProjectImplementationGuide from '@/app/components/ProjectImplementationGuide';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Projects');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prepContent, setPrepContent] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [totalXP, setTotalXP] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Learning Portal States
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const getBadge = (xp) => {
    if (xp >= 3001) return { name: 'INTERVIEW READY', icon: 'verified', color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100/50' };
    if (xp >= 1501) return { name: 'ADVANCED', icon: 'grade', color: 'text-amber-600 bg-amber-50/50 border-amber-100/50' };
    if (xp >= 501) return { name: 'INTERMEDIATE', icon: 'military_tech', color: 'text-primary bg-primary/5 border-primary/10' };
    return { name: 'BEGINNER', icon: 'stadium', color: 'text-slate-500 bg-slate-50 border-slate-200/60' };
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`selected_projects_${user.id}`);
      if (saved) setSelectedProjects(JSON.parse(saved));
    }
  }, [user?.id]);

  const toggleProject = (projTitle) => {
    let updated;
    if (selectedProjects.includes(projTitle)) {
      updated = selectedProjects.filter(p => p !== projTitle);
    } else {
      if (selectedProjects.length >= 4) {
        toast.error('You can select maximum 4 projects');
        return;
      }
      updated = [...selectedProjects, projTitle];
    }
    setSelectedProjects(updated);
    if (user?.id) localStorage.setItem(`selected_projects_${user.id}`, JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/auth/me?v=${Date.now()}`);
        const userData = await userRes.json();
        if (userData && userData.success) {
          setUser(userData.data);
          const taskRes = await fetch(`/api/tasks?v=${Date.now()}`);
          const taskData = await taskRes.json();
          if (taskData.success) setTasks(taskData.data);
          const prepRes = await fetch('/api/prep');
          const prepData = await prepRes.json();
          if (prepData.success) setPrepContent(prepData.data);
          const matRes = await fetch('/api/materials');
          const matData = await matRes.json();
          if (matData.success) setMaterials(matData.data);
        } else { router.push('/login'); }
      } catch (err) { router.push('/login'); } finally { setLoading(false); }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      toast.success('Logged out successfully');
    } catch (err) { toast.error('Failed to log out'); }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!githubUrl.includes('github.com')) return toast.error('Please provide a valid GitHub repository URL');
    toast.loading('Submitting project...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Project submitted successfully!');
      setIsSubmitting(false);
      setGithubUrl('');
    }, 1500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex w-full font-inter overflow-x-hidden text-slate-900">
      
      {/* Sidebar - COMPACT & ALIGNED (Linear Style) */}
      <aside className={`w-60 bg-white border-r border-slate-200/60 flex flex-col fixed h-full z-[70] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/10">
              <span className="material-symbols-outlined text-white text-base" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <h1 className="text-slate-900 font-bold text-xs tracking-tight uppercase">Codtech Intern</h1>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {[
            { name: 'Projects', icon: 'grid_view' },
            { name: 'Materials', icon: 'menu_book' },
            { name: 'Preparation', icon: 'psychology' },
            { name: 'Placement Hub', icon: 'hub' },
            { name: 'Job Hunting', icon: 'work' },
            { name: 'Mock Interviews', icon: 'forum' },
            { name: 'Resume Building', icon: 'description' },
            { name: 'LinkedIn Profile', icon: 'person_search' },
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-semibold text-[12px] group ${activeTab === item.name ? 'bg-primary/5 text-primary shadow-sm border border-primary/10' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className={`material-symbols-outlined text-[18px] transition-colors ${activeTab === item.name ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary font-bold text-xs shadow-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[12px] font-bold text-slate-900 truncate leading-tight">{user?.name || 'Intern'}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate uppercase tracking-tight">{user?.course}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content - TIGHTER PADDING (Productive) */}
      <main className={`flex-1 transition-all lg:ml-60 p-5 lg:p-8 mt-16 lg:mt-0`}>
        
        {/* Header - REFINED & COMPACT */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
             <h2 className="text-sm font-bold text-slate-400 tracking-tight uppercase">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-2">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight border shadow-sm ${getBadge(user?.xp || 0).color}`}>
                <span className="material-symbols-outlined text-sm">{getBadge(user?.xp || 0).icon}</span>
                {getBadge(user?.xp || 0).name}
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight bg-white text-slate-700 border border-slate-200/60 shadow-sm">
                <span className="material-symbols-outlined text-sm text-emerald-500">verified</span>
                {user?.xp || 0} XP
             </div>
             <button className="bg-primary text-white px-4 py-1.5 rounded-lg font-bold text-[10px] tracking-tight uppercase shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
                Get Certified
             </button>
          </div>
        </header>

        {activeTab === 'Projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Greeting - CLEAN & PROFESSIONAL */}
            <div>
               <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">Welcome back, {user?.name?.split(' ')[0]} 👋</h3>
               <p className="text-[13px] text-slate-400 font-medium">You're currently in the <span className="text-primary font-bold">{user?.course} Intern</span> track.</p>
            </div>

            {/* Analytics & Orientation - TIGHTER DENSITY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm relative group overflow-hidden">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Career Readiness Score</h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">Based on your completed modules</p>
                  </div>
                  <div className="text-primary font-bold text-3xl">84<span className="text-xs text-slate-300 font-medium ml-1">/100</span></div>
                </div>
                <div className="flex items-end justify-between h-24 gap-2 relative z-10">
                   {[40, 55, 65, 80, 70, 85, 100].map((h, i) => (
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} key={i} className={`flex-1 rounded-lg transition-all ${i === 6 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/10'}`} />
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/15 flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10">
                   <h4 className="text-base font-bold tracking-tight mb-4">Tech Orientation</h4>
                   <div className="flex items-center gap-2.5 text-[12px] text-white/80 font-medium mb-6">
                      <span className="material-symbols-outlined text-sm">calendar_month</span>
                      Friday, 2:00 PM
                   </div>
                </div>
                <button className="w-full bg-white text-primary font-bold py-2.5 rounded-xl hover:shadow-lg transition-all text-[11px] uppercase tracking-widest relative z-10">Join Session</button>
              </div>
            </div>

            {/* PROJECT WORKSPACE - REFINED (Linear Structure) */}
            <section className="bg-white p-6 lg:p-8 rounded-[32px] border border-slate-200/60 shadow-sm">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                  <div className="flex items-center gap-4 text-left">
                     <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center border border-primary/10 shadow-sm">
                        <span className="material-symbols-outlined text-xl">rocket_launch</span>
                     </div>
                     <div>
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">Internship Project Workspace</h3>
                        <p className="text-[12px] text-slate-400 font-medium mt-0.5">Select and complete 4 major projects to finalize your internship.</p>
                     </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => setIsProjectModalOpen(true)} className="flex-1 md:flex-none bg-primary text-white px-5 py-2 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">add</span> View Projects
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 md:flex-none bg-slate-50 text-slate-600 border border-slate-200/60 px-5 py-2 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">help</span> How to Do
                    </button>
                  </div>
               </div>

               {selectedProjects.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -4 }} className="bg-white p-4 rounded-2xl border border-slate-200/60 group relative transition-all hover:shadow-lg hover:shadow-indigo-100/40">
                        <button onClick={() => toggleProject(proj)} className="absolute top-3 right-3 w-6 h-6 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center hover:text-red-500 transition-all z-10 border border-slate-100 opacity-0 group-hover:opacity-100">
                           <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                        <div className="w-9 h-9 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-4 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                           <span className="material-symbols-outlined text-[20px]">database</span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-[11px] mb-4 line-clamp-2 h-8 leading-tight tracking-tight uppercase">{proj}</h5>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-slate-50 text-primary border border-primary/10 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">Submit Link</button>
                      </motion.div>
                    ))}
                 </div>
               ) : (
                 <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center group">
                    <div className="w-10 h-10 bg-white text-slate-300 rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:text-primary transition-all">
                       <span className="material-symbols-outlined text-2xl">work_outline</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">No projects selected yet</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="text-primary font-bold text-[11px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">Browse Library <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {activeTab === 'Materials' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Materials Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-8">
               <div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-1 uppercase">{user?.course} Curriculum</h3>
                  <p className="text-[13px] text-slate-400 font-medium">Your personalized learning path for the internship.</p>
               </div>
               <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                  <div className="text-center px-4 border-r border-slate-100">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Modules</p>
                     <p className="text-lg font-black text-primary">{(materials.length > 0 ? materials : DEFAULT_MODULES).length}</p>
                  </div>
                  <div className="text-center px-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Progress</p>
                     <p className="text-lg font-black text-emerald-500">0%</p>
                  </div>
               </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {(materials.length > 0 ? materials : DEFAULT_MODULES).map((mod, idx) => (
                 <motion.div 
                   key={mod.id} 
                   whileHover={{ y: -4 }}
                   onClick={() => setSelectedModule(mod)}
                   className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 transition-all cursor-pointer group"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                          <span className="material-symbols-outlined text-xl">import_contacts</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{mod.difficulty}</span>
                          <span className="text-[10px] font-bold text-primary mt-1">{mod.time}</span>
                       </div>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 tracking-tight mb-2 group-hover:text-primary transition-colors">{mod.title}</h4>
                    <p className="text-[12px] text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2">{mod.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{mod.lessons.length} Lessons</span>
                       <button className="text-primary font-bold text-[11px] uppercase tracking-widest flex items-center gap-1">Start <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
                    </div>
                 </motion.div>
               ))}
            </div>

            {selectedModule && (
              <LessonViewer
                selectedModule={selectedModule}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
                setSelectedModule={setSelectedModule}
              />
            )}
          </motion.div>
        )}

        {activeTab === 'Preparation' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <PreparationGuide 
              courseTitle={user?.course} 
              prepContent={prepContent} 
              onView={(item) => {
                setSelectedModule({
                  title: item.title,
                  lessons: [{
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    keyPoints: ["Domain specific insights", "Industry standard tips", "Ready for interview"]
                  }]
                });
              }}
            />

            {selectedModule && (
              <LessonViewer
                selectedModule={selectedModule}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
                setSelectedModule={setSelectedModule}
              />
            )}
          </motion.div>
        )}

        {/* MODAL - TIGHT & ELEGANT (Linear Style) */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200/60">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
                   <div>
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Select Your Projects</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">Choose up to 4 specialized internship tasks.</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-bold text-[10px] border border-primary/10">
                         {selectedProjects.length}/4 SELECTED
                      </div>
                      <button onClick={() => setIsProjectModalOpen(false)} className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center hover:text-red-500 transition-all border border-slate-200/60"><span className="material-symbols-outlined text-sm">close</span></button>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                   {tasks.map((proj, i) => (
                      <div key={i} onClick={() => toggleProject(proj.title)} className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex items-center gap-3 ${selectedProjects.includes(proj.title) ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-slate-200/60 hover:border-primary/40 text-slate-800 hover:shadow-sm'}`}>
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 transition-all ${selectedProjects.includes(proj.title) ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'}`}>
                            {i + 1}
                         </div>
                         <h5 className="font-bold text-[12px] leading-tight flex-1 tracking-tight">{proj.title}</h5>
                         <span className={`material-symbols-outlined text-[18px] transition-all ${selectedProjects.includes(proj.title) ? 'text-white' : 'text-slate-200 group-hover:text-primary'}`}>{selectedProjects.includes(proj.title) ? 'check' : 'add'}</span>
                      </div>
                   ))}
                </div>

                <div className="p-5 border-t border-slate-100 flex flex-col items-center gap-4">
                   <button onClick={() => setIsProjectModalOpen(false)} className="bg-primary text-white px-10 py-3 rounded-xl font-bold text-[12px] shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all uppercase tracking-widest">
                      Confirm Selection
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ROADMAP MODAL - PREMIUM GUIDE */}
        <AnimatePresence>
           {selectedTask && selectedTask.title === 'Project Implementation Guide' && (
              <ProjectImplementationGuide onClose={() => setSelectedTask(null)} />
           )}
        </AnimatePresence>

        {/* SUBMISSION MODAL - COMPACT */}
        <AnimatePresence>
           {isSubmitting && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-slate-900/40 backdrop-blur-sm">
                 <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 border border-slate-200/60">
                    <h4 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-tight">Submit Project</h4>
                    <p className="text-[11px] text-slate-400 font-medium mb-6">Enter your GitHub repository URL</p>
                    <form onSubmit={handleTaskSubmit} className="space-y-5">
                       <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Repository URL</label>
                          <input required type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1.5 text-[12px] focus:outline-none focus:border-primary transition-all font-medium" />
                       </div>
                       <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 border border-primary/10">
                          <span className="material-symbols-outlined text-primary text-sm">info</span>
                          <p className="text-[10px] text-primary/70 leading-relaxed font-bold uppercase tracking-wide">Include InternID in README</p>
                       </div>
                       <div className="flex gap-3 mt-4">
                          <button type="button" onClick={() => setIsSubmitting(false)} className="flex-1 py-3 text-[11px] font-bold text-slate-400 hover:bg-slate-50 rounded-xl transition-all uppercase tracking-widest">Cancel</button>
                          <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl text-[11px] font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all uppercase tracking-widest">Submit</button>
                       </div>
                    </form>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

      </main>
    </div>
  );
}
