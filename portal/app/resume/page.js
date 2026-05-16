'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch auth info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
        } else {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex w-full font-inter overflow-x-hidden text-slate-900 relative">
      
      {/* Navigation Sidebar (Shared) */}
      <aside className={`w-64 bg-white border-r border-slate-200/60 flex flex-col fixed h-full z-[100] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 mb-2">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/dashboard')}>
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-lg" style={{fontVariationSettings: "'FILL' 1"}}>terminal</span>
            </div>
            <h1 className="text-slate-900 font-black text-[13px] tracking-tighter uppercase leading-tight">Codtech<br/><span className="text-primary/60">Placement Hub</span></h1>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
          {[
            { name: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
            { name: 'Resume Guidance', icon: 'description', active: true },
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => { if(item.path) router.push(item.path); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl transition-all font-bold text-[13px] group relative ${item.active ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-primary'}`}
            >
              <span className={`material-symbols-outlined text-[22px] transition-colors ${item.active ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={() => router.push('/dashboard')} className="w-full py-3 text-[11px] font-black text-slate-400 hover:text-primary transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return Home
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/60 bg-white flex items-center justify-between px-6 z-[90] shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <span className="material-symbols-outlined">menu</span>
             </button>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-900 leading-none uppercase">{user.name}</p>
                <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Status: Active</p>
             </div>
          </div>
        </header>

        {/* Professional Resume Guidance Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col items-center bg-[#fdfdff]">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-full max-w-4xl"
           >
              <div className="text-center mb-12">
                 <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight mb-4">
                    Professional <span className="text-primary">Resume Guidance</span>
                 </h2>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-xl mx-auto">
                    Learn how to create a professional ATS-friendly resume through this step-by-step guide.
                 </p>
              </div>

              {/* Embedded Video */}
              <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-12">
                 <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900">
                    <iframe 
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/NbRTVcET8cs" 
                      title="Resume Guidance"
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                 </div>
              </div>

              {/* Build Your Resume Section */}
              <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
                 
                 <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight mb-4">
                       Build Your Resume
                    </h3>
                    <p className="text-slate-300 text-sm md:text-base font-medium max-w-2xl mx-auto mb-8">
                       After watching the tutorial, students can build a professional resume using the platform below.
                    </p>
                    
                    <a 
                      href="https://www.overleaf.com/latex/templates/tagged/cv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-primary/20 group"
                    >
                       Open Resume Builder
                       <span className="material-symbols-outlined text-xl transition-transform group-hover:translate-x-1">open_in_new</span>
                    </a>
                 </div>
              </div>
           </motion.div>
        </div>
      </main>
    </div>
  );
}
