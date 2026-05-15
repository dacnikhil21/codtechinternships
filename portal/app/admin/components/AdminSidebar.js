'use client';
import { useRouter } from 'next/navigation';

export default function AdminSidebar({ currentTab, onTabChange }) {
  const router = useRouter();

  const menuItems = [
    { name: 'Overview', icon: 'dashboard', id: 'overview' },
    { name: 'Students', icon: 'group', id: 'students' },
    { name: 'Manage Projects', icon: 'assignment', id: 'projects' },
    { name: 'Profile Settings', icon: 'manage_accounts', id: 'settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-white/5 flex flex-col fixed h-full z-50">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <span className="material-symbols-outlined text-white text-xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-white font-black text-sm tracking-tight uppercase leading-none">Admin</h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Control Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest group ${
              currentTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-xl transition-colors ${
              currentTab === item.id ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'
            }`}>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button 
          onClick={async () => {
            try {
              const res = await fetch('/api/auth/me');
              const data = await res.json();
              if (data.success) {
                router.push('/dashboard');
              } else {
                router.push('/login?error=session_expired');
              }
            } catch (e) {
              router.push('/login?error=session_expired');
            }
          }}
          className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-black text-slate-500 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Exit to Portal
        </button>
      </div>
    </aside>
  );
}
