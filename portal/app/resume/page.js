'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const [activeStep, setActiveStep] = useState(0); // 0: Select, 1: Edit/Preview

  // Form and template state
  const [selectedTemplateId, setSelectedTemplateId] = useState('ats-jake');
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
          const saved = localStorage.getItem(`resume_draft_v3_${data.data.id}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            setFormData(prev => ({ ...prev, ...parsed }));
            if (parsed.selectedTemplateId) {
              setSelectedTemplateId(parsed.selectedTemplateId);
              setActiveStep(1); // Resume if already selected
            }
          } else {
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
  }, [router]);

  // Persist draft
  useEffect(() => {
    if (user?.id) {
      const toSave = { ...formData, selectedTemplateId };
      localStorage.setItem(`resume_draft_v3_${user.id}`, JSON.stringify(toSave));
    }
  }, [formData, selectedTemplateId, user]);

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
            <span className="material-symbols-outlined text-sm">arrow_back</span> Return Home
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/60 bg-white flex items-center justify-between px-6 z-[90] shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <span className="material-symbols-outlined">menu</span>
             </button>
             <div className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
               <h2 className="text-[10px] md:text-xs font-black text-slate-900 tracking-tight uppercase italic">Placement-Ready <span className="text-primary">Resume Builder</span></h2>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {activeStep === 1 && (
                <button 
                  onClick={() => setActiveStep(0)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                   <span className="material-symbols-outlined text-sm">style</span>
                   Change Template
                </button>
             )}
             <div className="hidden sm:flex flex-col items-end">
                <p className="text-[10px] font-black text-slate-900 leading-none uppercase">{user.name}</p>
                <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">Status: Active</p>
             </div>
          </div>
        </header>

        {/* Step-based Content */}
        <div className="flex-1 overflow-hidden relative">
           <AnimatePresence mode="wait">
              {activeStep === 0 ? (
                 <motion.div 
                   key="selection"
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: 20 }}
                   className="h-full overflow-y-auto p-6 md:p-12 lg:p-16 flex flex-col items-center bg-[#fdfdff]"
                 >
                    <div className="max-w-4xl w-full text-center mb-12">
                       <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight mb-4">Choose Your <span className="text-primary">Success Blueprint</span></h3>
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs max-w-xl mx-auto">Recreated from professional Overleaf templates. Fully optimized for Indian placements and global ATS standards.</p>
                    </div>
                    <div className="max-w-5xl w-full">
                       <TemplateGallery 
                         selectedTemplateId={selectedTemplateId} 
                         onSelect={(id) => {
                            setSelectedTemplateId(id);
                            setTimeout(() => setActiveStep(1), 300);
                         }} 
                       />
                    </div>
                 </motion.div>
              ) : (
                 <motion.div 
                   key="builder"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="h-full flex flex-col lg:flex-row overflow-hidden"
                 >
                    {/* Left: Editor */}
                    <div className="w-full lg:w-[450px] xl:w-[500px] border-r border-slate-200 bg-white overflow-y-auto p-6 md:p-8 custom-scrollbar">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                             <div className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
                                <span className="material-symbols-outlined text-lg">edit_document</span>
                             </div>
                             <div>
                                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none">Editor</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Customize your details</p>
                             </div>
                          </div>
                          <ATSScore formData={formData} selectedTemplateId={selectedTemplateId} />
                       </div>
                       
                       <ResumeForm user={user} formData={formData} setFormData={setFormData} />
                       
                       <div className="hidden lg:block sticky bottom-0 bg-white/95 backdrop-blur-md pt-4 pb-4 border-t border-slate-50 mt-10">
                          <DownloadButton formData={formData} selectedTemplateId={selectedTemplateId} />
                       </div>
                    </div>

                    {/* Right: Preview */}
                    <div className="flex-1 bg-slate-50/50 overflow-y-auto overflow-x-hidden p-4 md:p-12 lg:p-16 flex flex-col items-center custom-scrollbar pb-32 lg:pb-16 w-full">
                       <div className="lg:hidden w-full mb-8 flex justify-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm">
                             <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic">Live Placement Preview</span>
                          </div>
                       </div>
                       
                       <div className="w-full flex justify-center perspective-[2000px] overflow-hidden">
                          <motion.div 
                            initial={{ rotateX: 5, y: 20, opacity: 0 }}
                            animate={{ rotateX: 0, y: 0, opacity: 1 }}
                            className="w-[210mm] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] origin-top transform scale-[0.4] min-[375px]:scale-[0.43] min-[414px]:scale-[0.48] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.75] xl:scale-90 2xl:scale-100 mb-[-50%] sm:mb-[-20%] lg:mb-0"
                          >
                             <ResumePreview formData={formData} selectedTemplateId={selectedTemplateId} />
                          </motion.div>
                       </div>
                    </div>

                    {/* Mobile Floating Actions */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-[80] flex gap-3">
                       <button 
                         onClick={() => setActiveStep(0)}
                         className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200 shadow-sm"
                       >
                          <span className="material-symbols-outlined">style</span>
                       </button>
                       <div className="flex-1">
                          <DownloadButton formData={formData} selectedTemplateId={selectedTemplateId} />
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
      
    </div>
  );
}
