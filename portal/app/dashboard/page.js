'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRICULUM, DEFAULT_MODULES } from '@/lib/curriculum';
import CourseViewer from '@/app/components/CourseViewer';
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
  const [tempSelectedProjects, setTempSelectedProjects] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [countdown, setCountdown] = useState('');
  
  // Learning Portal States
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Target: Next Friday 2:00 PM (14:00)
      let target = new Date();
      target.setDate(now.getDate() + (5 + 7 - now.getDay()) % 7);
      target.setHours(14, 0, 0, 0);
      
      if (now > target) {
        target.setDate(target.getDate() + 7);
      }
      
      const diff = target - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      
      setCountdown(`${days}d ${hours}h ${minutes}m`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  const getReadinessScore = () => {
    const projectScore = (selectedProjects.length / 4) * 50;
    const moduleCount = (materials.length > 0 ? materials : DEFAULT_MODULES).length;
    const lessonScore = moduleCount > 0 ? (completedLessons.length / (moduleCount * 4)) * 50 : 0; // Assuming ~4 lessons per module avg
    return Math.min(Math.round(projectScore + lessonScore + 10), 100); // 10 base score
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getBadge = (xp) => {
    if (xp >= 3001) return { name: 'INTERVIEW READY', icon: 'verified', color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100/50' };
    if (xp >= 1501) return { name: 'ADVANCED', icon: 'grade', color: 'text-amber-600 bg-amber-50/50 border-amber-100/50' };
    if (xp >= 501) return { name: 'INTERMEDIATE', icon: 'military_tech', color: 'text-primary bg-primary/5 border-primary/10' };
    return { name: 'BEGINNER', icon: 'stadium', color: 'text-slate-500 bg-slate-50 border-slate-200/60' };
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const savedProj = localStorage.getItem(`selected_projects_${user.id}`);
      if (savedProj) {
        const parsed = JSON.parse(savedProj);
        setSelectedProjects(parsed);
        setTempSelectedProjects(parsed);
      }
      const savedLessons = localStorage.getItem(`completed_lessons_${user.id}`);
      if (savedLessons) setCompletedLessons(JSON.parse(savedLessons));
    }
  }, [user?.id]);

  const toggleProject = (projTitle) => {
    setTempSelectedProjects(prev => {
      if (prev.includes(projTitle)) {
        return prev.filter(p => p !== projTitle);
      } else {
        if (prev.length >= 4) {
          toast.error('You can select maximum 4 projects');
          return prev;
        }
        return [...prev, projTitle];
      }
    });
  };

  const confirmProjectSelection = () => {
    setSelectedProjects(tempSelectedProjects);
    if (user?.id) {
      localStorage.setItem(`selected_projects_${user.id}`, JSON.stringify(tempSelectedProjects));
    }
    setIsProjectModalOpen(false);
    toast.success('Project selection updated');
  };

  const removeProject = (projTitle) => {
    const updated = selectedProjects.filter(p => p !== projTitle);
    setSelectedProjects(updated);
    setTempSelectedProjects(updated);
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

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
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
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all font-bold text-[13px] group relative ${activeTab === item.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${activeTab === item.name ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
              {activeTab === item.name && (
                <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
              )}
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
            
            {/* Greeting - PREMIUM & SPACIOUS */}
            <div className="py-2">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h3>
               <p className="text-[14px] text-slate-400 font-medium tracking-tight">Continue your <span className="text-primary font-bold">{user?.course} internship</span> journey.</p>
            </div>

            {/* Analytics & Orientation - BALANCED */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative group overflow-hidden">
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Career Readiness Score</h4>
                    <p className="text-[11px] text-slate-300 font-bold mt-1 uppercase">Holistic Performance Analysis</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary tracking-tighter">{getReadinessScore()}</span>
                    <span className="text-xs text-slate-300 font-black tracking-widest uppercase">/100</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 gap-3 relative z-10">
                   {[40, 55, 65, 80, 70, 85, 100].map((h, i) => (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: `${(getReadinessScore() / 100) * (h + 20)}%`, opacity: 1 }} 
                        transition={{ delay: i * 0.1, duration: 0.8, ease: "circOut" }}
                        key={i} 
                        className={`flex-1 rounded-2xl transition-all cursor-pointer ${i === 6 ? 'bg-primary shadow-[0_10px_20px_rgba(124,58,237,0.3)]' : 'bg-primary/5 hover:bg-primary/10'}`} 
                     />
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200/50 flex flex-col justify-between relative overflow-hidden group border border-slate-800">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                         <span className="material-symbols-outlined text-primary text-lg">broadcast_on_personal</span>
                      </div>
                      <h4 className="text-base font-black tracking-tight uppercase">Tech Orientation</h4>
                   </div>
                   <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                         <span className="material-symbols-outlined text-sm text-primary">calendar_month</span>
                         Friday, 2:00 PM
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-emerald-400 font-bold uppercase tracking-widest">
                         <span className="material-symbols-outlined text-sm">schedule</span>
                         Starts in {countdown}
                      </div>
                   </div>
                </div>
                <button className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-primary hover:text-white transition-all text-[11px] uppercase tracking-[0.2em] relative z-10 shadow-xl shadow-black/10 mt-10">Join Live Session</button>
              </div>
            </div>

            {/* PROJECT WORKSPACE - RESTORED ORIGINAL FLOW */}
            <section className="bg-white p-10 rounded-[2.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-primary/5 text-primary rounded-[1.5rem] flex items-center justify-center border border-primary/10 shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Project Workspace</h3>
                        <p className="text-[13px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Select up to 4 major tasks to complete your internship.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => { setTempSelectedProjects(selectedProjects); setIsProjectModalOpen(true); }} className="flex-1 md:flex-none bg-primary text-white px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">add</span> Browse Library
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 md:flex-none bg-slate-50 text-slate-500 border border-slate-200/60 px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">help_outline</span> Guide
                    </button>
                  </div>
               </div>

               {selectedProjects.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -6 }} className="bg-white p-6 rounded-[2rem] border border-slate-100 group relative transition-all hover:shadow-2xl hover:shadow-indigo-100/40 hover:border-primary/20">
                        <button onClick={() => removeProject(proj)} className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-300 rounded-xl flex items-center justify-center hover:text-red-500 transition-all z-10 border border-red-100 opacity-0 group-hover:opacity-100">
                           <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                        <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                           <span className="material-symbols-outlined text-[24px]">terminal</span>
                        </div>
                        <div className="mb-6">
                           <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.2em] mb-1 block">Project {idx + 1}</span>
                           <h5 className="font-black text-slate-900 text-[13px] line-clamp-2 h-10 leading-tight tracking-tight uppercase">{proj}</h5>
                        </div>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-slate-50 text-primary border border-primary/5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">Submit Project</button>
                      </motion.div>
                    ))}
                    {selectedProjects.length < 4 && (
                      <div onClick={() => setIsProjectModalOpen(true)} className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-primary/40 transition-all group">
                         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-300 group-hover:text-primary transition-all mb-3 shadow-sm">
                            <span className="material-symbols-outlined">add</span>
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Project</p>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 px-10 text-center flex flex-col items-center justify-center group transition-all hover:bg-white hover:border-primary/20">
                    <div className="w-20 h-20 bg-white text-slate-200 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:text-primary transition-all rotate-3 group-hover:rotate-0">
                       <span className="material-symbols-outlined text-4xl">work_outline</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">No Projects Selected</h4>
                    <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-8 max-w-xs leading-relaxed">Choose up to 4 projects for your internship to get started.</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all">Browse Library</button>
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {activeTab === 'Materials' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            {/* Materials Header - PREMIUM */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 py-4">
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Curriculum</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Domain Specific</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{user?.course} Track</h3>
                  <p className="text-[14px] text-slate-400 font-medium mt-2">Professional learning path designed by industry experts.</p>
               </div>
               <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="text-center px-6 border-r border-slate-100">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Modules</p>
                     <p className="text-2xl font-black text-primary tracking-tighter">{(materials.length > 0 ? materials : DEFAULT_MODULES).length}</p>
                  </div>
                  <div className="text-center px-6">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Completion</p>
                     <p className="text-2xl font-black text-emerald-500 tracking-tighter">
                        {Math.round((completedLessons.length / (((materials.length > 0 ? materials : DEFAULT_MODULES).length) * 4)) * 100) || 0}%
                     </p>
                  </div>
               </div>
            </div>

            {/* Modules Grid - REFINED */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {(materials.length > 0 ? materials : DEFAULT_MODULES).map((mod, idx) => (
                 <motion.div 
                   key={mod.id} 
                   whileHover={{ y: -8, scale: 1.02 }}
                   onClick={() => setSelectedModule(mod)}
                   className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:shadow-indigo-100/50 transition-all cursor-pointer group flex flex-col h-full"
                 >
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-14 h-14 bg-primary/5 text-primary rounded-[1.25rem] flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                          <span className="material-symbols-outlined text-2xl">auto_stories</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <div className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100">{mod.difficulty}</div>
                          <span className="text-[10px] font-black text-primary mt-2 uppercase tracking-widest">{mod.time}</span>
                       </div>
                    </div>
                    <div className="flex-1">
                       <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em] mb-2 block">Module {idx + 1}</span>
                       <h4 className="text-lg font-black text-slate-900 tracking-tight mb-3 group-hover:text-primary transition-colors uppercase leading-tight">{mod.title}</h4>
                       <p className="text-[13px] text-slate-400 font-medium leading-relaxed mb-8 line-clamp-3">{mod.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-300 text-sm">list_alt</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{mod.lessons.length} LESSONS</span>
                       </div>
                       <button className="w-10 h-10 rounded-full bg-slate-50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                       </button>
                    </div>
                 </motion.div>
               ))}
            </div>

            {/* Course Viewer is now moved outside for global access */}
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

            {/* No projects empty state or logic can go here if needed */}
          </motion.div>
        )}

        {/* GLOBAL COURSE VIEWER */}
        <AnimatePresence>
          {selectedModule && (
            <CourseViewer 
              selectedModule={selectedModule} 
              completedLessons={completedLessons}
              onToggleLesson={(lessonId) => {
                const updated = completedLessons.includes(lessonId) 
                  ? completedLessons.filter(id => id !== lessonId)
                  : [...completedLessons, lessonId];
                setCompletedLessons(updated);
                if (user?.id) localStorage.setItem(`completed_lessons_${user.id}`, JSON.stringify(updated));
              }}
              onClose={() => { setSelectedModule(null); setSelectedLesson(null); }} 
            />
          )}
        </AnimatePresence>

        {/* MODAL - REFINED PROJECT SELECTION */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
              <motion.div initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 20 }} className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200/60">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                   <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">Project Library</h4>
                      <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Select exactly 4 projects for your internship.</p>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="bg-primary/5 text-primary px-5 py-2 rounded-2xl font-black text-[11px] border border-primary/10 tracking-[0.1em]">
                         {tempSelectedProjects.length}/4 SELECTED
                      </div>
                      <button onClick={() => setIsProjectModalOpen(false)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:text-red-500 transition-all border border-slate-200/60"><span className="material-symbols-outlined text-base">close</span></button>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/30">
                   {tasks.map((proj, i) => (
                      <div key={i} onClick={() => toggleProject(proj.title)} className={`p-6 rounded-[2rem] border transition-all cursor-pointer group flex flex-col gap-4 relative overflow-hidden ${tempSelectedProjects.includes(proj.title) ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' : 'bg-white border-slate-200/60 hover:border-primary/40 text-slate-800 hover:shadow-xl hover:shadow-indigo-100/30'}`}>
                         <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[12px] shrink-0 transition-all ${tempSelectedProjects.includes(proj.title) ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'}`}>
                               {i + 1}
                            </div>
                            <span className={`material-symbols-outlined text-[22px] transition-all ${tempSelectedProjects.includes(proj.title) ? 'text-white' : 'text-slate-200 group-hover:text-primary'}`}>{tempSelectedProjects.includes(proj.title) ? 'check_circle' : 'add_circle'}</span>
                         </div>
                         <div>
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 block ${tempSelectedProjects.includes(proj.title) ? 'text-white/60' : 'text-primary'}`}>{proj.level || 'Intermediate'}</span>
                            <h5 className="font-black text-[14px] leading-tight tracking-tight uppercase line-clamp-2 h-10">{proj.title}</h5>
                         </div>
                         <p className={`text-[11px] font-medium leading-relaxed line-clamp-2 ${tempSelectedProjects.includes(proj.title) ? 'text-white/80' : 'text-slate-400'}`}>{proj.description || 'Advanced technical implementation project with industry standards.'}</p>
                      </div>
                   ))}
                </div>

                <div className="p-8 border-t border-slate-100 bg-white flex flex-col items-center gap-4">
                   <button 
                      onClick={confirmProjectSelection} 
                      disabled={tempSelectedProjects.length === 0}
                      className={`px-16 py-4 rounded-2xl font-black text-[12px] shadow-2xl transition-all uppercase tracking-[0.2em] ${tempSelectedProjects.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary text-white shadow-primary/30 hover:scale-105 active:scale-95'}`}
                   >
                      Confirm Selection
                   </button>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">You can change your selection anytime before submission</p>
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
