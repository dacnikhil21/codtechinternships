'use client';
// Force Cache Refresh: Hybrid Premium v2 - 2026-05-12T07:40:00Z
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
    if (xp >= 3001) return { name: 'Interview Ready', icon: 'verified', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' };
    if (xp >= 1501) return { name: 'Advanced', icon: 'grade', color: 'text-amber-700 bg-amber-50 border-amber-100' };
    if (xp >= 501) return { name: 'Intermediate', icon: 'military_tech', color: 'text-primary bg-primary/5 border-primary/10' };
    return { name: 'Beginner', icon: 'stadium', color: 'text-slate-600 bg-slate-50 border-slate-100' };
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const saved = localStorage.getItem(`selected_projects_${user.id}`);
      if (saved) setSelectedProjects(JSON.parse(saved));
    }
  }, [user?.id]);

  const toggleProject = (proj) => {
    let updated;
    if (selectedProjects.includes(proj)) {
      updated = selectedProjects.filter(p => p !== proj);
    } else {
      if (selectedProjects.length >= 4) {
        toast.error('Maximum 4 projects allowed');
        return;
      }
      updated = [...selectedProjects, proj];
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
    if (!githubUrl.includes('github.com')) return toast.error('Valid GitHub URL required');
    toast.loading('Submitting project...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Project submitted!');
      setIsSubmitting(false);
      setGithubUrl('');
    }, 1500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf8ff] flex w-full font-inter overflow-x-hidden">
      
      {/* Sidebar - HYBRID: OLD DENSITY + NEW POLISH */}
      <aside className={`w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col fixed h-full z-[70] transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-base" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <h1 className="text-slate-900 font-black text-sm tracking-tight uppercase">Codtech</h1>
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
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-bold text-xs group ${activeTab === item.name ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span className={`material-symbols-outlined text-lg ${activeTab === item.name ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100/50 m-2 bg-slate-50/50 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary font-black border border-slate-200 shadow-sm text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-900 truncate">{user?.name || 'Intern'}</p>
              <p className="text-[9px] font-mono font-bold text-slate-400 truncate uppercase tracking-widest">{user?.course}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 text-[10px] font-black text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-transparent hover:border-red-100">
            <span className="material-symbols-outlined text-[14px]">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content - RESTORED ORIGINAL SPACING (p-6) */}
      <main className={`flex-1 transition-all lg:ml-64 p-6 lg:p-8 mt-16 lg:mt-0`}>
        
        {/* Header - OLD LAYOUT + PREMIUM BADGE */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-[9px] font-mono font-bold text-primary mb-1 uppercase tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
               {activeTab}
            </h2>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Welcome, {user?.name?.split(' ')[0]} 👋</h3>
          </div>
          
          <div className="flex items-center gap-3 glass-premium px-4 py-2 rounded-xl border-slate-200/50 shadow-sm">
             <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${getBadge(user?.xp || 0).color}`}>
                <span className="material-symbols-outlined text-[10px]">{getBadge(user?.xp || 0).icon}</span>
                {getBadge(user?.xp || 0).name}
             </div>
             <div className="h-3 w-px bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-1.5 text-slate-900 font-black text-[11px]">
                <span className="material-symbols-outlined text-amber-500 text-xs">rocket_launch</span>
                {user?.xp || 0} <span className="text-[9px] text-slate-400">XP</span>
             </div>
          </div>
        </header>

        {activeTab === 'Projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            
            {/* Top Stats - HYBRID: COMPACT BUT PREMIUM */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 glass-premium p-6 rounded-3xl border-slate-200/50 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900 tracking-tight">Career Readiness</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Real-time skill analytics</p>
                  </div>
                  <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl font-black text-lg">84%</div>
                </div>
                <div className="flex items-end justify-between h-24 gap-2">
                   {[40, 55, 65, 80, 70, 85, 95].map((h, i) => (
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} key={i} className={`flex-1 rounded-lg ${i === 6 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-primary/10'}`} />
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-primary p-6 rounded-3xl text-white shadow-lg flex flex-col justify-between">
                <div>
                   <span className="text-[8px] font-mono font-bold text-white/60 mb-2 block uppercase tracking-widest">Next Session</span>
                   <h4 className="text-lg font-black tracking-tight leading-tight mb-1">Technical Orientation</h4>
                   <p className="text-[10px] text-primary-light flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-xs">calendar_month</span> Fri • 2:00 PM
                   </p>
                </div>
                <button className="w-full bg-white text-primary font-black py-2.5 rounded-xl mt-4 hover:bg-primary-light hover:text-white transition-all text-[10px] uppercase tracking-widest shadow-md">Join Hub</button>
              </div>
            </div>

            {/* RESTORED: OLD LAYOUT STRUCTURE FOR PROJECTS */}
            <section className="space-y-4">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-1">
                  <div>
                     <h3 className="text-lg font-black text-slate-900 tracking-tight">Your Internship Projects</h3>
                     <p className="text-[11px] text-slate-400 font-medium">Complete these to qualify for certification</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setIsProjectModalOpen(true)} className="flex-1 sm:flex-none bg-primary text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-xs">add</span> View Projects
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 sm:flex-none bg-slate-100 text-slate-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200/50">
                       <span className="material-symbols-outlined text-xs">map</span> Roadmap
                    </button>
                  </div>
               </div>

               {selectedProjects.length === 0 ? (
                 <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center group hover:border-primary/30 transition-all">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <span className="material-symbols-outlined text-2xl">folder_off</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mb-1">No Projects Selected</h4>
                    <p className="text-[10px] text-slate-400 max-w-xs mx-auto mb-6 font-medium leading-relaxed">Click "View Projects" to browse and select your internship tasks.</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:scale-105 transition-all">Explore Projects</button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -3 }} className="card-premium p-5 rounded-2xl group/card relative overflow-hidden">
                        <button onClick={() => toggleProject(proj)} className="absolute top-3 right-3 w-6 h-6 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all z-10 border border-slate-100 opacity-0 group-hover/card:opacity-100">
                           <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3 group-hover/card:bg-primary group-hover/card:text-white transition-all">
                           <span className="material-symbols-outlined text-base">database</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-xs mb-1 line-clamp-2 h-8 leading-tight">{proj}</h5>
                        <div className="flex items-center gap-1.5 text-[8px] font-mono font-bold text-primary/60 mb-4 uppercase tracking-widest">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Active
                        </div>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-white text-primary border border-primary/20 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Submit Link</button>
                      </motion.div>
                    ))}
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {/* MATERIALS & PREP - HYBRID DENSITY */}
        {activeTab === 'Materials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {materials.map((item, i) => (
                <div key={i} className="card-premium p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-primary/5">
                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-lg">description</span></div>
                   <div><h5 className="font-black text-slate-900 text-xs">{item.name}</h5><p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">Resource</p></div>
                </div>
             ))}
          </div>
        )}

        {activeTab === 'Preparation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {prepContent.map((card, i) => (
                <div key={i} className="card-premium p-5 rounded-3xl relative group">
                   <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4"><span className="material-symbols-outlined text-lg">psychology</span></div>
                   <h5 className="font-black text-slate-900 text-xs mb-2 h-8 line-clamp-2">{card.title}</h5>
                   <p className="text-[10px] text-slate-500 mb-6 leading-relaxed line-clamp-3 font-medium">{card.content}</p>
                   <button className="w-full bg-slate-50 text-slate-900 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-slate-100">Start</button>
                </div>
             ))}
          </div>
        )}

        {/* MODAL - RESTORED COMPACT LAYOUT + NEW PREMIUM UI */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
               <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-white w-full max-w-4xl h-[80vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md z-10">
                     <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">Browse Projects</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Select up to 4 specialized tasks</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="bg-primary/5 text-primary px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest border border-primary/5">
                           {selectedProjects.length}/4 Selected
                        </div>
                        <button onClick={() => setIsProjectModalOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:text-red-500 transition-all border border-slate-100"><span className="material-symbols-outlined">close</span></button>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                     {tasks.map((proj, i) => (
                        <div key={i} onClick={() => toggleProject(proj.title)} className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between h-32 ${selectedProjects.includes(proj.title) ? 'bg-primary border-primary text-white shadow-lg' : 'bg-slate-50 border-transparent hover:border-primary/20 text-slate-800 hover:bg-white hover:shadow-sm'}`}>
                           <div className="flex justify-between items-start">
                              <span className="text-[9px] font-mono font-bold opacity-30">{String(i+1).padStart(2, '0')}</span>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedProjects.includes(proj.title) ? 'bg-white text-primary' : 'bg-white shadow-sm text-slate-300'}`}>
                                 <span className="material-symbols-outlined text-[14px]">{selectedProjects.includes(proj.title) ? 'done' : 'add'}</span>
                              </div>
                           </div>
                           <h5 className="font-black text-[11px] leading-tight pr-2">{proj.title}</h5>
                        </div>
                     ))}
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                     <button onClick={() => setIsProjectModalOpen(false)} className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Confirm Selection</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ROADMAP MODAL - COMPACT HYBRID */}
        <AnimatePresence>
           {selectedTask && selectedTask.title === 'Project Implementation Guide' && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <h4 className="text-xl font-black text-slate-900 tracking-tight">How To Do Projects</h4>
                       <button onClick={() => setSelectedTask(null)} className="w-8 h-8 bg-white text-slate-400 rounded-lg flex items-center justify-center hover:text-red-500 transition-all shadow-sm border border-slate-100"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                       {[
                         { step: '01', title: 'Browse Tasks', desc: 'Select up to 4 major projects for your track.' },
                         { step: '02', title: 'Learn & Build', desc: 'Focus on code quality and documentation.' },
                         { step: '03', title: 'GitHub Link', desc: 'Create a unique repo and include a detailed README.' },
                         { step: '04', title: 'Submit & Certify', desc: 'Submit the link for review and receive your certificate.' },
                       ].map((item, i) => (
                         <div key={i} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">0{i+1}</div>
                            <div>
                               <h5 className="font-black text-slate-900 text-sm mb-0.5 tracking-tight">{item.title}</h5>
                               <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
                       <button onClick={() => setSelectedTask(null)} className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-[10px] shadow-md hover:scale-105 transition-all uppercase tracking-widest">Start Building</button>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

        {/* SUBMISSION MODAL - COMPACT */}
        <AnimatePresence>
           {isSubmitting && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-8">
                    <h4 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Submit Project</h4>
                    <p className="text-[10px] text-slate-400 mb-6 font-medium">Enter your GitHub repository link</p>
                    <form onSubmit={handleTaskSubmit} className="space-y-4">
                       <input required type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/repo" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary transition-all font-medium" />
                       <div className="bg-primary/5 p-4 rounded-2xl flex gap-2 border border-primary/10">
                          <span className="material-symbols-outlined text-primary text-xs">info</span>
                          <p className="text-[8px] text-primary/80 leading-relaxed font-bold uppercase tracking-widest">Include InternID in README</p>
                       </div>
                       <div className="flex gap-3 pt-4">
                          <button type="button" onClick={() => setIsSubmitting(false)} className="flex-1 py-3 text-[10px] font-black text-slate-500 hover:bg-slate-100 rounded-xl transition-all uppercase">Cancel</button>
                          <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl text-[10px] font-black shadow-md hover:bg-primary-dark transition-all uppercase">Submit</button>
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
