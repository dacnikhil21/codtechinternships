'use client';
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

  // Helper for badges based on XP
  const getBadge = (xp) => {
    if (xp >= 3001) return { name: 'Interview Ready', icon: 'verified', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' };
    if (xp >= 1501) return { name: 'Advanced', icon: 'grade', color: 'text-amber-700 bg-amber-50 border-amber-100' };
    if (xp >= 501) return { name: 'Intermediate', icon: 'military_tech', color: 'text-primary bg-primary/5 border-primary/10' };
    return { name: 'Beginner', icon: 'stadium', color: 'text-slate-600 bg-slate-50 border-slate-100' };
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`selected_projects_${user?.id || 'guest'}`);
      if (saved) setSelectedProjects(JSON.parse(saved));
    }
  }, [user?.id]);

  const toggleProject = (proj) => {
    if (selectedProjects.includes(proj)) {
      const updated = selectedProjects.filter(p => p !== proj);
      setSelectedProjects(updated);
      localStorage.setItem(`selected_projects_${user?.id || 'guest'}`, JSON.stringify(updated));
    } else {
      if (selectedProjects.length >= 4) return;
      const updated = [...selectedProjects, proj];
      setSelectedProjects(updated);
      localStorage.setItem(`selected_projects_${user?.id || 'guest'}`, JSON.stringify(updated));
    }
  };

  useEffect(() => {
    if (user) {
      setTotalXP(user.xp || 0);
    }
  }, [user]);

  const addXP = (amount) => {
    setTotalXP(prev => {
      const newXP = prev + amount;
      return newXP;
    });
    toast.success(`+${amount} XP Earned!`, { icon: '🚀' });
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
        } else {
          router.push('/login');
        }
      } catch (err) {
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
    if (!githubUrl.includes('github.com')) return toast.error('Valid GitHub URL required');
    
    toast.loading('Submitting project...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Project submitted! Mentors notified.');
      setIsSubmitting(false);
      setGithubUrl('');
    }, 1500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#faf8ff] flex w-full font-inter overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-md border-b border-slate-200 h-16 z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-lg" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
          </div>
          <h1 className="text-slate-900 font-black text-sm tracking-tight uppercase">Codtech</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Premium Sidebar */}
      <aside className={`w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col fixed h-full z-[70] transition-all duration-500 ease-in-out shadow-2xl shadow-slate-200/20 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-[14px] flex items-center justify-center shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined text-white text-xl" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <div>
              <h1 className="text-slate-900 font-black text-base tracking-tighter uppercase leading-none">Codtech</h1>
              <span className="text-mono-premium text-primary opacity-80">Premium Hub</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-20 lg:mt-0">
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
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-bold text-sm group ${activeTab === item.name ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-900'}`}
            >
              <span className={`material-symbols-outlined text-xl transition-transform group-hover:scale-110 ${activeTab === item.name ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100/50 m-4 bg-slate-50/50 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary font-black border border-slate-200 shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">{user?.name || 'Intern'}</p>
              <p className="text-mono-premium text-slate-400 truncate">{user?.course || 'Student'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-center py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100">
            <span className="material-symbols-outlined text-sm">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-500 lg:ml-72 p-6 lg:p-12 mt-16 lg:mt-0 ${isMobileMenuOpen ? 'blur-md' : ''}`}>
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-sm text-mono-premium text-primary mb-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
               {activeTab} Workspace
            </h2>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">Welcome back, {user?.name?.split(' ')[0]} 👋</h3>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="flex-1 md:flex-none flex items-center gap-2 glass-premium px-5 py-3 rounded-2xl border-slate-200/50 shadow-lg">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getBadge(totalXP).color}`}>
                   <span className="material-symbols-outlined text-[12px]">{getBadge(totalXP).icon}</span>
                   {getBadge(totalXP).name}
                </div>
                <div className="h-4 w-px bg-slate-200 mx-1"></div>
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs">
                   <span className="material-symbols-outlined text-amber-500 text-sm">rocket_launch</span>
                   {totalXP} <span className="text-[10px] text-slate-400">XP</span>
                </div>
             </div>
          </div>
        </header>

        {activeTab === 'Projects' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* Top Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 glass-premium p-10 rounded-[40px] border-slate-200/50 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-125"></div>
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Career Readiness Score</h4>
                    <p className="text-sm text-slate-400 font-medium mt-1">Real-time skill assessment analytics</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-6 py-3 rounded-[20px] font-black text-2xl tracking-tighter">
                    84<span className="text-sm opacity-50 ml-1">/100</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-40 gap-3 relative z-10">
                   {[40, 55, 65, 80, 70, 85, 95].map((h, i) => (
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1 }} key={i} className={`flex-1 rounded-2xl transition-all duration-500 ${i === 6 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-primary/10 hover:bg-primary/20'}`} />
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-primary p-10 rounded-[40px] text-white shadow-2xl shadow-primary/40 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150"></div>
                <div>
                   <span className="text-mono-premium text-white/60 mb-4 block">Next Session</span>
                   <h4 className="text-2xl font-black tracking-tight leading-tight mb-2">Technical Orientation</h4>
                   <p className="text-sm text-primary-light flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-sm">calendar_month</span> Friday • 2:00 PM
                   </p>
                </div>
                <button className="w-full bg-white text-primary font-black py-4 rounded-2xl mt-8 hover:bg-primary-light hover:text-white transition-all shadow-xl active:scale-95 text-sm uppercase tracking-widest">
                  Join Live Hub
                </button>
              </div>
            </div>

            {/* Project Workspace */}
            <section className="space-y-6">
               <div className="flex justify-between items-end px-2">
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Project Workspace</h3>
                     <p className="text-sm text-slate-400 font-medium">Select 4 major challenges for certification</p>
                  </div>
                  <button onClick={() => setIsProjectModalOpen(true)} className="bg-primary/10 text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                     Manage Projects
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {selectedProjects.length > 0 ? (
                    selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -5 }} className="card-premium p-8 rounded-[32px] group/card relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
                        <button onClick={() => toggleProject(proj)} className="absolute top-6 right-6 w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                           <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover/card:bg-primary group-hover/card:text-white transition-all shadow-sm">
                           <span className="material-symbols-outlined text-xl">database</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-sm mb-2 line-clamp-2 leading-tight">{proj}</h5>
                        <div className="flex items-center gap-2 text-mono-premium text-primary/60 mb-8">
                           <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                           Active Task
                        </div>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-white text-primary border border-primary/20 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                           Submit Link
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    tasks.slice(0, 4).map((proj, idx) => (
                      <div key={idx} className="card-premium p-8 rounded-[32px] relative overflow-hidden group">
                        <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                           <span className="material-symbols-outlined text-xl">rocket_launch</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-sm mb-2 line-clamp-2 leading-tight">{proj.title}</h5>
                        <div className="flex items-center gap-2 text-mono-premium text-emerald-600/60 mb-8">
                           <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                           Suggested
                        </div>
                        <button onClick={() => toggleProject(proj.title)} className="w-full bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                           Select Project
                        </button>
                      </div>
                    ))
                  )}
               </div>
            </section>
          </motion.div>
        )}

        {/* MATERIALS & PREP TAB (SIMPLIFIED FOR OVERHAUL) */}
        {activeTab === 'Materials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {materials.map((item, i) => (
                <div key={i} className="card-premium p-6 rounded-3xl flex items-center gap-4 cursor-pointer">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center"><span className="material-symbols-outlined">description</span></div>
                   <div><h5 className="font-black text-slate-900 text-sm">{item.name}</h5><p className="text-mono-premium text-slate-400">Technical Resource</p></div>
                </div>
             ))}
          </div>
        )}

        {activeTab === 'Preparation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {prepContent.map((card, i) => (
                <div key={i} className="card-premium p-8 rounded-[32px] relative group">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6"><span className="material-symbols-outlined">psychology</span></div>
                   <h5 className="font-black text-slate-900 text-sm mb-3">{card.title}</h5>
                   <p className="text-xs text-slate-500 mb-8 leading-relaxed line-clamp-3">{card.content}</p>
                   <button onClick={() => addXP(100)} className="w-full bg-slate-50 text-slate-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Start Module</button>
                </div>
             ))}
          </div>
        )}

        {/* Modals & Overlays (Project Selector) */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-5xl h-[85vh] rounded-[48px] shadow-2xl flex flex-col overflow-hidden border border-white/20">
                  <div className="p-10 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                     <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Choose Your Path</h4>
                        <p className="text-sm text-slate-400 font-medium">Select 4 specialized projects for your certification</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest border border-primary/5">
                           {selectedProjects.length}/4 Selected
                        </div>
                        <button onClick={() => setIsProjectModalOpen(false)} className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                           <span className="material-symbols-outlined">close</span>
                        </button>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {tasks.map((proj, i) => (
                        <div key={i} onClick={() => toggleProject(proj.title)} className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer group flex flex-col justify-between h-48 ${selectedProjects.includes(proj.title) ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30' : 'bg-slate-50 border-transparent hover:border-primary/30 text-slate-800'}`}>
                           <div className="flex justify-between items-start">
                              <span className="text-mono-premium opacity-50">{String(i+1).padStart(2, '0')}</span>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedProjects.includes(proj.title) ? 'bg-white text-primary' : 'bg-white/50 text-slate-300'}`}>
                                 <span className="material-symbols-outlined text-sm">{selectedProjects.includes(proj.title) ? 'done' : 'add'}</span>
                              </div>
                           </div>
                           <h5 className="font-black text-sm leading-tight pr-4">{proj.title}</h5>
                        </div>
                     ))}
                  </div>
                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                     <button onClick={() => setIsProjectModalOpen(false)} className="bg-primary text-white px-12 py-4 rounded-[20px] font-black text-sm shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">Confirm Selections</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUBMISSION MODAL */}
        <AnimatePresence>
           {isSubmitting && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10">
                    <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Submit Project</h4>
                    <p className="text-sm text-slate-400 mb-8 font-medium">Provide your GitHub repository link</p>
                    <form onSubmit={handleTaskSubmit} className="space-y-6">
                       <input required type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/repo" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all font-medium" />
                       <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 border border-primary/10">
                          <span className="material-symbols-outlined text-primary text-sm">info</span>
                          <p className="text-[10px] text-primary/80 leading-relaxed font-bold uppercase tracking-wider">Ensure README contains InternID and Full Name</p>
                       </div>
                       <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setIsSubmitting(false)} className="flex-1 py-4 text-sm font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                          <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">Submit Task</button>
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
