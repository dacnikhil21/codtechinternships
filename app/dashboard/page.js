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
  const [activeTab, setActiveTab] = useState('Tasks');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            { name: 'Tasks', icon: 'list_alt' },
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
             <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                {user.xp} XP
             </div>
            <button className="bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all active:scale-95">
               <span className="material-symbols-outlined text-sm">bolt</span>
               Get Certified
            </button>
          </div>
        </header>

        {activeTab === 'Tasks' && (
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
             {activeTab === 'Tasks' ? (
                tasks.length > 0 ? tasks.map((task) => (
                  <div key={task.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                           <span className="material-symbols-outlined text-xl">assignment</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Batch {task.batch}</span>
                     </div>
                     <h5 className="font-bold text-slate-800 mb-1">{task.title}</h5>
                     <p className="text-[10px] text-slate-500 mb-4 line-clamp-2">{task.description}</p>
                     
                     <div className="space-y-2 mt-auto">
                        <button onClick={() => setSelectedTask(task)} className="w-full bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                          <span className="material-symbols-outlined text-sm">map</span> How to Complete?
                        </button>
                        
                        <div className="flex items-center justify-between pt-2">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.level === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {task.level}
                           </span>
                           <button onClick={() => setIsSubmitting(task)} className="text-blue-700 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                             Submit Task <span className="material-symbols-outlined text-sm">arrow_forward</span>
                           </button>
                        </div>
                     </div>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100">
                     <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">hourglass_empty</span>
                     <p className="text-slate-400 font-medium">No tasks available for this track yet.</p>
                  </div>
                )
             ) : activeTab === 'Materials' ? (
                ['Project Guides', 'Technical Documentation', 'Case Studies', 'Reference Materials'].map((title, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><span className="material-symbols-outlined">description</span></div>
                    <div><h5 className="font-bold text-slate-800 text-sm">{title}</h5><p className="text-[10px] text-slate-400">PDF Document • 2.4 MB</p></div>
                  </div>
                ))
             ) : activeTab === 'Preparation' ? (
                ['Technical Q&A', 'System Design', 'Algorithms Masterclass', 'Database Design'].map((title, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h5 className="font-bold text-slate-800 text-sm mb-4">{title}</h5>
                    <button className="w-full bg-blue-50 text-blue-700 text-[10px] font-bold py-2 rounded-lg">Start Practice</button>
                  </div>
                ))
             ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100">
                   <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">lock</span>
                   <p className="text-slate-400 font-medium">{activeTab} section is being updated for your track.</p>
                </div>
             )}
          </motion.div>
        </AnimatePresence>

        {/* Roadmap Modal */}
        <AnimatePresence>
          {selectedTask && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTask(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest bg-blue-50 px-2 py-1 rounded">Official Guide</span>
                      <h4 className="text-xl font-bold text-slate-900 mt-2">How to do CODTECH Projects 🚀</h4>
                    </div>
                    <button onClick={() => setSelectedTask(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"><span className="material-symbols-outlined text-slate-400">close</span></button>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-6">
                      <div className="flex gap-4"><div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div><div><p className="font-bold text-slate-900 text-sm">Select 4 Projects</p><p className="text-xs text-slate-500">Choose any 4 projects based on your domain.</p></div></div>
                      <div className="flex gap-4"><div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div><div><p className="font-bold text-slate-900 text-sm">GitHub Submission</p><p className="text-xs text-slate-500">Include Source Code, README (with InternID), and Screenshots in a unique repo.</p></div></div>
                      <div className="flex gap-4"><div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div><div><p className="font-bold text-slate-900 text-sm">Wait for Certificate</p><p className="text-xs text-slate-500">Upon duration completion, you'll receive your credentials.</p></div></div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTask(null)} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl mt-8 hover:bg-blue-800">I Understand!</button>
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
