'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminSidebar from './components/AdminSidebar';
import ProjectManager from './components/ProjectManager';
import SupportManager from './components/SupportManager';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Profile Form State
  const [profile, setProfile] = useState({ name: '', email: '', password: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    fetchData();
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.status === 403) {
        toast.error('Access Denied: Admins Only');
        router.push('/dashboard');
        return;
      }
      const statsData = await statsRes.json();
      setStats(statsData.stats);

      const usersRes = await fetch(`/api/admin/users?q=${searchTerm}`);
      const usersData = await usersRes.json();
      setUsers(usersData.users);

      // Also fetch current profile for the settings tab
      const profileRes = await fetch('/api/admin/profile');
      const profileData = await profileRes.json();
      if (profileData.success) {
        setProfile({ ...profileData.user, password: '' });
      }

    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        if (profile.password) setProfile(prev => ({ ...prev, password: '' }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this student account? This action is permanent.')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User removed');
        fetchData();
      }
    } catch (err) {
      toast.error('Deletion failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Initializing Control Center</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <AdminSidebar currentTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 ml-64 p-12 overflow-y-auto">
        
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <header className="mb-12">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2">Platform <span className="text-indigo-500">Overview</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Administrative Dashboard & Control Center</p>
              </header>

              <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] group-hover:bg-indigo-600/20 transition-all"></div>
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Total Students</p>
                  <h3 className="text-5xl font-black tracking-tighter">{stats?.totalStudents || 0}</h3>
                </div>
                <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[60px] group-hover:bg-purple-600/20 transition-all"></div>
                  <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Projects Managed</p>
                  <h3 className="text-5xl font-black tracking-tighter">{stats?.totalProjects || 0}</h3>
                </div>
                <div className="bg-slate-900 border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 blur-[60px] group-hover:bg-amber-600/20 transition-all"></div>
                   <p className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-2">Active Domains</p>
                   <h3 className="text-5xl font-black tracking-tighter">{stats?.topCourses?.length || 0}</h3>
                </div>
              </section>

              {/* Quick Table in Overview */}
              <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-8">
                 <h4 className="text-lg font-black uppercase tracking-tight mb-6">Recent Registrations</h4>
                 <div className="overflow-hidden">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                         <th className="pb-4">Name</th>
                         <th className="pb-4">Domain</th>
                         <th className="pb-4">Date</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {stats?.recentUsers?.map((u, i) => (
                          <tr key={i} className="text-sm">
                            <td className="py-4 font-bold">{u.name}</td>
                            <td className="py-4 text-slate-400">{u.course}</td>
                            <td className="py-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'students' && (
            <motion.div key="students" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2">Student <span className="text-indigo-500">Directory</span></h2>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage all internship participants</p>
                </div>
                <div className="relative w-full md:w-96 group">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors">search</span>
                   <input 
                     type="text" 
                     placeholder="Search name, email, or course..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                   />
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Student</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Course / Domain</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined On</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xs border border-indigo-500/20">{u.name.charAt(0)}</div>
                            <div>
                              <p className="font-bold text-sm">{u.name}</p>
                              <p className="text-[11px] text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">{u.course}</span>
                        </td>
                        <td className="px-8 py-6 text-[11px] font-medium text-slate-500 uppercase">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-6">
                          <button onClick={() => deleteUser(u.id)} className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><span className="material-symbols-outlined text-lg">delete</span></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && (
            <motion.div key="projects" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ProjectManager />
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div key="support" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SupportManager />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
              <header className="mb-12 text-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-2">Profile <span className="text-indigo-500">Settings</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Update your administrative credentials</p>
              </header>

              <div className="bg-slate-900 border border-white/5 p-12 rounded-[3rem] shadow-2xl">
                <form onSubmit={handleProfileUpdate} className="space-y-8">
                   <div className="space-y-6">
                      <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                          required
                        />
                      </div>
                      <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">Admin Email</label>
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all"
                          required
                        />
                      </div>
                      <div className="group">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">New Password (Leave blank to keep current)</label>
                        <input 
                          type="password" 
                          value={profile.password}
                          onChange={(e) => setProfile(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
                        />
                      </div>
                   </div>

                   <button 
                     disabled={isUpdatingProfile}
                     type="submit" 
                     className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                   >
                     {isUpdatingProfile ? 'Updating System...' : 'Update Admin Profile'}
                     {!isUpdatingProfile && <span className="material-symbols-outlined text-lg">save</span>}
                   </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
