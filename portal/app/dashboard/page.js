'use client';
import { useEffect, useState } from 'react';
import '../globals.css';
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

        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
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
              className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl transition-all font-bold text-[13px] group relative ${activeTab === item.name ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-colors ${activeTab === item.name ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
              {activeTab === item.name && (
                <motion.div layoutId="active-pill" className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            
            {/* Onboarding - NEW */}
            <section className="bg-gradient-to-br from-slate-900 to-indigo-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-20 opacity-10 blur-3xl bg-indigo-500 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-all duration-1000"></div>
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative z-10">
                  <div className="max-w-md">
                     <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Success Roadmap</span>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">v2.0</span>
                     </div>
                     <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4 leading-none italic italic-shorthand">Internship <span className="text-indigo-400">Accelerator</span></h3>
                     <p className="text-[14px] text-indigo-100/60 font-medium leading-relaxed">Follow the professional pipeline to validate your skills and earn industry-recognized certification.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                     {[
                        { step: 1, label: 'Orientation', done: true },
                        { step: 2, label: 'Curriculum', done: completedLessons.length > 0 },
                        { step: 3, label: 'Project Select', done: selectedProjects.length > 0 },
                        { step: 4, label: 'Submission', done: false },
                        { step: 5, label: 'Certification', done: false }
                     ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-4 px-6 py-4 rounded-3xl border transition-all hover:translate-y-[-4px] ${item.done ? 'bg-white/10 border-white/10 text-white' : 'bg-white/5 border-white/5 text-white/30'}`}>
                           <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black ${item.done ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-white/20'}`}>
                              {item.done ? <span className="material-symbols-outlined text-[16px]">verified</span> : i + 1}
                           </div>
                           <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Greeting - PREMIUM & SPACIOUS */}
            <div className="py-8 px-2 flex flex-col md:flex-row justify-between items-end gap-8">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Active Session</span>
                  </div>
                  <h3 className="text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.85] uppercase italic italic-shorthand">{getGreeting()}, <br/>{user?.name?.split(' ')[0]}</h3>
                  <p className="text-[18px] text-slate-400 font-medium tracking-tight max-w-lg">Accelerate your <span className="text-indigo-600 font-black underline decoration-indigo-200 underline-offset-8">career trajectory</span> with hands-on technical implementation.</p>
               </div>
               <div className="hidden lg:flex items-center gap-12 bg-white px-10 py-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-indigo-100/20">
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Projects</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tighter">{selectedProjects.length}<span className="text-slate-300">/4</span></p>
                  </div>
                  <div className="w-px h-10 bg-slate-100"></div>
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Lessons</p>
                     <p className="text-3xl font-black text-slate-900 tracking-tighter">{completedLessons.length}</p>
                  </div>
               </div>
            </div>

            {/* Analytics & Orientation - BALANCED */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-white p-12 rounded-[3.5rem] border border-slate-200/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] relative group overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Technical Proficiency Index</h4>
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">Skill readiness <span className="text-indigo-600">analysis</span></p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                       <span className="text-6xl font-black text-slate-900 tracking-tighter italic">{getReadinessScore()}</span>
                       <span className="text-xs text-slate-300 font-black tracking-widest uppercase">/100</span>
                    </div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">Top 5% Intern</span>
                  </div>
                </div>
                
                <div className="mt-12 flex items-end justify-between h-40 gap-4 relative z-10">
                   {[30, 45, 35, 60, 50, 75, 100].map((h, i) => (
                     <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${(getReadinessScore() / 100) * h}%` }} 
                        transition={{ delay: i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        key={i} 
                        className={`flex-1 rounded-[1.25rem] transition-all cursor-pointer relative group ${i === 6 ? 'bg-indigo-600 shadow-2xl shadow-indigo-600/30' : 'bg-slate-50 hover:bg-indigo-50'}`} 
                     >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[9px] px-2 py-1 rounded-md font-black">
                           WEEk {i+1}
                        </div>
                     </motion.div>
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#0B0E14] p-12 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-950/20 flex flex-col justify-between relative overflow-hidden group border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] group-hover:bg-indigo-600/40 transition-all duration-1000 -mr-20 -mt-20"></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-center mb-12">
                      <div className="w-14 h-14 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                         <span className="material-symbols-outlined text-indigo-400 text-3xl">hub</span>
                      </div>
                      <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] animate-pulse">Live Session</div>
                   </div>
                   <h4 className="text-3xl font-black tracking-tighter uppercase mb-8 leading-[0.95] italic italic-shorthand">Tech <br/><span className="text-indigo-500">Orientation</span></h4>
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 text-[13px] text-slate-400 font-black uppercase tracking-widest">
                         <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-indigo-500">schedule</span>
                         </div>
                         Friday, 2:00 PM IST
                      </div>
                      <div className="flex items-center gap-4 text-[13px] text-emerald-400 font-black uppercase tracking-widest">
                         <div className="w-10 h-10 rounded-2xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10">
                            <span className="material-symbols-outlined">timer</span>
                         </div>
                         Starts in {countdown}
                      </div>
                   </div>
                </div>
                <button className="w-full bg-white text-slate-950 font-black py-6 rounded-[1.75rem] hover:bg-indigo-500 hover:text-white transition-all text-[12px] uppercase tracking-[0.3em] relative z-10 shadow-2xl shadow-black/40 mt-12 hover:scale-[1.02] active:scale-[0.98]">Launch Classroom</button>
              </div>
            </div>

            {/* PROJECT WORKSPACE - RESTORED ORIGINAL FLOW */}
            <section className="bg-white p-12 rounded-[3.5rem] border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-16">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-4xl">terminal</span>
                     </div>
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em]">Development Phase</span>
                           <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Selected: {selectedProjects.length}/4</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic italic-shorthand">Project <span className="text-indigo-600">Workspace</span></h3>
                        <p className="text-[14px] text-slate-400 font-medium mt-3">Select and implement 4 domain-specific engineering tasks.</p>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full lg:w-auto">
                    <button onClick={() => { setTempSelectedProjects(selectedProjects); setIsProjectModalOpen(true); }} className="flex-1 lg:flex-none bg-indigo-600 text-white px-10 py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 hover:scale-105 active:scale-95">
                       <span className="material-symbols-outlined text-lg">add_circle</span> Browse Library
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 lg:flex-none bg-slate-50 text-slate-500 border border-slate-200/60 px-10 py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                       <span className="material-symbols-outlined text-lg">auto_awesome</span> View Guide
                    </button>
                  </div>
               </div>

               {selectedProjects.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} whileHover={{ y: -10 }} className="bg-white p-8 rounded-[3rem] border border-slate-100 group relative transition-all hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] hover:border-indigo-200">
                        <button onClick={() => removeProject(proj)} className="absolute top-6 right-6 w-10 h-10 bg-red-50 text-red-300 rounded-2xl flex items-center justify-center hover:text-red-500 hover:bg-red-100 transition-all z-10 border border-red-100 opacity-0 group-hover:opacity-100">
                           <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                        </button>
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-10 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                           <span className="material-symbols-outlined text-[28px]">code_blocks</span>
                        </div>
                        <div className="mb-10">
                           <span className="text-[10px] font-black text-indigo-600/40 uppercase tracking-[0.3em] mb-3 block">Task {idx + 1}</span>
                           <h5 className="font-black text-slate-900 text-[15px] line-clamp-2 h-12 leading-[1.2] tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{proj}</h5>
                        </div>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-slate-900 text-white border border-slate-900 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:border-indigo-600 transition-all active:scale-95 shadow-xl shadow-black/10">Submit Work</button>
                      </motion.div>
                    ))}
                    {selectedProjects.length < 4 && (
                      <div onClick={() => setIsProjectModalOpen(true)} className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-indigo-400/40 transition-all group min-h-[320px]">
                         <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition-all mb-6 shadow-sm border border-slate-100 group-hover:scale-110">
                            <span className="material-symbols-outlined text-3xl">add</span>
                         </div>
                         <h6 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-2">Assign Project</h6>
                         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Available slot</p>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3.5rem] py-32 px-12 text-center flex flex-col items-center justify-center group transition-all hover:bg-white hover:border-indigo-400/20">
                    <div className="w-24 h-24 bg-white text-slate-200 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-xl shadow-black/5 group-hover:text-indigo-600 transition-all rotate-6 group-hover:rotate-0 group-hover:scale-110 border border-slate-100">
                       <span className="material-symbols-outlined text-5xl">work_history</span>
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic italic-shorthand">No Projects <span className="text-indigo-600">Assigned</span></h4>
                    <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-12 max-w-sm leading-relaxed">Initialize your workspace by selecting up to 4 core projects from the technical library.</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-indigo-600 text-white px-16 py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:scale-105 transition-all hover:bg-indigo-700">Browse Project Library</button>
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {activeTab === 'Materials' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
            {/* Materials Header - PREMIUM */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 py-8 px-2">
               <div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">Education Portal</span>
                  </div>
                  <h3 className="text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85] italic italic-shorthand">{user?.course} <br/><span className="text-indigo-600">Curriculum</span></h3>
                  <p className="text-[18px] text-slate-400 font-medium mt-6 max-w-xl">A professional-grade learning path designed to bridge the gap between academic theory and industry implementation.</p>
               </div>
               <div className="flex items-center gap-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-indigo-100/20">
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Modules</p>
                     <p className="text-4xl font-black text-slate-900 tracking-tighter">{(materials.length > 0 ? materials : DEFAULT_MODULES).length}</p>
                  </div>
                  <div className="w-px h-12 bg-slate-100"></div>
                  <div className="text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Mastery</p>
                     <p className="text-4xl font-black text-emerald-500 tracking-tighter">
                        {Math.round((completedLessons.length / (((materials.length > 0 ? materials : DEFAULT_MODULES).length) * 4)) * 100) || 0}%
                     </p>
                  </div>
               </div>
            </div>

            {/* Modules Grid - REFINED */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {(materials.length > 0 ? materials : DEFAULT_MODULES).map((mod, idx) => (
                 <motion.div 
                   key={mod.id} 
                   whileHover={{ y: -12, scale: 1.02 }}
                   onClick={() => setSelectedModule(mod)}
                   className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_-12px_rgba(79,70,229,0.12)] transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="material-symbols-outlined text-indigo-600 text-3xl">arrow_forward_ios</span>
                    </div>
                    <div className="flex justify-between items-start mb-12">
                       <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-700 shadow-sm">
                          <span className="material-symbols-outlined text-3xl">auto_stories</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <div className="px-4 py-1.5 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-xl border border-slate-100">{mod.difficulty}</div>
                          <span className="text-[11px] font-black text-indigo-600 mt-3 uppercase tracking-widest">⏱ {mod.time}</span>
                       </div>
                    </div>
                    <div className="flex-1">
                       <span className="text-[10px] font-black text-indigo-600/40 uppercase tracking-[0.4em] mb-3 block">Module {idx + 1}</span>
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors uppercase leading-[1.1]">{mod.title}</h4>
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
                
                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                   {tasks.length === 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3,4,5,6].map(i => (
                          <div key={i} className="h-48 bg-white border border-slate-100 rounded-[2rem] animate-pulse flex flex-col p-6 gap-4">
                             <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                             <div className="w-2/3 h-4 bg-slate-100 rounded" />
                             <div className="w-full h-8 bg-slate-100 rounded-xl mt-auto" />
                          </div>
                        ))}
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((proj, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: i * 0.05 }}
                             onClick={() => toggleProject(proj.title)} 
                             className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group flex flex-col gap-6 relative overflow-hidden ${tempSelectedProjects.includes(proj.title) ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200' : 'bg-white border-slate-200/60 hover:border-indigo-400/40 text-slate-800 hover:shadow-2xl hover:shadow-indigo-100/30'}`}
                           >
                              <div className="flex justify-between items-start">
                                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 transition-all ${tempSelectedProjects.includes(proj.title) ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                    {i + 1}
                                 </div>
                                 <span className={`material-symbols-outlined text-[28px] transition-all ${tempSelectedProjects.includes(proj.title) ? 'text-white' : 'text-slate-200 group-hover:text-indigo-600'}`}>{tempSelectedProjects.includes(proj.title) ? 'check_circle' : 'add_circle'}</span>
                              </div>
                              <div>
                                 <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-2 block ${tempSelectedProjects.includes(proj.title) ? 'text-white/60' : 'text-indigo-600'}`}>{proj.level || 'Intermediate'}</span>
                                 <h5 className="font-black text-[16px] leading-snug tracking-tight uppercase line-clamp-2 h-12">{proj.title}</h5>
                              </div>
                              <p className={`text-[12px] font-medium leading-relaxed line-clamp-2 ${tempSelectedProjects.includes(proj.title) ? 'text-white/80' : 'text-slate-400'}`}>{proj.description || 'Professional technical implementation following industry best practices and standards.'}</p>
                           </motion.div>
                        ))}
                     </div>
                   )}
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
