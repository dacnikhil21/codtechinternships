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

  const handleTaskSubmit = (taskId) => {
    toast.success('Task submitted successfully!');
    // In a real app, this would hit /api/tasks/submit
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex w-full font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
            </div>
            <h1 className="text-blue-700 font-black text-lg tracking-tight">CareerPrep Pro</h1>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
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
              onClick={() => setActiveTab(item.name)}
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
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined">dashboard</span>
            {activeTab} Dashboard
          </h2>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                {user.xp} XP
             </div>
            <button className="bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all active:scale-95">
               <span className="material-symbols-outlined text-sm">bolt</span>
               Quick Apply
            </button>
          </div>
        </header>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]} 👋</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">You're currently working on the <span className="text-blue-600 font-bold">{user.course}</span> track.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Readiness Score Card */}
          <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <h4 className="text-lg font-bold text-slate-800 tracking-tight">Career Readiness Score</h4>
                <p className="text-xs text-slate-400">Based on your completed modules and assessments</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-blue-700">84</span>
                <span className="text-xl font-bold text-slate-300">/100</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between h-40 gap-4 relative z-10">
               {[40, 55, 65, 80, 70, 85, 95].map((h, i) => (
                 <motion.div 
                   initial={{ height: 0 }} 
                   animate={{ height: `${h}%` }} 
                   key={i} 
                   className={`flex-1 rounded-t-lg transition-colors ${i === 6 ? 'bg-blue-800' : 'bg-blue-100'}`} 
                 />
               ))}
            </div>
            <div className="flex justify-between mt-4 relative z-10">
               <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-800"></div> Progress</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-100"></div> Average</div>
               </div>
               <button className="text-blue-700 text-xs font-bold hover:underline">View Analytics</button>
            </div>
          </div>

          {/* Urgent Card */}
          <div className="lg:col-span-4 bg-blue-700 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
               <span className="bg-white/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Upcoming</span>
               <h4 className="text-xl font-bold mt-4 tracking-tight">Technical Orientation</h4>
               <p className="text-xs text-blue-100 mt-2 flex items-center gap-2 opacity-90">
                 <span className="material-symbols-outlined text-sm">calendar_today</span> Friday, 2:00 PM
               </p>
            </div>
            <div className="space-y-3 mt-8 relative z-10">
               <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 border border-white/10">
                  <span className="material-symbols-outlined text-blue-300 text-lg" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                  <span className="text-xs font-bold">Profile Verified</span>
               </div>
               <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3 border border-white/10 opacity-60">
                  <span className="material-symbols-outlined text-lg">pending</span>
                  <span className="text-xs font-bold">Orientation (Pending)</span>
               </div>
            </div>
            <button className="w-full bg-white text-blue-700 font-bold py-3.5 rounded-xl mt-6 hover:bg-blue-50 transition-colors shadow-lg active:scale-95 duration-150 relative z-10">
              Join Session
            </button>
          </div>
        </div>

        {/* Dynamic Content Section */}
        <AnimatePresence mode='wait'>
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
             {activeTab === 'Tasks' ? (
                tasks.length > 0 ? tasks.map((task) => (
                  <div key={task._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-200 transition-all">
                     <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                           <span className="material-symbols-outlined text-xl">assignment</span>
                        </div>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Batch {task.batch}</span>
                     </div>
                     <h5 className="font-bold text-slate-800 mb-1">{task.title}</h5>
                     <p className="text-[10px] text-slate-500 mb-4 line-clamp-2">{task.description}</p>
                     <div className="flex items-center justify-between mt-auto">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.level === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                           {task.level}
                        </span>
                        <button 
                          onClick={() => handleTaskSubmit(task._id)}
                          className="text-blue-700 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Submit Task <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                     </div>
                  </div>
                )) : (
                  <div className="col-span-3 py-20 text-center bg-white rounded-3xl border border-slate-100">
                     <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">hourglass_empty</span>
                     <p className="text-slate-400 font-medium">No tasks available for this track yet.</p>
                  </div>
                )
             ) : (
                <div className="col-span-3 py-20 text-center bg-white rounded-3xl border border-slate-100">
                   <span className="material-symbols-outlined text-4xl text-slate-200 mb-4">lock</span>
                   <p className="text-slate-400 font-medium">{activeTab} content will unlock after Batch 1 completion.</p>
                </div>
             )}
          </motion.div>
        </AnimatePresence>

        {/* Floating Chat Button */}
        <div className="fixed bottom-8 right-8 w-14 h-14 bg-blue-700 rounded-2xl shadow-2xl shadow-blue-400/40 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-30 group">
           <span className="material-symbols-outlined text-white">chat_bubble</span>
           <div className="absolute right-16 bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Chat with Mentor
           </div>
        </div>
      </main>
    </div>
  );
}
