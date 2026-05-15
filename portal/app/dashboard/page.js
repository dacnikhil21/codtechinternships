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
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
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
      
      const savedCompletedProjects = localStorage.getItem(`completed_projects_${user.id}`);
      if (savedCompletedProjects) setCompletedProjects(JSON.parse(savedCompletedProjects));
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
          toast.error('Session expired. Please login again.', { id: 'session-expired' });
          router.push('/login?error=session_expired');
          return;
        }

        if (tasksData.success) setTasks(tasksData.data);
      } catch (err) {
        toast.error('Failed to load session. Please login again.');
        router.push('/login?error=session_expired');
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
      
      const submittingProjectTitle = isSubmitting?.title;
      if (submittingProjectTitle) {
        setCompletedProjects(prev => {
          if (!prev.includes(submittingProjectTitle)) {
             const updated = [...prev, submittingProjectTitle];
             if (user?.id) localStorage.setItem(`completed_projects_${user.id}`, JSON.stringify(updated));
             return updated;
          }
          return prev;
        });
      }
      
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
        <h1 className="text-slate-900 font-bold text-[11px] tracking-tight uppercase">Codtech</h1>
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
            { name: 'Preparation', icon: 'psychology', externalUrl: 'https://www.geeksforgeeks.org/dsa/geeksforgeeks-practice-best-online-coding-platform/' },
            { name: 'Placement Hub', icon: 'hub' },
            { name: 'Job Hunting', icon: 'work' },
            { name: 'Resume Builder', icon: 'description', path: '/resume' },
            { name: 'LinkedIn Profile', icon: 'person_search' },
            ...(user?.role === 'admin' ? [{ name: 'Admin Panel', icon: 'admin_panel_settings', path: '/admin' }] : []),
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => { 
                if (item.externalUrl) {
                  window.open(item.externalUrl, '_blank');
                  setIsMobileMenuOpen(false);
                } else if (item.path) {
                  router.push(item.path);
                } else {
                  setActiveTab(item.name); 
                  setIsMobileMenuOpen(false);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-[12px] group relative ${activeTab === item.name ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
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

      <main className={`flex-1 transition-all lg:ml-64 p-4 md:p-8 lg:p-10 pt-24 lg:pt-10 min-h-screen max-w-full overflow-x-hidden`}>
        
        {/* Header - REFINED & COMPACT */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
             <h2 className="text-[10px] md:text-sm font-black text-slate-400 tracking-widest uppercase">{activeTab}</h2>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
             <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-tight border shadow-sm ${getBadge(user?.xp || 0).color}`}>
                <span className="material-symbols-outlined text-sm">{getBadge(user?.xp || 0).icon}</span>
                {getBadge(user?.xp || 0).name}
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black tracking-tight bg-white text-slate-700 border border-slate-200/60 shadow-sm">
                <span className="material-symbols-outlined text-sm text-emerald-500">verified</span>
                {user?.xp || 0} XP
             </div>
             <button className="bg-primary text-white px-4 py-1.5 rounded-lg font-black text-[9px] tracking-tight uppercase shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
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
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 w-full">
                     {[
                        { step: 1, label: 'Orientation', done: true },
                        { step: 2, label: 'Read Materials', done: completedLessons.length > 0 },
                        { step: 3, label: 'Select 4 Projects', done: selectedProjects.length > 0 },
                        { step: 4, label: 'Submit GitHub', done: false },
                        { step: 5, label: 'Get Certified', done: false }
                     ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${item.done ? 'bg-white/10 border-white/10 text-white' : 'bg-white/5 border-white/5 text-white/20'}`}>
                           <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-black shrink-0 ${item.done ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/20'}`}>
                              {item.done ? <span className="material-symbols-outlined text-[10px]">check</span> : i + 1}
                           </div>
                           <span className="text-[8px] font-black uppercase tracking-widest truncate">{item.label}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Greeting - COMPACT */}
            <div className="py-4 px-2 flex flex-col md:flex-row justify-between items-end gap-6">
               <div>
                  <div className="flex items-center gap-2 mb-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></div>
                     <span className="text-[9px] md:text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Domain: {user?.course || 'Tech'} Internship</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter mb-1 leading-tight uppercase italic">{getGreeting()}, {user?.name?.split(' ')[0]}</h3>
                  <p className="text-[13px] md:text-[14px] text-slate-400 font-medium tracking-tight">Step into your <span className="text-indigo-600 font-bold">{user?.course || 'professional'}</span> roadmap and complete your tasks.</p>
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

            {/* Analytics & Orientation - COMPACT & RESPONSIVE */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <section className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm space-y-6">
               <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
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
                    <button onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })} className="flex-1 lg:flex-none bg-slate-50 text-slate-700 border border-slate-200/60 px-6 py-3 rounded-lg font-black text-[9px] uppercase tracking-[0.2em] hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2">
                       <span className="material-symbols-outlined text-sm">auto_awesome</span> How to do project
                    </button>
                  </div>
               </div>

               {/* 📘 IMPORTANT PROJECT GUIDANCE */}
               <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 md:p-5 flex items-start gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-100/50">
                     <span className="material-symbols-outlined text-xl">info</span>
                  </div>
                  <div className="flex-1 relative z-10">
                     <h4 className="text-[13px] font-black text-indigo-900 uppercase tracking-tight mb-1 flex items-center gap-2">📋 Important Project Note <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[8px] tracking-widest font-black uppercase">Guidance</span></h4>
                     <p className="text-[12px] md:text-[13px] text-indigo-800/90 font-semibold leading-relaxed">
                        We have just provided the <span className="font-black underline underline-offset-2 decoration-indigo-300">title of the project</span>. The complete development approach is up to you — whether you build it as a <span className="font-black">basic, intermediate, or advanced-level project</span>, everything is acceptable.
                     </p>
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
                        {completedProjects.includes(proj) ? (
                           <button disabled className="w-full bg-emerald-50 text-emerald-600 border border-emerald-100 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Submitted</button>
                        ) : (
                           <button onClick={() => setIsSubmitting({ title: proj })} className="w-full bg-slate-900 text-white py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Submit</button>
                        )}
                      </motion.div>
                    ))}
                 </div>
               ) : (
                  <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] py-12 md:py-20 px-6 md:px-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                        <span className="material-symbols-outlined text-[120px] md:text-[200px] font-black text-slate-900">architecture</span>
                     </div>
                     <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 relative z-10 border border-slate-100 mx-auto">
                        <span className="material-symbols-outlined text-4xl md:text-5xl text-indigo-600 animate-bounce">rocket_launch</span>
                     </div>
                    <h4 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-3 italic relative z-10">No Projects Selected</h4>
                    <p className="text-[11px] md:text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-10 max-w-sm relative z-10 mx-auto">Initialize your workspace by choosing up to 4 core projects for your internship domain.</p>
                    <button onClick={() => setIsProjectModalOpen(true)} className="bg-indigo-600 text-white px-12 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 relative z-10">Browse Project Library</button>
                 </div>
               )}
            </section>
          </motion.div>
        )}

        {activeTab === 'Materials' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 min-h-[70vh]">
            {/* Materials Header - BANNER */}
            <div className="relative w-full min-h-[200px] md:min-h-[240px] rounded-[2rem] overflow-hidden flex flex-col justify-center p-6 md:p-10 shadow-sm border border-slate-100/50 mb-8 mt-2">
               {/* Banner Background */}
               <div className="absolute inset-0 z-0 pointer-events-none">
                  <img src="/materials_header_banner.png" alt="" className="w-full h-full object-cover" />
                  {/* Overlay to ensure text readability on the left */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
               </div>
               
               <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
                  <div className="w-full lg:w-auto text-left">
                     <div className="flex items-center justify-start gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em]">Official Resources</span>
                     </div>
                     <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">Materials & <span className="text-red-500">Resources</span></h3>
                     <p className="text-[12px] md:text-[14px] text-slate-700 font-medium mt-2 max-w-sm md:max-w-md">Curated study materials for your {user?.course} internship.</p>
                  </div>
                  <div className="w-full lg:w-auto flex items-center justify-center gap-6 bg-white/60 backdrop-blur-md p-5 md:p-6 rounded-3xl border border-white/50 shadow-xl shadow-red-100/20">
                     <div className="text-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Available PDFs</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{materials.length}</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative z-10 space-y-8 px-4 md:px-0">

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
            </div>
          </motion.div>
        )}

        {activeTab === 'Placement Hub' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-5xl mx-auto py-6 md:py-10 px-2 md:px-0">
             {/* Placement Hub Header - BANNER */}
             <div className="relative w-full min-h-[200px] md:min-h-[240px] rounded-[2rem] overflow-hidden flex flex-col justify-center shadow-sm border border-slate-100/50 p-6 md:p-10 mb-8 mt-2">
                <div className="absolute inset-0 z-0 pointer-events-none">
                   <img src="/materials_bg.png" alt="" className="w-full h-full object-cover" />
                   {/* Overlay to ensure text readability on the left */}
                   <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
                   <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 text-white rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-200/50 border-2 border-white/50 shrink-0">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">hub</span>
                   </div>
                   <div className="max-w-md">
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">Placement <span className="text-indigo-600">Command Center</span></h3>
                      <p className="text-[12px] md:text-[14px] text-slate-700 font-medium mt-2">Your portal to top-tier <span className="text-indigo-600 font-bold underline underline-offset-4 decoration-2">internship and job</span> opportunities.</p>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-2 md:px-0">
                <div className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 overflow-hidden">
                   <h4 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight italic text-center md:text-left">Active <span className="text-indigo-600">Drives</span></h4>
                    <div className="space-y-2">
                       {(() => {
                          const course = (user?.course || '').toLowerCase();
                          let drives = [];
                          if (course.includes('react') || course.includes('frontend') || course.includes('web') || course.includes('full stack')) drives = ['Google APAC', 'Atlassian UI', 'Swiggy Frontend', 'Zomato Dev'];
                          else if (course.includes('java') || course.includes('backend') || course.includes('c++')) drives = ['Microsoft IDC', 'Amazon SDE', 'Oracle Systems', 'Uber Backend'];
                          else if (course.includes('data') || course.includes('machine learning') || course.includes('ai')) drives = ['Fractal Analytics', 'Mu Sigma', 'Google AI', 'Amazon Data'];
                          else if (course.includes('cyber') || course.includes('hack')) drives = ['CrowdStrike', 'Palo Alto Networks', 'Cisco Security', 'IBM Security'];
                          else if (course.includes('market')) drives = ['Ogilvy Digital', 'Dentsu Media', 'GroupM', 'Amazon Marketing'];
                          else if (course.includes('ui') || course.includes('ux') || course.includes('figma')) drives = ['Airbnb Design', 'Cred UX', 'Razorpay UI', 'Flipkart Design'];
                          else drives = ['TCS Digital', 'Infosys Innovate', 'Wipro Elite', 'Cognizant GenC'];
                          return drives.map(drive => (
                             <div key={drive} className="px-3 py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                                <span className="font-bold text-slate-700 text-[11px] md:text-sm truncate mr-2">{drive}</span>
                                <span className="text-[8px] md:text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 md:px-3 md:py-1.5 rounded-lg border border-indigo-100 shrink-0">Live</span>
                             </div>
                          ));
                       })()}
                    </div>
                </div>
                <div className="bg-slate-900 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl text-white flex flex-col justify-center items-center text-center space-y-5 overflow-hidden">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl md:text-3xl text-indigo-400">verified_user</span>
                   </div>
                   <h4 className="text-[16px] md:text-xl font-black uppercase tracking-tight italic">Become <span className="text-indigo-400">Placement Ready</span></h4>
                   <p className="text-white/40 text-[10px] md:text-[12px] font-medium leading-relaxed max-w-[280px]">Complete your 4 projects and materials to unlock 1-on-1 career coaching sessions.</p>
                   <button className="w-full py-4 bg-indigo-600 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20">Apply for Evaluation</button>
                </div>
             </div>

             {/* Placement Channels Hub */}
             <div className="space-y-10 px-2 md:px-0">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
                   <div className="text-center md:text-left">
                      <h4 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Placement <span className="text-indigo-600">Channels Hub</span></h4>
                      <p className="text-slate-400 text-[11px] md:text-[12px] font-bold uppercase tracking-widest mt-1">Direct access to top-tier hiring networks</p>
                   </div>
                   <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-0">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                         Live Updates
                      </div>
                   </div>
                </div>

                <div className="space-y-12">
                   {/* WhatsApp Channels */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-[#25D366]/10 rounded-lg flex items-center justify-center border border-[#25D366]/20">
                            <span className="material-symbols-outlined text-[#25D366] text-lg">chat</span>
                         </div>
                         <h5 className="text-[13px] font-black text-slate-900 uppercase tracking-widest italic">WhatsApp <span className="text-[#25D366]">Networks</span></h5>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                         {[
                            { name: "Placement Cell", url: "https://whatsapp.com/channel/0029VaikVPH72WTth87Vjh3A", desc: "Official placement alerts and campus drive notifications." },
                            { name: "Placement Cell (Official)", url: "https://whatsapp.com/channel/0029VaUJuc09mrGbi34PIV2w", desc: "Direct updates on top-tier internship openings." },
                            { name: "Placementdrive", url: "https://whatsapp.com/channel/0029Va9mTuZ6RGJH5LmR4H05", desc: "Daily dose of off-campus hiring opportunities." },
                            { name: "Careers@tech | Freshers Tech Jobs", url: "https://whatsapp.com/channel/0029VaUJgMW2kNFx7ABlpx2y", desc: "Specific focus on technical roles for freshers." },
                            { name: "Fresh Graduate Jobs & Internships", url: "https://whatsapp.com/channel/0029VaSbEjeDOQIftNJIBa0q", desc: "Handpicked opportunities for 2024 & 2025 graduates." },
                            { name: "Jobs & Career Network", url: "https://whatsapp.com/channel/0029VaikVPH72WTth87Vjh3A", desc: "Networking and career growth resources." }
                         ].map((channel, i) => (
                            <motion.div 
                              whileHover={{ y: -5 }}
                              key={i} 
                              className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col justify-between"
                            >
                               <div>
                                  <div className="flex justify-between items-start mb-4">
                                     <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600">group</span>
                                     </div>
                                     <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Channel</span>
                                  </div>
                                  <h6 className="text-[14px] font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{channel.name}</h6>
                                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">{channel.desc}</p>
                               </div>
                               <a 
                                 href={channel.url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="w-full py-3 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all text-center flex items-center justify-center gap-2"
                               >
                                  Open Channel <span className="material-symbols-outlined text-sm">open_in_new</span>
                               </a>
                            </motion.div>
                         ))}
                      </div>
                   </div>

                   {/* Telegram & LinkedIn */}
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Telegram */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0088cc]/10 rounded-lg flex items-center justify-center border border-[#0088cc]/20">
                               <span className="material-symbols-outlined text-[#0088cc] text-lg">send</span>
                            </div>
                            <h5 className="text-[13px] font-black text-slate-900 uppercase tracking-widest italic">Telegram <span className="text-[#0088cc]">Hubs</span></h5>
                         </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {[
                               { name: "Jobs & Internship Daily", url: "https://t.me/jobsandinternshipdaily", desc: "Massive hub for daily internship postings." },
                               { name: "Fresher Jobs Adda", url: "https://t.me/Fresherjobsadda", desc: "Community-driven job board for fresh graduates." }
                            ].map((channel, i) => (
                               <motion.div 
                                 whileHover={{ y: -5 }}
                                 key={i} 
                                 className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col justify-between"
                               >
                                  <div>
                                     <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                           <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-600">hub</span>
                                        </div>
                                     </div>
                                     <h6 className="text-[14px] font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{channel.name}</h6>
                                     <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">{channel.desc}</p>
                                  </div>
                                  <a 
                                    href={channel.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full py-3 bg-slate-50 group-hover:bg-[#0088cc] group-hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all text-center flex items-center justify-center gap-2"
                                  >
                                     Join Community <span className="material-symbols-outlined text-sm">open_in_new</span>
                                  </a>
                               </motion.div>
                            ))}
                         </div>
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#0077b5]/10 rounded-lg flex items-center justify-center border border-[#0077b5]/20">
                               <span className="material-symbols-outlined text-[#0077b5] text-lg">work</span>
                            </div>
                            <h5 className="text-[13px] font-black text-slate-900 uppercase tracking-widest italic">LinkedIn <span className="text-[#0077b5]">Exclusive</span></h5>
                         </div>
                         <motion.div 
                           whileHover={{ y: -5 }}
                           className="group bg-slate-900 p-8 rounded-[2rem] border border-white/5 shadow-2xl text-white flex flex-col justify-between h-full"
                         >
                            <div>
                               <div className="flex justify-between items-start mb-6">
                                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                     <span className="material-symbols-outlined text-indigo-400 text-2xl">verified</span>
                                  </div>
                                  <div className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 text-[8px] font-black uppercase tracking-widest border border-indigo-500/30">Premium Resource</div>
                               </div>
                               <h6 className="text-[18px] font-black leading-tight mb-3">LinkedIn India Jobs</h6>
                               <p className="text-white/40 text-[12px] font-medium leading-relaxed mb-8">Direct access to curated job listings for Indian developers. Skip the noise and find quality roles.</p>
                            </div>
                            <a 
                              href="https://share.google/os4110fwyjxRpOkCF" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full py-4 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20 transition-all text-center flex items-center justify-center gap-2 hover:bg-indigo-500"
                            >
                               View On LinkedIn <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </a>
                         </motion.div>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'Job Hunting' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-6xl mx-auto py-6 md:py-10 px-2 md:px-0 min-h-[60vh]">
             <div className="space-y-12">
             
             {/* Header Section */}
             {/* Job Hunting Header - BANNER */}
             <div className="relative w-full min-h-[200px] md:min-h-[240px] rounded-[2rem] overflow-hidden flex flex-col justify-center shadow-sm border border-slate-100/50 p-6 md:p-10 mb-8 mt-2">
                <div className="absolute inset-0 z-0 pointer-events-none">
                   <img src="/job_hunting_bg.png" alt="" className="w-full h-full object-cover" />
                   {/* Overlay to ensure text readability on the left */}
                   <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
                   <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-600 text-white rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-200/50 border-2 border-white/50 shrink-0">
                      <span className="material-symbols-outlined text-2xl md:text-3xl">work</span>
                   </div>
                   <div className="max-w-md">
                      <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">Job <span className="text-indigo-600">Hunting</span></h3>
                      <p className="text-[12px] md:text-[14px] text-slate-700 font-medium mt-2">Find internships, fresher jobs, and <span className="text-indigo-600 font-bold underline underline-offset-4 decoration-2">off-campus drives</span> from trusted platforms.</p>
                   </div>
                </div>
             </div>

             {/* Platform Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
                {[
                  { name: 'Indeed India', url: 'https://in.indeed.com/m/', desc: 'Jobs, internships, fresher hiring, off-campus opportunities.', category: 'General Job Platforms', icon: 'search', color: 'bg-blue-50 text-blue-600 border-blue-100', hover: 'hover:border-blue-300 hover:shadow-blue-100/50' },
                  { name: 'Jobsora', url: 'https://in.jobsora.com/jobs-intern-hyderabad', desc: 'Internships and fresher jobs, especially Hyderabad opportunities.', category: 'Internship Platforms', icon: 'business_center', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', hover: 'hover:border-emerald-300 hover:shadow-emerald-100/50' },
                  { name: 'Hirist', url: 'https://www.hirist.tech/', desc: 'Tech jobs for software, developers, AI, ML, data science, product roles.', category: 'Tech Jobs & Freshers', icon: 'terminal', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', hover: 'hover:border-indigo-300 hover:shadow-indigo-100/50' },
                  { name: 'Glassdoor', url: 'https://www.glassdoor.com/', desc: 'Jobs + salary insights + company reviews.', category: 'General Job Platforms', icon: 'visibility', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', hover: 'hover:border-emerald-300 hover:shadow-emerald-100/50' },
                  { name: 'Apna Jobs', url: 'https://employer.apna.co/', desc: 'Entry-level jobs, internships, and fresher hiring.', category: 'Internship Platforms', icon: 'handshake', color: 'bg-orange-50 text-orange-600 border-orange-100', hover: 'hover:border-orange-300 hover:shadow-orange-100/50' },
                  { name: 'SimplyHired', url: 'https://www.simplyhired.co.in/', desc: 'Internships and job opportunities across India.', category: 'General Job Platforms', icon: 'work', color: 'bg-rose-50 text-rose-600 border-rose-100', hover: 'hover:border-rose-300 hover:shadow-rose-100/50' },
                  { name: 'Naukri Gulf', url: 'https://www.naukrigulf.com/', desc: 'Middle East/Gulf job opportunities.', category: 'International / Gulf Jobs', icon: 'public', color: 'bg-sky-50 text-sky-600 border-sky-100', hover: 'hover:border-sky-300 hover:shadow-sky-100/50' },
                ].map((platform, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -5 }}
                     className={`group bg-white p-5 md:p-6 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all flex flex-col justify-between h-full ${platform.hover}`}
                   >
                      <div>
                         <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${platform.color}`}>
                               <span className="material-symbols-outlined text-2xl">{platform.icon}</span>
                            </div>
                            <div className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 text-[8px] font-black uppercase tracking-widest text-right max-w-[100px] leading-tight break-words">
                               {platform.category}
                            </div>
                         </div>
                         <h4 className="text-[16px] md:text-lg font-black text-slate-900 tracking-tight mb-2 group-hover:text-primary transition-colors">{platform.name}</h4>
                         <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-relaxed mb-6">{platform.desc}</p>
                      </div>
                      
                      <a 
                        href={platform.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-slate-50 group-hover:bg-primary group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all text-center flex items-center justify-center gap-2 border border-slate-100 group-hover:border-primary shadow-sm"
                      >
                         Visit Platform <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </a>
                   </motion.div>
                ))}
             </div>
             </div>
          </motion.div>
        )}


         {activeTab === 'LinkedIn Profile' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto px-2 md:px-0 min-h-[70vh]">
            
            {/* LinkedIn Header BANNER */}
            <div className="relative w-full min-h-[200px] md:min-h-[240px] rounded-[2rem] overflow-hidden flex flex-col justify-center shadow-sm border border-slate-100/50 p-6 md:p-10 mb-8 mt-2">
               <div className="absolute inset-0 z-0 pointer-events-none">
                  <img src="/linkedin_header_banner.png" alt="" className="w-full h-full object-cover" />
                  {/* Overlay to ensure text readability on the left */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
               </div>
               
               <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-[#0077b5] text-white rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-blue-200/50 border-2 border-white/50 shrink-0">
                     <span className="material-symbols-outlined text-2xl md:text-3xl">person_search</span>
                  </div>
                  <div className="max-w-md">
                     <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-tight italic">LinkedIn <span className="text-[#0077b5]">Optimization</span></h3>
                     <p className="text-[12px] md:text-[14px] text-slate-700 font-medium mt-2">Transform your profile into an <span className="text-[#0077b5] font-bold underline underline-offset-4 decoration-2">opportunity magnet</span>.</p>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
            {/* Video Container - PREMIUM */}
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200/60 shadow-2xl overflow-hidden group relative">
               <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 gap-3">
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
               <div className="p-6 md:p-8 bg-white flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                  <div className="flex-1">
                     <h4 className="text-[12px] md:text-[13px] font-black text-slate-900 uppercase tracking-tight mb-2">Why this matters?</h4>
                     <p className="text-[11px] md:text-[12px] text-slate-500 font-medium leading-relaxed italic">"Recruiters spend 75% of their time on LinkedIn. If your profile isn't optimized, you are invisible."</p>
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
            </div>

            {/* NEW SECTION: Internship Certificate */}
            <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-xl overflow-hidden mt-12 mb-8">
               <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center md:text-left">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${completedProjects.length >= 4 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
                        <span className="material-symbols-outlined text-3xl">{completedProjects.length >= 4 ? 'workspace_premium' : 'lock'}</span>
                     </div>
                     <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase italic">🎓 Internship <span className="text-indigo-600">Certificate</span></h3>
                        <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                           <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${completedProjects.length >= 4 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                              {completedProjects.length >= 4 ? '✅ Certificate Unlocked' : '🔒 Locked'}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="text-center md:text-right">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Progress</p>
                     <p className="text-2xl font-black text-slate-900 tracking-tighter italic">
                        {completedProjects.length}<span className="text-slate-300 text-lg">/4</span> <span className="text-[12px] text-slate-500 font-bold uppercase not-italic tracking-wider ml-1">Completed</span>
                     </p>
                  </div>
               </div>
               
               <div className="p-6 md:p-8 flex flex-col items-center justify-center text-center">
                  {completedProjects.length >= 4 ? (
                     <div className="max-w-xl mx-auto space-y-6">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100/50 mb-2">
                           <span className="material-symbols-outlined text-4xl">celebration</span>
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">🎉 Congratulations!</h4>
                           <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
                              Congratulations 🙌 We have received all 4/4 of your projects successfully.
                           </p>
                           <p className="text-[14px] text-slate-600 font-medium leading-relaxed mt-2">
                              Kindly share your Offer Letter to this WhatsApp number to receive your Internship Certificate.
                           </p>
                           <div className="mt-4 inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                              <p className="text-[13px] font-black text-slate-800 flex items-center gap-2">
                                 <span className="material-symbols-outlined text-green-500 text-xl">chat</span> WhatsApp Number: +91 6301408361
                              </p>
                           </div>
                        </div>
                        <button 
                           onClick={() => setIsCertificateModalOpen(true)}
                           className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:-translate-y-1 mt-4"
                        >
                           🎓 Get Internship Certificate
                        </button>
                     </div>
                  ) : (
                     <div className="max-w-xl mx-auto space-y-6 opacity-60">
                        <p className="text-[14px] md:text-[15px] text-slate-500 font-medium leading-relaxed">
                           Complete all 4 internship projects to unlock your Internship Certificate.
                        </p>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mt-6 mb-8 relative">
                           <div className="absolute inset-0 bg-[url(https://www.transparenttextures.com/patterns/diagonal-stripes.png)] opacity-20"></div>
                           <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(Math.min(completedProjects.length, 4) / 4) * 100}%` }} 
                              className="h-full bg-gradient-to-r from-slate-400 to-slate-500 relative z-10" 
                           />
                        </div>
                        <button 
                           disabled
                           className="w-full md:w-auto px-8 py-4 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-[12px] font-black uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2 mx-auto filter grayscale"
                        >
                           <span className="material-symbols-outlined text-[16px]">lock</span>
                           Complete 4 Projects to Unlock
                        </button>
                     </div>
                  )}
               </div>
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

        {/* CERTIFICATE MODAL */}
        <AnimatePresence>
           {isCertificateModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-slate-900/60 backdrop-blur-md">
                 <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/60 relative">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 z-0"></div>
                    <div className="relative z-10 p-8 pt-10 text-center flex flex-col items-center">
                       <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-6 border-4 border-white">
                          <span className="material-symbols-outlined text-5xl text-indigo-600">workspace_premium</span>
                       </div>
                       <h4 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase italic">🎉 Congratulations!</h4>
                       <p className="text-[13px] text-slate-600 font-medium leading-relaxed mb-6">
                          Congratulations 🙌 You have successfully completed all 4/4 internship projects.
                       </p>
                       <div className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left mb-6 relative overflow-hidden">
                          <div className="absolute left-0 top-0 w-1 h-full bg-[#25D366]"></div>
                          <p className="text-[11px] font-semibold text-slate-700 leading-relaxed mb-3">
                             To receive your Internship Certificate, kindly share your Offer Letter on the WhatsApp number below for verification.
                          </p>
                          <div className="flex items-center gap-2 font-black text-slate-900 text-[13px] tracking-tight">
                             <span className="material-symbols-outlined text-[#25D366] text-lg">chat</span>
                             WhatsApp: +91 6301408361
                          </div>
                       </div>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                          Our team will verify your details and issue your certificate.<br/><br/>Thank you for completing your internship with CODTECH 🚀
                       </p>
                       <div className="w-full flex flex-col gap-3">
                          <a href="https://wa.me/916301408361?text=Hello%20CODTECH%20Team%2C%20I%20have%20successfully%20completed%20all%204%20internship%20projects.%20I%20am%20sharing%20my%20offer%20letter%20for%20certificate%20verification." target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2">
                             <span className="material-symbols-outlined text-sm">send</span> Message on WhatsApp
                          </a>
                          <button onClick={() => setIsCertificateModalOpen(false)} className="w-full bg-slate-50 text-slate-500 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">
                             Close
                          </button>
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>

      </main>
    </div>
  );
}
