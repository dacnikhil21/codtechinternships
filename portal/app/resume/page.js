'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import TemplateGallery from '@/app/resume/components/TemplateGallery';
import ResumeForm from '@/app/resume/components/ResumeForm';
import ATSScore from '@/app/resume/components/ATSScore';

export default function ResumePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [flowState, setFlowState] = useState('TEMPLATES'); // 'TEMPLATES', 'BUILDER'

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
          const saved = localStorage.getItem(`resume_draft_v4_${data.data.id}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            setFormData(prev => ({ ...prev, ...parsed }));
            if (parsed.selectedTemplateId) {
              setSelectedTemplateId(parsed.selectedTemplateId);
              setFlowState('BUILDER'); // Resume if already selected
            }
          } else {
            const course = data.data.course?.toLowerCase() || '';
            let domainSkills = [];
            if (course.includes('react') || course.includes('mern') || course.includes('frontend') || course.includes('full stack') || course.includes('backend') || course.includes('.net') || course.includes('web')) {
               domainSkills = ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Node.js', 'REST APIs', 'Git/GitHub'];
            } else if (course.includes('java')) {
               domainSkills = ['Java Core', 'Spring Boot', 'Hibernate', 'MySQL', 'OOP Concepts', 'RESTful APIs'];
            } else if (course.includes('python')) {
               domainSkills = ['Python', 'Django / Flask', 'Data Structures', 'SQL', 'API Development', 'Git'];
            } else if (course.includes('data')) {
               domainSkills = ['Python', 'SQL', 'Pandas', 'NumPy', 'Data Visualization', 'Machine Learning Basics'];
            } else if (course.includes('cyber') || course.includes('hack')) {
               domainSkills = ['Network Security', 'Penetration Testing', 'Linux', 'Cryptography', 'Vulnerability Assessment'];
            } else if (course.includes('ai') || course.includes('machine learning')) {
               domainSkills = ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP'];
            } else if (course.includes('c++') || course.includes('c ')) {
               domainSkills = ['C / C++', 'Data Structures', 'Algorithms', 'OOP', 'Memory Management'];
            } else if (course.includes('embed') || course.includes('iot')) {
               domainSkills = ['C / C++', 'Microcontrollers', 'RTOS', 'IoT Architectures', 'Hardware Interfacing'];
            } else if (course.includes('ui') || course.includes('ux') || course.includes('figma')) {
               domainSkills = ['Figma', 'Prototyping', 'User Research', 'Wireframing', 'UI/UX Design', 'Design Systems'];
            } else if (course.includes('market')) {
               domainSkills = ['SEO', 'Content Strategy', 'Google Analytics', 'Social Media Marketing', 'Email Campaigns'];
            } else if (course.includes('cloud') || course.includes('devops')) {
               domainSkills = ['AWS / Azure', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Linux', 'Networking'];
            } else {
               domainSkills = ['Problem Solving', 'Data Structures', 'Algorithms', 'Team Collaboration', 'Git/GitHub'];
            }

            setFormData(prev => ({
              ...prev,
              name: data.data.name || '',
              email: data.data.email || '',
              domain: data.data.course || '',
              role: (data.data.course || '').replace(' Intern', '') + ' Intern',
              skills: domainSkills
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
      localStorage.setItem(`resume_draft_v4_${user.id}`, JSON.stringify(toSave));
    }
  }, [formData, selectedTemplateId, user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex w-full font-inter overflow-x-hidden text-slate-900 relative">
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      
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

      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/60 bg-white flex items-center justify-between px-6 z-[90] shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <span className="material-symbols-outlined">menu</span>
             </button>
             <div className="flex items-center gap-3">
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             {flowState === 'BUILDER' && (
                <button 
                  onClick={() => setFlowState('TEMPLATES')}
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
               {flowState === 'TEMPLATES' && (
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
                            setTimeout(() => setFlowState('BUILDER'), 300);
                         }} 
                       />
                    </div>
                 </motion.div>
              )}

              {flowState === 'BUILDER' && (
                  <motion.div 
                    key="builder"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
                  >
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                       <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
                                <span className="material-symbols-outlined text-xl">edit_document</span>
                             </div>
                             <div>
                                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none">Editor</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fill in your details</p>
                             </div>
                          </div>
                          <ATSScore formData={formData} selectedTemplateId={selectedTemplateId} />
                       </div>
                       
                       <div className="flex-1 relative">
                          <ResumeForm user={user} formData={formData} setFormData={setFormData} selectedTemplateId={selectedTemplateId} />
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
