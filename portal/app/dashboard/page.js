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
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
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
    const fetchDashboardData = async () => {
      try {
        const [userRes, materialsRes, tasksRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/materials'),
          fetch('/api/tasks')
        ]);
        
        const userData = await userRes.json();
        const materialsData = await materialsRes.json();
        const tasksData = await tasksRes.json();

        if (userData.success) {
          setUser(userData.user);
        } else {
          router.push('/login');
          return;
        }

        if (materialsData.success) setMaterials(materialsData.data);
        if (tasksData.success) setTasks(tasksData.data);
      } catch (err) {
        toast.error('Failed to load session');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
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
            
            {/* Onboarding - COMPACT */}
            <section className="bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-6 relative z-10">
                  <div className="max-w-sm">
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Quick Guide</span>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">Workflow</span>
                     </div>
                     <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none italic">Internship <span className="text-indigo-400">Accelerator</span></h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {[
                        { step: 1, label: 'Orientation', done: true },
                        { step: 2, label: 'Read Materials', done: completedLessons.length > 0 },
                        { step: 3, label: 'Select 4 Projects', done: selectedProjects.length > 0 },
                        { step: 4, label: 'Submit GitHub', done: false },
                        { step: 5, label: 'Get Certified', done: false }
                     ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${item.done ? 'bg-white/10 border-white/10 text-white' : 'bg-white/5 border-white/5 text-white/20'}`}>
                           <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black ${item.done ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/20'}`}>
                              {item.done ? <span className="material-symbols-outlined text-[12px]">check</span> : i + 1}
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Greeting - COMPACT */}
            <div className="py-4 px-2 flex flex-col md:flex-row justify-between items-end gap-6">
               <div>
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-1 h-1 rounded-full bg-indigo-600 animate-pulse"></div>
                     <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em]">Active Session</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-3 leading-tight uppercase italic">{getGreeting()}, {user?.name?.split(' ')[0]}</h3>
                  <p className="text-[14px] text-slate-400 font-medium tracking-tight">Step into your <span className="text-indigo-600 font-bold">professional roadmap</span> and complete your tasks.</p>
               </div>
               <div className="hidden lg:flex items-center gap-8 bg-white px-8 py-4 rounded-[2rem] border border-slate-100 shadow-lg shadow-indigo-100/10">
                  <div className="text-center">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Projects</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">{selectedProjects.length}<span className="text-slate-300">/4</span></p>
                  </div>
                  <div className="w-px h-8 bg-slate-100"></div>
                  <div className="text-center">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Lessons</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">{completedLessons.length}</p>
                  </div>
               </div>
            </div>

            {/* Analytics & Orientation - COMPACT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Proficiency Index</h4>
                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Skill <span className="text-indigo-600">Analysis</span></p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                       <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{getReadinessScore()}</span>
                       <span className="text-[10px] text-slate-300 font-black tracking-widest uppercase">/100</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex items-end justify-between h-24 gap-2 relative z-10">
                   {[30, 45, 35, 60, 50, 75, 100].map((h, i) => (
                     <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${(getReadinessScore() / 100) * h}%` }} 
                        transition={{ delay: i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        key={i} 
                        className={`flex-1 rounded-lg transition-all cursor-pointer relative group ${i === 6 ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-50 hover:bg-indigo-50'}`} 
                     />
                   ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden group border border-white/5">
                <div className="relative z-10">
                   <div className="flex justify-between items-center mb-6">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                         <span className="material-symbols-outlined text-indigo-400 text-xl">hub</span>
                      </div>
                      <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Live</div>
                   </div>
                   <h4 className="text-xl font-black tracking-tighter uppercase mb-4 italic">Tech <span className="text-indigo-500">Orientation</span></h4>
                   <div className="space-y-3">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-black uppercase tracking-widest">
                         <span className="material-symbols-outlined text-indigo-500 text-sm">schedule</span>
                         Fri, 2:00 PM IST
                      </div>
                   </div>
                </div>
                <button className="w-full bg-white text-slate-950 font-black py-4 rounded-xl hover:bg-indigo-500 hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] mt-6">Enter Classroom</button>
              </div>
            </div>

            {/* PROJECT WORKSPACE - COMPACT & FUNCTIONAL */}
            <section className="bg-white p-8 rounded-[2rem] border border-slate-200/60">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shrink-0">
                        <span className="material-symbols-outlined text-2xl">terminal</span>
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Project <span className="text-indigo-600">Workspace</span></h3>
                        <p className="text-[12px] text-slate-400 font-medium mt-1">Select 4 core projects for your domain.</p>
                     </div>
                  </div>
                  <div className="flex gap-3 w-full lg:w-auto">
                    <button onClick={() => { setTempSelectedProjects(selectedProjects); setIsProjectModalOpen(true); }} className="flex-1 lg:flex-none bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-base">add_circle</span> Browse Projects
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 lg:flex-none bg-slate-50 text-slate-500 border border-slate-200/60 px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-base">auto_awesome</span> View Guide
                    </button>
                  </div>
               </div>

               {selectedProjects.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedProjects.map((proj, idx) => (
                      <motion.div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 group relative transition-all hover:border-indigo-200 shadow-sm">
                        <button onClick={() => removeProject(proj)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-all z-10">
                           <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 bg-slate-50 text-indigo-600 rounded-lg flex items-center justify-center border border-slate-100">
                              <span className="material-symbols-outlined text-xl">code</span>
                           </div>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Task {idx + 1}</span>
                        </div>
                        <h5 className="font-black text-slate-900 text-[13px] line-clamp-2 h-8 leading-tight tracking-tight uppercase mb-4">{proj}</h5>
                        <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-slate-900 text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Submit</button>
                      </motion.div>
                    ))}
                 </div>
               ) : (
                 <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] py-16 px-8 text-center flex flex-col items-center justify-center">
                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 italic">No Projects Selected</h4>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-8">Choose up to 4 projects for your internship.</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-indigo-700">Browse Projects</button>
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
        </AnimatePresence>        {/* MODAL - COMPACT PROJECT SELECTION */}
        <AnimatePresence>
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProjectModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-2xl h-[70vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200/60">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                   <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Project Library</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select 4 projects ({tempSelectedProjects.length}/4)</p>
                   </div>
                   <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined">close</span></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                   <div className="grid grid-cols-1 gap-3">
                      {tasks.map((proj, i) => (
                         <div 
                           key={i} 
                           onClick={() => toggleProject(proj.title)} 
                           className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${tempSelectedProjects.includes(proj.title) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-800'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${tempSelectedProjects.includes(proj.title) ? 'bg-white/20' : 'bg-slate-50 text-slate-400'}`}>{i + 1}</div>
                               <h5 className="font-black text-[13px] uppercase tracking-tight">{proj.title}</h5>
                            </div>
                            <span className="material-symbols-outlined text-lg">{tempSelectedProjects.includes(proj.title) ? 'check_circle' : 'add_circle'}</span>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white flex justify-center">
                   <button 
                      onClick={confirmProjectSelection} 
                      disabled={tempSelectedProjects.length === 0}
                      className={`px-12 py-3 rounded-xl font-black text-[10px] transition-all uppercase tracking-widest ${tempSelectedProjects.length === 0 ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'}`}
                   >
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
