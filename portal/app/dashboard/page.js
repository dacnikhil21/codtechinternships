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

  const getBadge = (xp) => {
    if (xp >= 3001) return { name: 'Interview Ready', icon: 'verified', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' };
    if (xp >= 1501) return { name: 'Advanced', icon: 'grade', color: 'text-amber-700 bg-amber-50 border-amber-100' };
    if (xp >= 501) return { name: 'Intermediate', icon: 'military_tech', color: 'text-primary bg-primary/5 border-primary/10' };
    return { name: 'Beginner', icon: 'stadium', color: 'text-slate-600 bg-slate-50 border-slate-100' };
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
      
      {/* Sidebar - EXACT ORIGINAL PROPORTIONS */}
      <aside className={`w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-[70] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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

        <div className="p-4 border-t border-slate-100 m-2 bg-slate-50 rounded-2xl">
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

      {/* Main Content - EXACT ORIGINAL PADDING */}
      <main className={`flex-1 transition-all lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0`}>
        
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">terminal</span>
            </div>
            <h1 className="text-slate-900 font-black text-xs uppercase tracking-tight">Codtech</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 flex items-center justify-center text-slate-600">
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Dashboard Header - EXACT ORIGINAL STRUCTURE */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-[9px] font-mono font-bold text-primary mb-1 uppercase tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
               {activeTab}
            </h2>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Welcome, {user?.name?.split(' ')[0]} 👋</h3>
          </div>
          
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
             <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${getBadge(user?.xp || 0).color}`}>
                <span className="material-symbols-outlined text-[10px]">{getBadge(user?.xp || 0).icon}</span>
                {getBadge(user?.xp || 0).name}
             </div>
             <div className="h-3 w-px bg-slate-200 mx-1"></div>
             <div className="flex items-center gap-1.5 text-slate-900 font-black text-[11px]">
                <span className="material-symbols-outlined text-amber-500 text-xs">rocket_launch</span>
                {user?.xp || 0} <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-0.5">XP</span>
             </div>
          </div>
        </header>

        {activeTab === 'Projects' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/50 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900 tracking-tight">Internship Progress</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Performance Hub</p>
                  </div>
                  <div className="bg-primary/5 text-primary px-3 py-1 rounded-xl font-black text-lg">84%</div>
                </div>
                <div className="flex items-end justify-between h-20 gap-2">
                   {[40, 55, 65, 80, 70, 85, 95].map((h, i) => (
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} key={i} className={`flex-1 rounded-lg transition-all ${i === 6 ? 'bg-primary shadow-lg shadow-primary/30' : 'bg-primary/10'}`} />
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-primary p-6 rounded-3xl text-white shadow-xl shadow-primary/30 flex flex-col justify-between">
                <div>
                   <span className="text-[8px] font-mono font-bold text-white/50 mb-2 block uppercase tracking-widest">Next Career Orientation</span>
                   <h4 className="text-lg font-black tracking-tight leading-tight mb-1">Technical Internship Mastery</h4>
                   <p className="text-[10px] text-white/70 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                      <span className="material-symbols-outlined text-xs">calendar_month</span> Fri • 2:00 PM IST
                   </p>
                </div>
                <button className="w-full bg-white text-primary font-black py-2.5 rounded-xl mt-4 hover:scale-[1.02] transition-all text-[10px] uppercase tracking-widest shadow-lg active:scale-95">Enter Mentorship Room</button>
              </div>
            </div>

            {/* PROJECTS SECTION - EXACT ORIGINAL LOGIC & LAYOUT */}
            <section className="space-y-4">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-1">
                  <div>
                     <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Projects Workspace</h3>
                     <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Manage your 4 selected internship tasks</p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => setIsProjectModalOpen(true)} className="flex-1 sm:flex-none bg-primary text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-xs">add_circle</span> View Projects
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 sm:flex-none bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2 border border-slate-200/50">
                       <span className="material-symbols-outlined text-xs">rocket_launch</span> Roadmap
                    </button>
                  </div>
               </div>

               {selectedProjects.length === 0 ? (
                 <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center group hover:border-primary transition-all">
                    <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                       <span className="material-symbols-outlined text-3xl">work_outline</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 mb-1">Select Your Projects First</h4>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto mb-6 font-bold uppercase tracking-widest leading-relaxed">Choose up to 4 specialized projects from our database to start your journey.</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-primary text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-110 transition-all">Select Projects Now</button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xl shadow-indigo-100/50 group/card relative transition-all">
                        <button onClick={() => toggleProject(proj)} className="absolute top-3 right-3 w-6 h-6 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all z-10 border border-slate-100 opacity-0 group-hover/card:opacity-100">
                           <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                        <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover/card:bg-primary group-hover/card:text-white transition-all shadow-sm">
                           <span className="material-symbols-outlined text-xl">database</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-[11px] mb-2 line-clamp-2 h-8 leading-tight tracking-tight uppercase">{proj}</h5>
                        <div className="flex items-center gap-1.5 text-[8px] font-mono font-black text-primary/60 mb-5 uppercase tracking-[0.2em]">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Progress Active
                        </div>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-white text-primary border border-primary/20 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">Submit Link</button>
                      </motion.div>
                    ))}
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {/* MATERIALS & PREPARATION - EXACT ORIGINAL DENSITY */}
        {(activeTab === 'Materials' || activeTab === 'Preparation') && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === 'Materials' ? (
                materials.map((item, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-lg shadow-indigo-100/50 flex items-center gap-4 hover:scale-[1.02] transition-all cursor-pointer group">
                     <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all"><span className="material-symbols-outlined">description</span></div>
                     <div><h5 className="font-black text-slate-900 text-xs tracking-tight uppercase">{item.name}</h5><p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">Reference Material</p></div>
                  </div>
                ))
              ) : (
                prepContent.map((card, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-indigo-100/50 relative group">
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all"><span className="material-symbols-outlined text-xl">psychology</span></div>
                     <h5 className="font-black text-slate-900 text-xs mb-2 h-8 line-clamp-2 tracking-tight uppercase">{card.title}</h5>
                     <p className="text-[10px] text-slate-500 mb-6 leading-relaxed line-clamp-3 font-bold uppercase tracking-wide">{card.content}</p>
                     <button className="w-full bg-slate-50 text-slate-900 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-slate-100 shadow-sm active:scale-95">Start Learning</button>
                  </div>
                ))
              )}
           </div>
        )}

        {/* PROJECT MODAL - 100% ORIGINAL CONTENT & FLOW */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-4xl h-[85vh] rounded-[40px] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-100">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
                   <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Browse Domain Projects</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Select 4 specialized tasks for your portfolio</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="bg-primary/5 text-primary px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] border border-primary/10">
                         {selectedProjects.length}/4 Selected
                      </div>
                      <button onClick={() => setIsProjectModalOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:text-red-500 transition-all border border-slate-100"><span className="material-symbols-outlined">close</span></button>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                   {tasks.map((proj, i) => (
                      <div key={i} onClick={() => toggleProject(proj.title)} className={`p-5 rounded-3xl border transition-all cursor-pointer group flex flex-col justify-between h-36 ${selectedProjects.includes(proj.title) ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-50 border-transparent hover:border-primary/30 text-slate-800 hover:bg-white hover:shadow-xl hover:shadow-indigo-100'}`}>
                         <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono font-black opacity-30 tracking-widest">{String(i+1).padStart(2, '0')}</span>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-sm ${selectedProjects.includes(proj.title) ? 'bg-white text-primary' : 'bg-white text-slate-300'}`}>
                               <span className="material-symbols-outlined text-[16px] font-black">{selectedProjects.includes(proj.title) ? 'check' : 'add'}</span>
                            </div>
                         </div>
                         <h5 className="font-black text-[10px] leading-tight pr-4 uppercase tracking-wide">{proj.title}</h5>
                      </div>
                   ))}
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
                   <button onClick={() => setIsProjectModalOpen(false)} className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em]">
                      Confirm Domain Path
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ROADMAP MODAL - 100% ORIGINAL CONTENT & STEPS */}
        <AnimatePresence>
          {selectedTask && selectedTask.title === 'Project Implementation Guide' && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTask(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-slate-100">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Internship Roadmap</h4>
                  <button onClick={() => setSelectedTask(null)} className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-all shadow-sm border border-slate-100"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">01</div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">Select Any 4 Projects</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wide">Choose 4 specialized tasks from your enrolled domain.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">02</div>
                      <div className="flex-1">
                        <p className="font-black text-slate-900 text-sm tracking-tight">Understand & Start Working</p>
                        
                        {/* Technical */}
                        <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                          <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-3">✅ Technical / Coding Tracks</p>
                          <ul className="text-[10px] text-slate-600 space-y-2 list-disc ml-3 font-bold uppercase tracking-wide">
                            <li>Write complete code with comments</li>
                            <li>Organize files neatly in folders</li>
                            <li>Upload to a unique GitHub repo per project</li>
                            <li>Submit the repository link to us</li>
                          </ul>
                          <div className="mt-3 pt-3 border-t border-indigo-100/50">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Required in README:</p>
                             <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wide">Intern ID, Name, Project Scope & Screenshots</p>
                          </div>
                        </div>

                        {/* Non-IT */}
                        <div className="mt-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                          <p className="text-[9px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-2">✅ Non-IT / Creative / Design</p>
                          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wide">Create Images, Posters, Visuals, Presentations, Reports or UI Designs. Upload all files to GitHub and submit the link.</p>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">03</div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">Internship Completion 🎓</p>
                        <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-wide">Receive your Completion Certificate, Project Recognition & Experience Benefits.</p>
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
                      <p className="text-[9px] font-black text-amber-700 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                         <span className="material-symbols-outlined text-xs">warning</span> Important Compliance
                      </p>
                      <ul className="text-[10px] text-slate-600 space-y-2 list-disc ml-3 font-bold uppercase tracking-wide">
                        <li>Maintain proper GitHub repositories</li>
                        <li>Submit projects before deadlines</li>
                        <li>Ensure work is original and properly structured</li>
                      </ul>
                      <p className="text-center text-[10px] font-black text-primary mt-6 tracking-[0.3em] uppercase">✨ Learn • Build • Upload • Grow</p>
                    </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-100 flex justify-center">
                  <button onClick={() => setSelectedTask(null)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-xs shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em]">
                    Got it, Let's Build! 🚀
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SUBMISSION MODAL - 100% ORIGINAL STRUCTURE */}
        <AnimatePresence>
          {isSubmitting && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSubmitting(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative z-10 overflow-hidden border border-slate-100 p-8">
                <form onSubmit={handleTaskSubmit}>
                  <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Submit Project</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-8">Upload your GitHub repository link</p>
                  <div className="space-y-5">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">GitHub Repository URL</label>
                      <input required type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/project" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 mt-2 text-[11px] focus:outline-none focus:border-primary transition-all font-bold tracking-wide" />
                    </div>
                    <div className="bg-primary/5 p-5 rounded-3xl flex gap-3 border border-primary/10">
                      <span className="material-symbols-outlined text-primary text-sm">info</span>
                      <p className="text-[10px] text-primary/70 leading-relaxed font-bold uppercase tracking-wide">Include **InternID**, **Name**, and **Project Scope** in your README.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-10">
                    <button type="button" onClick={() => setIsSubmitting(false)} className="flex-1 bg-slate-50 text-slate-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                    <button type="submit" className="flex-1 bg-primary text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Submit Link</button>
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
