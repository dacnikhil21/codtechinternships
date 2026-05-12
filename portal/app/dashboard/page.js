'use client';
// Force Refresh: Pixel-Perfect Restoration v1 - 2026-05-12T15:58:00Z
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

  const getBadge = (xp) => {
    if (xp >= 3001) return { name: 'INTERVIEW READY', icon: 'verified', color: 'text-indigo-700 bg-slate-50 border-slate-100' };
    if (xp >= 1501) return { name: 'ADVANCED', icon: 'grade', color: 'text-amber-700 bg-slate-50 border-slate-100' };
    if (xp >= 501) return { name: 'INTERMEDIATE', icon: 'military_tech', color: 'text-primary bg-slate-50 border-slate-100' };
    return { name: 'BEGINNER', icon: 'stadium', color: 'text-slate-600 bg-slate-50 border-slate-100 shadow-sm' };
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`selected_projects_${user.id}`);
      if (saved) {
        setSelectedProjects(JSON.parse(saved));
      }
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
    if (user?.id) {
      localStorage.setItem(`selected_projects_${user.id}`, JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/auth/me?v=${Date.now()}`);
        const userData = await userRes.json();
        if (userData && userData.success) {
          setUser(userData.data);
          setTotalXP(userData.data.xp || 0);

          const taskRes = await fetch(`/api/tasks?v=${Date.now()}`);
          const taskData = await taskRes.json();
          if (taskData.success) setTasks(taskData.data);

          const prepRes = await fetch('/api/prep');
          const prepData = await prepRes.json();
          if (prepData.success) setPrepContent(prepData.data);

          const matRes = await fetch('/api/materials');
          const matData = await matRes.json();
          if (matData.success) setMaterials(matData.data);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    if (!githubUrl.includes('github.com')) {
      return toast.error('Please provide a valid GitHub repository URL');
    }
    toast.loading('Submitting project...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Project submitted successfully!');
      setIsSubmitting(false);
      setGithubUrl('');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf8ff] flex w-full font-inter overflow-x-hidden">
      
      {/* Sidebar - EXACT FROM SCREENSHOT */}
      <aside className={`w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-[70] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-lg" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <h1 className="text-primary font-black text-sm tracking-tight uppercase">Codtech Intern</h1>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {[
            { name: 'Projects', icon: 'folder_open' },
            { name: 'Materials', icon: 'library_books' },
            { name: 'Preparation', icon: 'psychology' },
            { name: 'Placement Hub', icon: 'hub' },
            { name: 'Job Hunting', icon: 'work_outline' },
            { name: 'Mock Interviews', icon: 'record_voice_over' },
            { name: 'Resume Building', icon: 'description' },
            { name: 'LinkedIn Profile', icon: 'person_search' },
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-[13px] group ${activeTab === item.name ? 'bg-primary/5 text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className={`material-symbols-outlined text-xl ${activeTab === item.name ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate leading-none mb-1">{user?.name || 'Intern'}</p>
              <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tight leading-none">{user?.course}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-3 text-[11px] font-black text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest border border-transparent hover:border-red-100">
            <span className="material-symbols-outlined text-base">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all lg:ml-64 p-6 lg:p-10 mt-16 lg:mt-0`}>
        
        {/* Dashboard Header - EXACT FROM SCREENSHOT */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-primary text-2xl">grid_view</span>
             <h2 className="text-xl font-black text-slate-900 tracking-tight">Projects</h2>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black tracking-wider border border-slate-100 ${getBadge(user?.xp || 0).color}`}>
                <span className="material-symbols-outlined text-base">{getBadge(user?.xp || 0).icon}</span>
                {getBadge(user?.xp || 0).name}
             </div>
             <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black tracking-wider bg-emerald-50/50 text-emerald-700 border border-slate-100 shadow-sm">
                <span className="material-symbols-outlined text-base">verified</span>
                {user?.xp || 0} XP
             </div>
             <button className="bg-primary text-white px-6 py-2 rounded-2xl font-black text-[10px] tracking-wider uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-base">bolt</span> Get Certified
             </button>
          </div>
        </header>

        {activeTab === 'Projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            
            {/* Greeting Section - EXACT FROM SCREENSHOT */}
            <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back, {user?.name?.split(' ')[0]} 👋</h3>
               <p className="text-sm text-slate-400 font-bold tracking-tight">You're currently in the <span className="text-primary">{user?.course} Intern</span> track.</p>
            </div>

            {/* Analytics & Orientation Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-100/30 relative group">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Career Readiness Score</h4>
                    <p className="text-sm text-slate-400 font-bold mt-1">Based on your completed modules</p>
                  </div>
                  <div className="text-primary font-black text-5xl">84<span className="text-xl text-slate-300 ml-1">/100</span></div>
                </div>
                <div className="flex items-end justify-between h-32 gap-3">
                   {[40, 55, 65, 80, 70, 85, 100].map((h, i) => (
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} key={i} className={`flex-1 rounded-2xl transition-all ${i === 6 ? 'bg-primary shadow-2xl shadow-primary/30' : 'bg-primary/10 hover:bg-primary/20'}`} />
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-primary p-10 rounded-[40px] text-white shadow-2xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="relative z-10">
                   <h4 className="text-2xl font-black tracking-tight leading-tight mb-6">Tech Orientation</h4>
                   <div className="flex items-center gap-3 text-sm text-white/80 font-bold mb-10">
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined">calendar_month</span>
                      </div>
                      Friday, 2:00 PM
                   </div>
                </div>
                <button className="w-full bg-white text-primary font-black py-4 rounded-[20px] hover:bg-slate-50 transition-all text-sm tracking-widest shadow-xl active:scale-95 relative z-10">Join Session</button>
              </div>
            </div>

            {/* PROJECT WORKSPACE - EXACT FROM SCREENSHOT */}
            <section className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-indigo-100/20">
               <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left mb-10">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                     <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
                        <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Internship Project Workspace</h3>
                        <p className="text-sm text-slate-400 font-bold mt-1">Select and complete 4 major projects to finalize your internship.</p>
                     </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                       <span className="material-symbols-outlined text-xl">add_circle</span> View Projects
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="bg-slate-50 text-slate-900 border border-slate-100 px-10 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                       <span className="material-symbols-outlined text-xl">menu_book</span> How to Do Project
                    </button>
                  </div>
               </div>

               {selectedProjects.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -8 }} className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 group relative transition-all">
                        <button onClick={() => toggleProject(proj)} className="absolute top-4 right-4 w-7 h-7 bg-white text-slate-300 rounded-full flex items-center justify-center hover:text-red-500 transition-all border border-slate-100 opacity-0 group-hover:opacity-100 shadow-sm z-10">
                           <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                        <div className="w-12 h-12 bg-white text-primary rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                           <span className="material-symbols-outlined text-2xl">database</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-xs mb-6 h-10 line-clamp-2 leading-snug tracking-tight uppercase">{proj}</h5>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-primary text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95">Submit Link</button>
                      </motion.div>
                    ))}
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {/* MODAL - PIXEL PERFECT FROM SCREENSHOT */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-white/20">
                <div className="p-10 flex justify-between items-center">
                   <div>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight">Select Your Projects</h4>
                      <p className="text-sm text-slate-400 font-bold mt-1">Choose up to 4 projects to complete during your internship.</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="bg-primary/5 text-primary px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest border border-primary/10">
                         {selectedProjects.length}/4 SELECTED
                      </div>
                      <button onClick={() => setIsProjectModalOpen(false)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:text-red-500 transition-all border border-slate-100 shadow-sm"><span className="material-symbols-outlined">close</span></button>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-10 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {tasks.map((proj, i) => (
                      <div key={i} onClick={() => toggleProject(proj.title)} className={`p-4 rounded-[20px] border transition-all cursor-pointer group flex items-center gap-4 ${selectedProjects.includes(proj.title) ? 'bg-primary border-primary text-white shadow-2xl shadow-primary/30' : 'bg-white border-slate-100 hover:border-primary/40 text-slate-800 hover:shadow-xl hover:shadow-indigo-100/40'}`}>
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm transition-all ${selectedProjects.includes(proj.title) ? 'bg-white text-primary' : 'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                            {i + 1}
                         </div>
                         <h5 className="font-black text-[13px] leading-tight flex-1 pr-2 tracking-tight">{proj.title}</h5>
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedProjects.includes(proj.title) ? 'bg-white/20 text-white' : 'text-primary/40 group-hover:text-primary'}`}>
                            <span className="material-symbols-outlined text-lg">{selectedProjects.includes(proj.title) ? 'check' : 'add'}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="px-10 pb-10 pt-4 flex flex-col items-center gap-6">
                   <p className="text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase">Scroll to explore more projects</p>
                   <button onClick={() => setIsProjectModalOpen(false)} className="bg-primary text-white px-16 py-5 rounded-[24px] font-black text-[15px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
                      Confirm Selection
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ROADMAP MODAL - FULL DETAILED VERSION (RE-RE-RESTORED) */}
        <AnimatePresence>
           {selectedTask && selectedTask.title === 'Project Implementation Guide' && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight">Project Step-by-Step Guide</h4>
                       <button onClick={() => setSelectedTask(null)} className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-all shadow-sm border border-slate-100"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="p-10 space-y-10 overflow-y-auto max-h-[70vh]">
                       {/* Step 1 */}
                       <div className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">01</div>
                          <div>
                             <h5 className="font-black text-slate-900 text-lg mb-1 tracking-tight uppercase">Select Any 4 Projects</h5>
                             <p className="text-sm text-slate-400 font-bold leading-relaxed">Choose 4 major tasks based on your enrolled domain from the project workspace.</p>
                          </div>
                       </div>
                       {/* Step 2 (Technical) */}
                       <div className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xl shadow-primary/20 transition-transform group-hover:scale-110">02</div>
                          <div className="flex-1">
                             <h5 className="font-black text-slate-900 text-lg mb-1 tracking-tight uppercase">Build & Documentation</h5>
                             <div className="mt-4 bg-indigo-50 border border-indigo-100/50 rounded-[32px] p-6">
                                <h6 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">✅ Technical Track Rules</h6>
                                <ul className="text-xs text-slate-600 space-y-2 list-disc ml-4 font-bold uppercase tracking-wide">
                                   <li>Complete code with comments</li>
                                   <li>Unique GitHub repo per project</li>
                                   <li>README: InternID, Name, Scope & Screenshots</li>
                                   <li>Submit the repository link for review</li>
                                </ul>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex justify-center">
                       <button onClick={() => setSelectedTask(null)} className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em]">Got it, Let's Build! 🚀</button>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

        {/* SUBMISSION MODAL */}
        <AnimatePresence>
           {isSubmitting && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                 <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-10">
                    <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Submit Project</h4>
                    <p className="text-sm text-slate-400 font-bold mb-10 tracking-tight">Submit your GitHub repository for review</p>
                    <form onSubmit={handleTaskSubmit} className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-1">Repository URL</label>
                          <input required type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/project" className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-5 mt-2 text-[12px] focus:outline-none focus:border-primary transition-all font-bold tracking-tight shadow-sm" />
                       </div>
                       <div className="bg-primary/5 p-6 rounded-[32px] flex gap-3 border border-primary/10">
                          <span className="material-symbols-outlined text-primary text-sm">info</span>
                          <p className="text-[11px] text-primary/70 leading-relaxed font-black uppercase tracking-wide">Must include InternID in README</p>
                       </div>
                       <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setIsSubmitting(false)} className="flex-1 py-5 text-[11px] font-black text-slate-400 hover:bg-slate-50 rounded-[20px] transition-all uppercase tracking-widest">Cancel</button>
                          <button type="submit" className="flex-1 bg-primary text-white py-5 rounded-[20px] text-[11px] font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Submit</button>
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
