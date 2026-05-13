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
import PdfViewer from '@/app/components/PdfViewer';

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
  const [materials, setMaterials] = useState([]); // This will now hold PDF objects
  const [totalXP, setTotalXP] = useState(0);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [tempSelectedProjects, setTempSelectedProjects] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [countdown, setCountdown] = useState('');
  
  // Learning Portal States
  const [selectedModule, setSelectedModule] = useState(null); // Used by Prep tab
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null); // Used by Materials tab

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
        const [userRes, tasksRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/tasks')
        ]);
        
        const userData = await userRes.json();
        const tasksData = await tasksRes.json();

        if (userData.success) {
          setUser(userData.data);
          
          // Fetch domain-specific PDFs
          try {
            const materialsRes = await fetch(`/api/materials/pdfs?courseName=${encodeURIComponent(userData.data.course)}`);
            if (materialsRes.ok) {
               const pdfsData = await materialsRes.json();
               setMaterials(pdfsData);
            }
          } catch (e) {
            console.error("Failed to fetch PDFs", e);
          }
          
        } else {
          router.push('/login');
          return;
        }

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
    <div className="min-h-screen bg-[#FDFDFF] flex w-full font-inter overflow-x-hidden text-slate-900 relative">
      
      {/* Mobile Top Bar - NEW */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/60 z-[80] flex items-center justify-between px-6 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/10">
            <span className="material-symbols-outlined text-white text-base" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
          </div>
          <h1 className="text-slate-900 font-bold text-xs tracking-tight uppercase">Codtech</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200/60 transition-all hover:bg-slate-100"
        >
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[65]"
          />
        )}
      </AnimatePresence>
      
      <aside className={`w-64 bg-white border-r border-slate-200/60 flex flex-col fixed h-full z-[70] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:left-0`}>
        <div className="p-6 mb-2 hidden lg:block">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-lg" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <h1 className="text-slate-900 font-black text-[13px] tracking-tighter uppercase">Codtech Intern</h1>
          </div>
        </div>

        {/* Mobile Header in Sidebar */}
        <div className="p-6 lg:hidden flex items-center justify-between border-b border-slate-50 mb-4">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                 <span className="material-symbols-outlined text-white text-sm">terminal</span>
              </div>
              <span className="font-black text-[11px] uppercase tracking-tight">Navigation</span>
           </div>
           <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-sm">close</span>
           </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { name: 'Projects', icon: 'grid_view' },
            { name: 'Materials', icon: 'menu_book' },
            { name: 'Preparation', icon: 'psychology' },
            { name: 'Placement Hub', icon: 'hub' },
            { name: 'Job Hunting', icon: 'work' },
            { name: 'Mock Interviews', icon: 'forum' },
            { name: 'Resume Builder', icon: 'description', path: '/resume' },
            { name: 'LinkedIn Profile', icon: 'person_search' },
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => { 
                if (item.path) {
                  router.push(item.path);
                } else {
                  setActiveTab(item.name); 
                  setIsMobileMenuOpen(false);
                }
              }}
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
              <p className="text-[10px] font-medium text-slate-400 truncate capitalize tracking-tight">{user?.course} Intern</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full py-2 text-[10px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">logout</span> Sign Out
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all lg:ml-64 p-4 md:p-8 lg:p-10 pt-20 lg:pt-10 min-h-screen`}>
        
        {/* Header - REFINED & COMPACT */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
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
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-1 leading-tight uppercase italic">{getGreeting()}, {user?.name?.split(' ')[0]}</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden flex flex-col justify-between group">
                 <div className="flex justify-between items-start relative z-10">
                   <div>
                     <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Proficiency Index</h4>
                     <p className="text-base font-black text-slate-900 uppercase tracking-tight">Skill <span className="text-indigo-600">Analysis</span></p>
                   </div>
                   <div className="flex flex-col items-end">
                     <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{getReadinessScore()}</span>
                        <span className="text-[10px] text-slate-300 font-black tracking-widest uppercase">/100</span>
                     </div>
                   </div>
                 </div>
                 <div className="mt-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${getReadinessScore()}%` }} className="h-full bg-indigo-600" />
                 </div>
               </div>

               <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Time Remaining</h4>
                        <p className="text-base font-black text-slate-900 uppercase tracking-tight">Project <span className="text-indigo-600">Deadline</span></p>
                     </div>
                     <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">schedule</span>
                     </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                     <span className="text-2xl font-black text-slate-900 tracking-tighter italic">{countdown}</span>
                     <span className="text-[10px] text-slate-300 font-black tracking-widest uppercase">remaining</span>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden group md:col-span-2 lg:col-span-1">
                  <div className="flex justify-between items-start">
                     <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Learning Status</h4>
                        <p className="text-base font-black text-slate-900 uppercase tracking-tight">Module <span className="text-indigo-600">Mastery</span></p>
                     </div>
                     <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">menu_book</span>
                     </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                     <span className="text-2xl font-black text-slate-900 tracking-tighter italic">{completedLessons.length}</span>
                     <span className="text-[10px] text-slate-300 font-black tracking-widest uppercase">Units Complete</span>
                  </div>
               </div>
            </div>

            {/* PROJECT WORKSPACE - COMPACT & FUNCTIONAL */}
            <section className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100 shrink-0">
                        <span className="material-symbols-outlined text-xl">terminal</span>
                     </div>
                     <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase italic leading-none">Project <span className="text-indigo-600">Workspace</span></h3>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">Select 4 core projects for your domain.</p>
                     </div>
                  </div>
                  <div className="flex gap-2 w-full lg:w-auto">
                    <button onClick={() => { setTempSelectedProjects(selectedProjects); setIsProjectModalOpen(true); }} className="flex-1 lg:flex-none bg-indigo-600 text-white px-6 py-3 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">add_circle</span> Browse Projects
                    </button>
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 lg:flex-none bg-slate-50 text-slate-500 border border-slate-200/60 px-6 py-3 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">auto_awesome</span> View Guide
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Materials Header - PREMIUM */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 py-4 px-2">
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em]">Official Resources</span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic italic-shorthand">Learning <span className="text-red-500">Materials</span></h3>
                  <p className="text-[14px] text-slate-400 font-medium mt-3 max-w-lg">Curated study materials for your {user?.course} internship.</p>
               </div>
               <div className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-red-100/10">
                  <div className="text-center">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Available PDFs</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter">{materials.length}</p>
                  </div>
               </div>
            </div>

            {/* PDF Cards Grid - COMPACT PREMIUM */}
            {materials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                 {materials.map((pdf, idx) => (
                   <motion.div 
                     key={pdf.id} 
                     whileHover={{ y: -4, scale: 1.01 }}
                     onClick={() => setSelectedPdf(pdf)}
                     className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-100/30 transition-all cursor-pointer group flex flex-col relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="material-symbols-outlined text-red-500 text-lg">open_in_new</span>
                      </div>
                      
                      <div className="flex items-start gap-4 mb-5">
                         <div className="w-12 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm shrink-0">
                            <span className="material-symbols-outlined text-3xl">picture_as_pdf</span>
                         </div>
                         <div className="flex-1 pt-1">
                            <h4 className="text-[14px] font-black text-slate-900 tracking-tight leading-snug group-hover:text-red-500 transition-colors uppercase line-clamp-2">{pdf.name}</h4>
                         </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                         <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                               <span className="material-symbols-outlined text-slate-300 text-[14px]">schedule</span>
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{pdf.readingTime}</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                            <div className="flex items-center gap-1.5">
                               <span className="material-symbols-outlined text-slate-300 text-[14px]">data_usage</span>
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{pdf.size}</span>
                            </div>
                         </div>
                         <button className="text-[10px] font-black text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Open
                         </button>
                      </div>
                   </motion.div>
                 ))}
              </div>
            ) : (
              <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] py-16 px-8 text-center flex flex-col items-center justify-center">
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2 italic">No Materials Found</h4>
                 <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">No study materials available for your internship domain yet.</p>
              </div>
            )}

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

        {activeTab === 'Placement Hub' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-5xl mx-auto py-10">
             <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200 mb-6">
                   <span className="material-symbols-outlined text-4xl">hub</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Placement <span className="text-indigo-600">Command Center</span></h3>
                <p className="text-slate-400 text-sm font-medium max-w-md mx-auto">Your portal to top-tier internship and job opportunities in the tech industry.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">Active <span className="text-indigo-600">Drives</span></h4>
                   <div className="space-y-4">
                      {['Google APAC', 'Microsoft IDC', 'Amazon SDE', 'Zomato Dev'].map(drive => (
                         <div key={drive} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                            <span className="font-bold text-slate-700 text-sm">{drive}</span>
                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Live</span>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-white flex flex-col justify-center items-center text-center space-y-6">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-indigo-400">verified_user</span>
                   </div>
                   <h4 className="text-xl font-black uppercase tracking-tight italic">Become <span className="text-indigo-400">Placement Ready</span></h4>
                   <p className="text-white/40 text-[12px] font-medium leading-relaxed">Complete your 4 projects and materials to unlock 1-on-1 career coaching sessions.</p>
                   <button className="w-full py-4 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">Apply for Evaluation</button>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'Job Hunting' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-5xl mx-auto py-10">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                <div className="text-center md:text-left">
                   <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Job <span className="text-indigo-600">Hunting Suite</span></h3>
                   <p className="text-slate-400 text-sm font-medium mt-2 italic">Strategize, Apply, and Win.</p>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all">Upload New Resume</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: 'Resume Quality', score: '84%', color: 'text-emerald-500' },
                  { title: 'Job Matches', score: '12', color: 'text-indigo-600' },
                  { title: 'Referral Credits', score: '03', color: 'text-amber-500' }
                ].map(stat => (
                  <div key={stat.title} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{stat.title}</p>
                     <p className={`text-4xl font-black ${stat.color} tracking-tighter italic`}>{stat.score}</p>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'Mock Interviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-5xl mx-auto py-10">
             <div className="bg-indigo-600 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                   <div className="flex-1 space-y-6 text-center md:text-left">
                      <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Schedule your <br/><span className="text-indigo-200">Mock Interview</span></h3>
                      <p className="text-indigo-100/60 text-sm font-medium leading-relaxed max-w-md">Practice with industry experts from Amazon, Google, and Meta before your real technical rounds.</p>
                      <div className="flex flex-col md:flex-row gap-4 pt-4">
                         <button className="px-10 py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Book Technical Round</button>
                         <button className="px-10 py-4 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-400 hover:bg-indigo-400 transition-all">Book HR Mock</button>
                      </div>
                   </div>
                   <div className="w-48 h-48 bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-8xl opacity-40">forum</span>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
        {activeTab === 'LinkedIn Profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
            {/* LinkedIn Header */}
            <div className="flex flex-col items-center text-center space-y-4 py-8">
               <div className="w-16 h-16 bg-[#0077b5] text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-200/50 border-4 border-white">
                  <span className="material-symbols-outlined text-3xl">person_search</span>
               </div>
               <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">LinkedIn <span className="text-[#0077b5]">Optimization</span></h3>
                  <p className="text-[14px] text-slate-400 font-medium mt-2">Transform your profile into an <span className="text-[#0077b5] font-bold underline underline-offset-4 decoration-2">opportunity magnet</span>.</p>
               </div>
            </div>

            {/* Video Container - PREMIUM */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-2xl overflow-hidden group relative">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Tutorial: Masterclass</span>
                  </div>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0077b5] text-[9px] font-black uppercase border border-blue-100">Recommended</span>
                  </div>
               </div>
               <div className="aspect-video w-full bg-slate-950">
                  <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/tAXOFWXsq0g" 
                    title="LinkedIn Optimization Guide" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  ></iframe>
               </div>
               <div className="p-8 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                     <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight mb-2">Why this matters?</h4>
                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic">"Recruiters spend 75% of their time on LinkedIn. If your profile isn't optimized, you are invisible."</p>
                  </div>
                  <div className="flex gap-4">
                     <button className="bg-[#0077b5] text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Download Checklist</button>
                  </div>
               </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { title: 'The Headline', desc: 'Use role-specific keywords (e.g. Java Intern @ CodTech)', icon: 'badge' },
                 { title: 'The Profile', desc: 'High-quality professional headshot with clean background', icon: 'account_circle' },
                 { title: 'The Summary', desc: 'Showcase your CodTech projects and technical stack', icon: 'description' }
               ].map((card, i) => (
                 <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-[#0077b5]/30 transition-all group">
                    <div className="w-10 h-10 bg-blue-50 text-[#0077b5] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-xl">{card.icon}</span>
                    </div>
                    <h5 className="font-black text-slate-900 text-[13px] uppercase tracking-tight mb-2">{card.title}</h5>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{card.desc}</p>
                 </div>
               ))}
            </div>
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
        
        {/* PDF VIEWER MODAL */}
        {selectedPdf && (
           <PdfViewer pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
        )}
        
        {/* MODAL - COMPACT PROJECT SELECTION */}
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
