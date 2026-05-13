'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import TemplateGallery from '@/app/resume/components/TemplateGallery';
import ResumeForm from '@/app/resume/components/ResumeForm';
import ResumePreview from '@/app/resume/components/ResumePreview';
import ATSScore from '@/app/resume/components/ATSScore';
import DownloadButton from '@/app/resume/components/DownloadButton';

export default function ResumePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form and template state
  const [selectedTemplateId, setSelectedTemplateId] = useState('ats-professional');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    domain: '',
    role: '',
    summary: '',
    skills: [],
    projects: [],
    certifications: [],
    education: [],
    linkedin: '',
    github: ''
  });

  // Fetch auth info on mount and load draft if any
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          // Load persisted draft
          const saved = localStorage.getItem(`resume_draft_v2_${data.data.id}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            setFormData(prev => ({ ...prev, ...parsed }));
            if (parsed.selectedTemplateId) setSelectedTemplateId(parsed.selectedTemplateId);
          } else {
            // Default populate from profile
            setFormData(prev => ({
              ...prev,
              name: data.data.name || '',
              email: data.data.email || '',
              domain: data.data.course || '',
              role: (data.data.course || '').replace(' Intern', '') + ' Intern'
            }));
          }
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
  }, []);

  // Persist draft on changes
  useEffect(() => {
    if (user?.id) {
      const toSave = { ...formData, selectedTemplateId };
      localStorage.setItem(`resume_draft_v2_${user.id}`, JSON.stringify(toSave));
    }
  }, [formData, selectedTemplateId, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex w-full font-inter overflow-x-hidden text-slate-900 relative">
      
      {/* Mobile Top Bar - NEW */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/60 z-[80] flex items-center justify-between px-6 backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/dashboard')}>
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
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/dashboard')}>
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
            { name: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
            { name: 'Resume Builder', icon: 'description', active: true },
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
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen lg:overflow-hidden pt-16 lg:pt-0">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
            <h2 className="text-[10px] md:text-xs font-bold text-slate-400 tracking-tight uppercase">Resume Builder</h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-2">
                <p className="text-[11px] font-black text-slate-900 leading-none">{user.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{user.course}</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-primary font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
             </div>
          </div>
        </header>

        {/* Builder Area */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
          
          {/* Editor Column */}
          <section className="w-full lg:max-w-xl lg:border-r border-slate-200 bg-white overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
               <TemplateGallery selectedTemplateId={selectedTemplateId} onSelect={setSelectedTemplateId} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center border border-slate-100">
                     <span className="material-symbols-outlined text-base">edit_note</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase italic">Resume <span className="text-primary">Content</span></h3>
               </div>
               <ResumeForm user={user} formData={formData} setFormData={setFormData} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
               <ATSScore formData={formData} selectedTemplateId={selectedTemplateId} />
            </motion.div>

            <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-4 pb-4 border-t border-slate-50 z-20">
               <DownloadButton formData={formData} selectedTemplateId={selectedTemplateId} />
            </div>
          </section>

          {/* Preview Column */}
          <section className="w-full bg-slate-50/50 overflow-y-auto p-4 md:p-8 lg:p-12 flex justify-center custom-scrollbar">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.4 }}
              className="w-full max-w-[210mm] shadow-2xl origin-top scale-[0.65] sm:scale-[0.85] md:scale-100"
            >
               <ResumePreview formData={formData} selectedTemplateId={selectedTemplateId} />
            </motion.div>
          </section>

        </div>
      </main>
      
    </div>
  );
}
