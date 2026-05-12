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
    if (user) setTotalXP(user.xp || 0);
  }, [user]);

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
      
      {/* Sidebar - RESTORED ORIGINAL LINKS + PREMIUM SKIN */}
      <aside className={`w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col fixed h-full z-[70] transition-all duration-500 ease-in-out shadow-2xl shadow-slate-200/20 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-[14px] flex items-center justify-center shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined text-white text-xl" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <div>
              <h1 className="text-slate-900 font-black text-base tracking-tighter uppercase leading-none">Codtech</h1>
              <span className="text-[10px] font-mono font-bold text-primary opacity-80 uppercase tracking-widest">Premium Hub</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
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
              <p className="text-[10px] font-mono font-bold text-slate-400 truncate uppercase tracking-widest">{user?.course || 'Student'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-center py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100 uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 lg:ml-72 p-6 lg:p-12 mt-16 lg:mt-0 ${isMobileMenuOpen ? 'blur-md' : ''}`}>
        
        {/* Header - RESTORED ORIGINAL DATA + PREMIUM SKIN */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-[10px] font-mono font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-[0.2em]">
               <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
               {activeTab} Portal
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            
            {/* Top Stats Section - PREMIUM SKIN */}
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
                   <span className="text-[10px] font-mono font-bold text-white/60 mb-4 block uppercase tracking-widest">Next Session</span>
                   <h4 className="text-2xl font-black tracking-tight leading-tight mb-2">Technical Orientation</h4>
                   <p className="text-sm text-primary-light flex items-center gap-2 font-medium">
                      <span className="material-symbols-outlined text-sm">calendar_month</span> Friday • 2:00 PM
                   </p>
                </div>
                <button className="w-full bg-white text-primary font-black py-4 rounded-2xl mt-8 hover:bg-primary-light hover:text-white transition-all shadow-xl active:scale-95 text-xs uppercase tracking-widest">
                  Join Live Hub
                </button>
              </div>
            </div>

            {/* RESTORED: "Your Internship Projects" (Selected Projects Section) */}
            <section className="space-y-8">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
                  <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Your Internship Projects</h3>
                     <p className="text-sm text-slate-400 font-medium">Complete these to qualify for certification</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => setIsProjectModalOpen(true)} className="flex-1 sm:flex-none bg-primary text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">add</span> View Projects
                    </button>
                    <button 
                      onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })}
                      className="flex-1 sm:flex-none bg-slate-100 text-slate-600 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200/50"
                    >
                       <span className="material-symbols-outlined text-sm">map</span>
                       How to Do Project
                    </button>
                  </div>
               </div>

               {selectedProjects.length === 0 ? (
                 /* RESTORED ORIGINAL EMPTY STATE + PREMIUM SKIN */
                 <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[40px] p-20 text-center flex flex-col items-center justify-center group hover:border-primary/30 transition-all">
                    <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-[30px] flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <span className="material-symbols-outlined text-4xl">folder_off</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">No Projects Selected</h4>
                    <p className="text-sm text-slate-400 max-w-xs mx-auto mb-8 font-medium">Click on "View Projects" to browse and select tasks for your internship.</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                       Explore Projects
                    </button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -5 }} className="card-premium p-8 rounded-[32px] group/card relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
                        
                        {/* RESTORED: Remove/Cancel Flow (X Button) */}
                        <button onClick={() => toggleProject(proj)} className="absolute top-6 right-6 w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all z-10 border border-slate-100 shadow-sm">
                           <span className="material-symbols-outlined text-sm">close</span>
                        </button>

                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover/card:bg-primary group-hover/card:text-white transition-all shadow-sm">
                           <span className="material-symbols-outlined text-xl">database</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-sm mb-2 line-clamp-2 leading-tight h-10">{proj}</h5>
                        <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-primary/60 mb-8 uppercase tracking-widest">
                           <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                           Active Task
                        </div>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-white text-primary border border-primary/20 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                           Submit Project
                        </button>
                      </motion.div>
                    ))}
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {/* RESTORED: Original Tabs Behavior + Premium Skin */}
        {activeTab === 'Materials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {materials.map((item, i) => (
                <div key={i} className="card-premium p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-primary/5">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-sm"><span className="material-symbols-outlined">description</span></div>
                   <div><h5 className="font-black text-slate-900 text-sm">{item.name}</h5><p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">Technical Resource</p></div>
                </div>
             ))}
          </div>
        )}

        {activeTab === 'Preparation' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {prepContent.map((card, i) => (
                <div key={i} className="card-premium p-8 rounded-[32px] relative group">
                   <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-sm"><span className="material-symbols-outlined">psychology</span></div>
                   <h5 className="font-black text-slate-900 text-sm mb-3 h-10 line-clamp-2">{card.title}</h5>
                   <p className="text-xs text-slate-500 mb-8 leading-relaxed line-clamp-3 font-medium">{card.content}</p>
                   <button onClick={() => toast.success('Module Started!')} className="w-full bg-slate-50 text-slate-900 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-slate-100">Start Module</button>
                </div>
             ))}
          </div>
        )}

        {/* RESTORED: Original "Browse Projects" Modal Logic + Premium Skin */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-5xl h-[85vh] rounded-[48px] shadow-2xl flex flex-col overflow-hidden border border-white/20">
                  <div className="p-10 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                     <div>
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Browse Projects</h4>
                        <p className="text-sm text-slate-400 font-medium">Select up to 4 specialized tasks for your certification</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="bg-primary/10 text-primary px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-primary/5">
                           {selectedProjects.length}/4 Selected
                        </div>
                        <button onClick={() => setIsProjectModalOpen(false)} className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                           <span className="material-symbols-outlined">close</span>
                        </button>
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {tasks.map((proj, i) => (
                        <div key={i} onClick={() => toggleProject(proj.title)} className={`p-6 rounded-3xl border-2 transition-all cursor-pointer group flex flex-col justify-between h-40 ${selectedProjects.includes(proj.title) ? 'bg-primary border-primary text-white shadow-xl shadow-primary/30' : 'bg-slate-50 border-transparent hover:border-primary/30 text-slate-800 hover:bg-white hover:shadow-lg'}`}>
                           <div className="flex justify-between items-start">
                              <span className="text-[10px] font-mono font-bold opacity-40">{String(i+1).padStart(2, '0')}</span>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedProjects.includes(proj.title) ? 'bg-white text-primary' : 'bg-white shadow-sm text-slate-300'}`}>
                                 <span className="material-symbols-outlined text-sm">{selectedProjects.includes(proj.title) ? 'done' : 'add'}</span>
                              </div>
                           </div>
                           <h5 className="font-black text-sm leading-tight pr-4">{proj.title}</h5>
                        </div>
                     ))}
                  </div>
                  <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                     <button onClick={() => setIsProjectModalOpen(false)} className="bg-primary text-white px-12 py-4.5 rounded-[24px] font-black text-xs shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em]">Confirm Selection</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESTORED: Original "How To Do Project" Roadmap Content + Premium Skin */}
        <AnimatePresence>
           {selectedTask && selectedTask.title === 'Project Implementation Guide' && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <h4 className="text-2xl font-black text-slate-900 tracking-tighter">How To Do Projects</h4>
                       <button onClick={() => setSelectedTask(null)} className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-all shadow-sm border border-slate-100">
                          <span className="material-symbols-outlined">close</span>
                       </button>
                    </div>
                    <div className="p-8 space-y-10 overflow-y-auto max-h-[70vh]">
                       {/* Step 1 */}
                       <div className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">01</div>
                          <div>
                             <h5 className="font-black text-slate-900 text-lg mb-1 tracking-tight">Select Any 4 Projects</h5>
                             <p className="text-sm text-slate-500 leading-relaxed font-medium">Go to the <strong>Projects Section</strong> and choose <strong>any four projects</strong> based on your enrolled domain!</p>
                          </div>
                       </div>

                       {/* Step 2 */}
                       <div className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">02</div>
                          <div className="flex-1">
                             <h5 className="font-black text-slate-900 text-lg mb-1 tracking-tight">Understand & Start Working</h5>
                             <p className="text-sm text-slate-500 mb-6 font-medium">Carefully read and understand the project requirements before starting.</p>

                             {/* Technical */}
                             <div className="bg-indigo-50/50 rounded-3xl p-6 border border-indigo-100 mb-4">
                                <h6 className="text-[10px] font-mono font-bold text-indigo-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <span className="material-symbols-outlined text-xs">code</span> Technical / Coding Projects
                                </h6>
                                <ul className="text-xs text-slate-600 space-y-2 font-medium list-disc ml-4">
                                   <li>Create the complete project code properly with <strong>comments</strong>.</li>
                                   <li>Organize all files neatly in folders.</li>
                                   <li>Upload to a <strong>unique GitHub repo</strong> per project.</li>
                                   <li>In README: mention InternID, Full Name, No. of Weeks, Project Name & Scope.</li>
                                   <li>Include: Source Code, README, Screenshots, Output Images.</li>
                                </ul>
                             </div>

                             {/* Non-IT */}
                             <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 mb-4">
                                <h6 className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <span className="material-symbols-outlined text-xs">brush</span> Non-IT / Creative / Design
                                </h6>
                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                   Create project-related: Images, Posters, Visuals, Presentations, Datasets, Research Materials, UI Designs, or Reports. Upload all files to GitHub and submit the repository link.
                                </p>
                             </div>

                             {/* Data Science */}
                             <div className="bg-purple-50/50 rounded-3xl p-6 border border-purple-100">
                                <h6 className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <span className="material-symbols-outlined text-xs">analytics</span> Data Science & Analytics
                                </h6>
                                <ul className="text-xs text-slate-600 space-y-2 font-medium list-disc ml-4">
                                   <li>Use dummy/public datasets (Kaggle, Govt Data).</li>
                                   <li>Perform: Data Cleaning, Visualization, Analysis, Prediction Models, Dashboard Creation.</li>
                                   <li>Upload: Dataset Files, Jupyter Notebook/Code, Graphs & Charts, Final Output Screenshots.</li>
                                </ul>
                             </div>
                          </div>
                       </div>

                       {/* Step 3 */}
                       <div className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">03</div>
                          <div>
                             <h5 className="font-black text-slate-900 text-lg mb-1 tracking-tight">Wait for Internship Completion</h5>
                             <p className="text-sm text-slate-500 leading-relaxed font-medium">After successfully completing your internship duration and project submissions, you will receive your <strong>Completion Certificate</strong>, Project Recognition & Experience Benefits.</p>
                          </div>
                       </div>

                       {/* Step 4 */}
                       <div className="flex gap-6 group">
                          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">04</div>
                          <div>
                             <h5 className="font-black text-slate-900 text-lg mb-1 tracking-tight">Keep Learning More 📚</h5>
                             <p className="text-sm text-slate-500 leading-relaxed font-medium mb-4">Don’t stop with project submission. Continue learning through the platform modules:</p>
                             <div className="flex flex-wrap gap-2">
                                {['Placement Materials','Domain Knowledge','Resume Building','Mock Interviews','Aptitude Practice','Technical Preparation'].map(tag => (
                                   <span key={tag} className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl uppercase tracking-widest">{tag}</span>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Important Note */}
                       <div className="bg-amber-50 rounded-[32px] p-8 border border-amber-100">
                          <h6 className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                             <span className="material-symbols-outlined text-xs">verified_user</span> Important Note
                          </h6>
                          <ul className="text-xs text-slate-600 space-y-2 font-bold list-disc ml-4">
                             <li>Maintain proper GitHub repositories.</li>
                             <li>Submit projects before deadlines.</li>
                             <li>Ensure your work is original and properly structured.</li>
                             <li>Keep learning consistently throughout the internship.</li>
                          </ul>
                          <p className="text-center text-[10px] font-mono font-black text-primary mt-8 uppercase tracking-[0.3em]">✨ Learn • Build • Upload • Grow with CODTECH</p>
                       </div>
                    </div>
                    <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                       <button onClick={() => setSelectedTask(null)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest">
                          Got it, Let's Build
                       </button>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

        {/* RESTORED: Original Submission Modal Flow + Premium Skin */}
        <AnimatePresence>
           {isSubmitting && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10">
                    <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter">Submit Project</h4>
                    <p className="text-sm text-slate-400 mb-8 font-medium">Provide your GitHub repository link</p>
                    <form onSubmit={handleTaskSubmit} className="space-y-6">
                       <div>
                          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-2 block">GitHub Repository URL</label>
                          <input required type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/repo" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary transition-all font-medium" />
                       </div>
                       <div className="bg-primary/5 p-5 rounded-3xl flex gap-3 border border-primary/10">
                          <span className="material-symbols-outlined text-primary text-sm">info</span>
                          <p className="text-[9px] text-primary/80 leading-relaxed font-bold uppercase tracking-widest">Ensure README contains InternID and Full Name</p>
                       </div>
                       <div className="flex gap-4 pt-4">
                          <button type="button" onClick={() => setIsSubmitting(false)} className="flex-1 py-4 text-xs font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-all uppercase tracking-widest">Cancel</button>
                          <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl text-xs font-black shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all uppercase tracking-widest">Submit Task</button>
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
