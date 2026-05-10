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

  // Helper for preparation progress
  const getPrepProgress = (title) => {
    if (typeof window === 'undefined') return 0;
    const progress = localStorage.getItem(`prep_progress_${title}`);
    return progress ? parseInt(progress) : 0;
  };

  // Helper for badges based on XP
  const getBadge = (xp) => {
    if (xp >= 3001) return { name: 'Interview Ready', icon: 'verified', color: 'text-purple-700 bg-purple-50 border-purple-100' };
    if (xp >= 1501) return { name: 'Advanced', icon: 'grade', color: 'text-amber-700 bg-amber-50 border-amber-100' };
    if (xp >= 501) return { name: 'Intermediate', icon: 'military_tech', color: 'text-blue-700 bg-blue-50 border-blue-100' };
    return { name: 'Beginner', icon: 'stadium', color: 'text-slate-600 bg-slate-50 border-slate-100' };
  };

  // Helper to determine if a card is recommended for the user's domain
  const isRecommended = (cardTitle) => {
    if (!user || !user.course) return false;
    const course = user.course.toLowerCase();
    const title = cardTitle.toLowerCase();
    
    if (course.includes('react') || course.includes('frontend')) {
      return title.includes('react') || title.includes('javascript') || title.includes('frontend') || title.includes('hooks');
    }
    if (course.includes('backend') || course.includes('node') || course.includes('python') || course.includes('database')) {
      return title.includes('api') || title.includes('database') || title.includes('backend') || title.includes('system design');
    }
    return false;
  };

  const FRONTEND_PROJECTS = [
    "Personal Portfolio Website", "Responsive Landing Page Builder", "Weather Forecast App",
    "Modern To-Do Task Manager", "Expense Tracker Dashboard", "Recipe Finder App",
    "Movie Search Application", "Notes Taking App", "Quiz Application with Timer",
    "Currency Converter", "Digital Clock & Alarm System", "Typing Speed Tester",
    "Password Generator Tool", "Interactive Calculator", "Image Gallery with Search & Filter",
    "Job Portal UI Dashboard", "Student Learning Management Dashboard", "Blog Website with Categories",
    "Music Streaming UI Clone", "E-commerce Product Listing Page", "Food Ordering Frontend Website",
    "Admin Analytics Dashboard", "Video Streaming Platform UI", "Real-Time Chat Application UI",
    "Event Booking Platform", "AI-Powered Interview Preparation Platform", "Frontend Bug Tracker System",
    "Social Media Dashboard Clone", "Project Management Tool (Trello-like)", "Code Snippet Sharing Platform"
  ];

  // State for total XP (initially from user object)
  const [totalXP, setTotalXP] = useState(0);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

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

  // Helper to add XP
  const addXP = (amount) => {
    setTotalXP(prev => {
      const newXP = prev + amount;
      localStorage.setItem('user_xp', newXP);
      return newXP;
    });
    toast.success(`+${amount} XP Earned! Check your new badge!`, {
      icon: '🚀',
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/auth/me');
        const userData = await userRes.json();
        
        if (userData.success) {
          setUser(userData.data);
          
          const taskRes = await fetch('/api/tasks');
          const taskData = await taskRes.json();
          if (taskData.success) {
            setTasks(taskData.data);
          }
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
    if (!githubUrl.includes('github.com')) {
      return toast.error('Please provide a valid GitHub repository URL');
    }
    
    toast.loading('Submitting project...');
    // Mock API call
    setTimeout(() => {
      toast.dismiss();
      toast.success('Project submitted successfully! Our mentors will review it.');
      setIsSubmitting(false);
      setGithubUrl('');
    }, 1500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex w-full font-inter overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 h-16 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-lg" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
          </div>
          <h1 className="text-blue-700 font-black text-sm tracking-tight uppercase">Codtech</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 hidden lg:block">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <h1 className="text-blue-700 font-black text-lg tracking-tight uppercase">Codtech Intern</h1>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-16 lg:mt-0">
          {[
            { name: 'Projects', icon: 'folder_open' },
            { name: 'Materials', icon: 'library_books' },
            { name: 'Preparation', icon: 'psychology' },
            { name: 'Placement Hub', icon: 'work' },
            { name: 'Job Hunting', icon: 'search' },
            { name: 'Mock Interviews', icon: 'groups' },
            { name: 'Resume Building', icon: 'description' },
            { name: 'LinkedIn Profile', icon: 'account_circle' },
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${activeTab === item.name ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.course}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg mt-2 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">logout</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'blur-sm lg:blur-0' : ''} lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0`}>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">dashboard</span>
            {activeTab}
          </h2>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
             <div className="flex items-center gap-3">
               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getBadge(totalXP).color}`}>
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>{getBadge(totalXP).icon}</span>
                  {getBadge(totalXP).name}
               </div>
               <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                  {totalXP} XP
               </div>
             </div>
            <button className="bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all active:scale-95">
               <span className="material-symbols-outlined text-sm">bolt</span>
               Get Certified
            </button>
          </div>
        </header>

        {activeTab === 'Projects' && (
          <>
            <section className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]} 👋</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">You're currently in the <span className="text-blue-600 font-bold">{user.course}</span> track.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Readiness Score Card */}
              <div className="lg:col-span-8 bg-white p-6 lg:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">Career Readiness Score</h4>
                    <p className="text-xs text-slate-400">Based on your completed modules</p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-blue-700">84</span>
                    <span className="text-xl font-bold text-slate-300">/100</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 gap-2 lg:gap-4 relative z-10">
                   {[40, 55, 65, 80, 70, 85, 95].map((h, i) => (
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} key={i} className={`flex-1 rounded-t-lg transition-colors ${i === 6 ? 'bg-blue-800' : 'bg-blue-100'}`} />
                   ))}
                </div>
              </div>

              {/* Urgent Card */}
              <div className="lg:col-span-4 bg-blue-700 p-6 lg:p-8 rounded-3xl text-white shadow-xl shadow-blue-200 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                <h4 className="text-xl font-bold tracking-tight">Tech Orientation</h4>
                <p className="text-xs text-blue-100 mt-2 flex items-center gap-2 opacity-90">
                  <span className="material-symbols-outlined text-sm">calendar_today</span> Friday, 2:00 PM
                </p>
                <button className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl mt-6 hover:bg-blue-50 transition-colors shadow-lg active:scale-95 duration-150">
                  Join Session
                </button>
              </div>
            </div>
          </>
        )}

        {/* Dynamic Content Section */}
        <AnimatePresence mode='wait'>
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {activeTab === 'Projects' ? (
                <div className="col-span-full">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full -mr-48 -mt-48 transition-transform duration-700 group-hover:scale-110"></div>
                    
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                             </div>
                             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Internship Project Workspace</h3>
                          </div>
                          <p className="text-sm text-slate-500 font-medium ml-15">Select and complete 4 major projects to finalize your internship.</p>
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                           <button 
                             onClick={() => setIsProjectModalOpen(true)}
                             className="bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                           >
                             <span className="material-symbols-outlined text-lg">add_circle</span>
                             View Projects
                           </button>
                           <button 
                             onClick={() => setSelectedTask({ title: 'Project Implementation Guide' })}
                             className="bg-slate-100 text-slate-700 px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                           >
                             <span className="material-symbols-outlined text-lg">map</span>
                             How to Do Project
                           </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {selectedProjects.length > 0 ? (
                          selectedProjects.map((proj, idx) => (
                            <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group/card relative">
                              <button 
                                onClick={() => toggleProject(proj)}
                                className="absolute top-4 right-4 w-7 h-7 bg-white/80 backdrop-blur-sm text-slate-400 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm border border-slate-100 z-20"
                                title="Remove Project"
                              >
                                 <span className="material-symbols-outlined text-[16px] font-bold">close</span>
                              </button>
                              <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover/card:bg-blue-600 group-hover/card:text-white transition-colors">
                                 <span className="material-symbols-outlined text-xl">code</span>
                              </div>
                              <h5 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2">{proj}</h5>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-6">
                                 <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                 ACTIVE PROJECT
                              </div>
                              
                              <button 
                                onClick={() => setIsSubmitting({ title: proj })}
                                className="w-full bg-white text-blue-700 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-700 hover:text-white transition-all shadow-sm"
                              >
                                Submit Task
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                             <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">folder_off</span>
                             <h4 className="text-slate-900 font-bold">No Projects Selected</h4>
                             <p className="text-xs text-slate-500 mt-1 mb-6">You need to select 4 projects to begin your internship work.</p>
                             <button 
                               onClick={() => setIsProjectModalOpen(true)}
                               className="text-blue-700 font-black text-xs uppercase tracking-widest flex items-center gap-2 mx-auto hover:gap-3 transition-all"
                             >
                                Browse Projects <span className="material-symbols-outlined">arrow_forward</span>
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Project Selector Modal */}
                  <AnimatePresence>
                    {isProjectModalOpen && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10"
                      >
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsProjectModalOpen(false)}></div>
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.9, opacity: 0, y: 20 }}
                          className="bg-white w-full max-w-5xl h-[80vh] rounded-[3rem] shadow-2xl relative z-10 flex flex-col overflow-hidden"
                        >
                          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
                             <div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight">Select Your Projects</h4>
                                <p className="text-sm text-slate-500 font-medium">Choose up to 4 projects to complete during your internship.</p>
                             </div>
                             <div className="flex items-center gap-4">
                                <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider ${selectedProjects.length === 4 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                   {selectedProjects.length}/4 Selected
                                </div>
                                <button 
                                  onClick={() => setIsProjectModalOpen(false)}
                                  className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                   <span className="material-symbols-outlined">close</span>
                                </button>
                             </div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             {FRONTEND_PROJECTS.map((proj, i) => (
                               <div 
                                 key={i} 
                                 onClick={() => toggleProject(proj)}
                                 className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${selectedProjects.includes(proj) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 hover:border-blue-400 text-slate-800'}`}
                               >
                                  <div className="flex items-center gap-4">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${selectedProjects.includes(proj) ? 'bg-white/20' : 'bg-slate-100'}`}>
                                        {i + 1}
                                     </div>
                                     <span className="text-xs font-bold leading-tight">{proj}</span>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${selectedProjects.includes(proj) ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-300 group-hover:bg-blue-100'}`}>
                                     <span className="material-symbols-outlined text-sm">
                                        {selectedProjects.includes(proj) ? 'check' : 'add'}
                                     </span>
                                  </div>
                               </div>
                             ))}
                          </div>
                          
                          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-3">
                             {selectedProjects.length >= 4 ? (
                               <div className="flex items-center gap-2 text-amber-600 font-bold text-xs bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 mb-2">
                                  <span className="material-symbols-outlined text-sm">info</span>
                                  You have selected your 4 projects.
                               </div>
                             ) : (
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Scroll to explore more projects</p>
                             )}
                             
                             <button 
                               onClick={() => setIsProjectModalOpen(false)}
                               className="bg-blue-700 text-white px-10 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-800 transition-all active:scale-95"
                             >
                               Confirm Selection
                             </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : activeTab === 'Materials' ? (
                ['Project Guides', 'Technical Documentation', 'Case Studies', 'Reference Materials'].map((title, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><span className="material-symbols-outlined">description</span></div>
                    <div><h5 className="font-bold text-slate-800 text-sm">{title}</h5><p className="text-[10px] text-slate-400">PDF Document • 2.4 MB</p></div>
                  </div>
                ))
             ) : activeTab === 'Preparation' ? (
                (user && (user.course === 'React.js Web Development Intern' || user.course?.includes('Frontend') || user.course?.includes('React'))) ? (
                  <>
                    {[
                      {
                        title: 'React Interview Questions',
                        desc: 'Practice commonly asked ReactJS interview questions including Hooks, Components, State, Props, Context API, Routing, and API handling.',
                        btn: 'Start Practice'
                      },
                      {
                        title: 'JavaScript Coding Challenges',
                        desc: 'Practice JavaScript fundamentals, ES6 concepts, arrays, strings, async/await, and frontend logic building.',
                        btn: 'Start Challenge'
                      },
                      {
                        title: 'React Hooks Practice',
                        desc: 'Practice useState, useEffect, useContext, custom hooks, and component lifecycle concepts.',
                        btn: 'Practice Hooks'
                      },
                      {
                        title: 'API Integration Practice',
                        desc: 'Learn API fetching, Axios, async requests, loading states, and data rendering in ReactJS.',
                        btn: 'Start API Practice'
                      },
                      {
                        title: 'Frontend Development Roadmap',
                        desc: 'Track learning progress for HTML, CSS, JavaScript, ReactJS, Routing, APIs, and Deployment.',
                        btn: 'View Roadmap'
                      },
                      {
                        title: 'Resume & Portfolio Preparation',
                        desc: 'Frontend resume tips, GitHub optimization, portfolio building, and ATS-friendly guidance for React developers.',
                        btn: 'View Tips'
                      }
                    ]
                    .sort((a, b) => isRecommended(b.title) - isRecommended(a.title))
                    .map((card, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between relative group">
                        {isRecommended(card.title) && (
                          <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-blue-200 z-10 transition-transform group-hover:scale-105">
                             Recommended for You
                          </div>
                        )}
                        <div>
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-xl">psychology</span>
                          </div>
                          <h5 className="font-bold text-slate-800 text-sm mb-2">{card.title}</h5>
                          <p className="text-[10px] text-slate-500 mb-6 leading-relaxed">{card.desc}</p>
                        </div>

                        {/* Progress System */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                            <span className="text-[9px] font-black text-blue-600">{getPrepProgress(card.title)}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${getPrepProgress(card.title)}%` }}
                              className="bg-blue-600 h-full rounded-full"
                            />
                          </div>
                        </div>

                        <button 
                          onClick={() => addXP(100)}
                          className="w-full bg-blue-50 text-blue-700 text-[10px] font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
                          {card.btn}
                        </button>
                      </div>
                    ))}
                  </>
                ) : (
                  ['Technical Q&A', 'System Design', 'Algorithms Masterclass', 'Database Design']
                  .sort((a, b) => isRecommended(b) - isRecommended(a))
                  .map((title, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between relative group">
                      {isRecommended(title) && (
                        <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-blue-200 z-10 transition-transform group-hover:scale-105">
                           Recommended for You
                        </div>
                      )}
                      <div>
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                          <span className="material-symbols-outlined text-xl">menu_book</span>
                        </div>
                        <h5 className="font-bold text-slate-800 text-sm mb-2">{title}</h5>
                        <p className="text-[10px] text-slate-500 mb-6">General preparation materials and practice resources.</p>
                      </div>

                      {/* Progress System */}
                      <div className="mb-6 px-1">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                          <span className="text-[9px] font-black text-blue-600">{getPrepProgress(title)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getPrepProgress(title)}%` }}
                            className="bg-blue-600 h-full rounded-full"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={() => addXP(100)}
                        className="w-full bg-blue-50 text-blue-700 text-[10px] font-bold py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
                        Start Practice
                      </button>
                    </div>
                  ))
                )
             ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100">
                   <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">lock</span>
                   <p className="text-slate-400 font-medium">{activeTab} section is being updated for your track.</p>
                </div>
             )}

             {/* Smart Recommendations Section */}
             {(activeTab === 'Preparation') && (
               <div className="col-span-full mt-10 bg-slate-900 p-8 rounded-[2rem] text-white overflow-hidden relative shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                         <span className="material-symbols-outlined text-blue-400">insights</span>
                      </div>
                      <div>
                         <h3 className="text-lg font-bold tracking-tight">Personalized Growth Analysis</h3>
                         <p className="text-xs text-slate-400">Based on your practice performance and {user.course}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                         <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2 block">Weak Area Identified</span>
                         <p className="text-sm font-medium mb-3 text-slate-200">You need more practice in <span className="text-blue-400 font-bold italic">React Hooks & API Lifecycle</span></p>
                         <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                            <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
                            Confidence Score: 24%
                         </div>
                      </div>
                      
                      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                         <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-2 block">Strong Performance</span>
                         <p className="text-sm font-medium mb-3 text-slate-200">You are doing excellent in <span className="text-emerald-400 font-bold italic">JavaScript ES6 Fundamentals</span></p>
                         <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold">
                            <span className="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
                            Confidence Score: 92%
                         </div>
                      </div>
                   </div>
                 </div>
               </div>
             )}
          </motion.div>
        </AnimatePresence>

        {/* Roadmap Modal - Official Guide */}
        <AnimatePresence>
          {selectedTask && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTask(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest bg-blue-50 px-2 py-1 rounded">Official Guide</span>
                      <h4 className="text-lg font-bold text-slate-900 mt-2">How to Do CODTECH Internship Projects 🚀</h4>
                    </div>
                    <button onClick={() => setSelectedTask(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 flex-shrink-0"><span className="material-symbols-outlined text-slate-400">close</span></button>
                  </div>

                  {/* Scrollable guide content */}
                  <div className="max-h-[65vh] overflow-y-auto pr-1 space-y-5">

                    {/* Step 1 */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Select Any 4 Projects</p>
                        <p className="text-xs text-slate-500 mt-1">Go to the <span className="font-bold text-blue-600">Projects Section</span> and choose any four projects based on your enrolled domain.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">Understand the Project & Start Working</p>
                        <p className="text-xs text-slate-500 mt-1">Carefully read the requirements before starting.</p>

                        {/* Technical */}
                        <div className="mt-3 bg-blue-50 rounded-2xl p-3">
                          <p className="text-[10px] font-black text-blue-700 uppercase tracking-wide mb-2">✅ For Technical / Coding Projects</p>
                          <ul className="text-[10px] text-slate-600 space-y-1 list-disc ml-3">
                            <li>Write complete code with comments</li>
                            <li>Organize files neatly in folders</li>
                            <li>Upload to a <span className="font-bold">unique GitHub repo</span> per project</li>
                            <li>Submit the GitHub link to us</li>
                          </ul>
                          <p className="text-[10px] font-bold text-slate-700 mt-2">README must include:</p>
                          <ul className="text-[10px] text-slate-600 space-y-0.5 list-disc ml-3">
                            <li>Intern ID &amp; Full Name</li>
                            <li>No. of Weeks, Project Name &amp; Scope</li>
                            <li>Screenshots &amp; Output Images</li>
                          </ul>
                        </div>

                        {/* Non-IT */}
                        <div className="mt-2 bg-emerald-50 rounded-2xl p-3">
                          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-wide mb-2">✅ For Non-IT / Creative / Design Projects</p>
                          <p className="text-[10px] text-slate-600">Create Images, Posters, Visuals, Presentations, Reports or UI Designs. Upload all files to GitHub and submit the link.</p>
                        </div>

                        {/* Data Science */}
                        <div className="mt-2 bg-purple-50 rounded-2xl p-3">
                          <p className="text-[10px] font-black text-purple-700 uppercase tracking-wide mb-2">✅ For Data Science &amp; Analytics Projects</p>
                          <ul className="text-[10px] text-slate-600 space-y-0.5 list-disc ml-3">
                            <li>Use dummy/public datasets (Kaggle, Gov Data)</li>
                            <li>Include: Data Cleaning, Visualization, Analysis</li>
                            <li>Upload: Jupyter Notebook, Graphs, Screenshots</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Wait for Internship Completion 🎓</p>
                        <p className="text-xs text-slate-500 mt-1">After completing your duration and submissions you will receive your <span className="font-bold text-slate-700">Completion Certificate</span>, Project Recognition &amp; Experience Benefits.</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Keep Learning More 📚</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {['Placement Materials','Resume Building','Mock Interviews','Aptitude Practice','Communication Skills','Career Guidance'].map(tag => (
                            <span key={tag} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3">
                      <p className="text-[10px] font-black text-amber-700 uppercase mb-1">⚠️ Important Note</p>
                      <ul className="text-[10px] text-slate-600 space-y-0.5 list-disc ml-3">
                        <li>Maintain proper GitHub repositories</li>
                        <li>Submit projects before deadlines</li>
                        <li>Ensure work is original and properly structured</li>
                      </ul>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-[10px] font-bold text-blue-600 pb-1">✨ Learn • Build • Upload • Grow with CODTECH</p>
                  </div>

                  <button onClick={() => setSelectedTask(null)} className="w-full bg-blue-700 text-white font-bold py-3.5 rounded-2xl mt-4 hover:bg-blue-800 transition-all text-sm">
                    Got it, Let's Build! 🚀
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


        {/* Submission Modal */}
        <AnimatePresence>
          {isSubmitting && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSubmitting(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden">
                <form onSubmit={handleTaskSubmit} className="p-8">
                  <h4 className="text-xl font-bold text-slate-900 mb-2">Submit Project</h4>
                  <p className="text-xs text-slate-500 mb-6">Upload your GitHub repository link for review.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">GitHub Repository URL</label>
                      <input required type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/username/project" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div className="bg-blue-50 p-4 rounded-2xl flex gap-3">
                      <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
                      <p className="text-[10px] text-blue-700 leading-relaxed font-medium">Ensure your README file contains your **InternID**, **Full Name**, and **Project Scope**.</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button type="button" onClick={() => setIsSubmitting(false)} className="flex-1 bg-slate-50 text-slate-600 font-bold py-3.5 rounded-xl text-sm hover:bg-slate-100">Cancel</button>
                    <button type="submit" className="flex-1 bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-blue-800 shadow-lg shadow-blue-100">Submit Project</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Floating Chat Button */}
        <div className="fixed bottom-8 right-8 w-14 h-14 bg-blue-700 rounded-2xl shadow-2xl shadow-blue-400/40 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-30 group">
           <span className="material-symbols-outlined text-white">chat_bubble</span>
           <div className="absolute right-16 bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Chat with Mentor</div>
        </div>
      </main>
    </div>
  );
}
