import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAIN_DATA } from '@/app/utils/skillSuggestions';

const STEPS = [
  { id: 1, title: 'Personal Details', subtitle: 'Basic contact info' },
  { id: 2, title: 'Summary & Domain', subtitle: 'Professional intro' },
  { id: 3, title: 'Education', subtitle: 'Academic history' },
  { id: 4, title: 'Projects', subtitle: 'Experience & Projects' },
  { id: 5, title: 'Skills', subtitle: 'Technical expertise' },
  { id: 6, title: 'Certifications', subtitle: 'Extra achievements' }
];

export default function ResumeForm({ user, formData, setFormData, setFlowState }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showLinkedInVideo, setShowLinkedInVideo] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const autoFillFromDomain = () => {
    let bestMatchKey = null;
    const courseNorm = (formData.domain || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const key of Object.keys(DOMAIN_DATA)) {
       const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
       if (keyNorm.includes(courseNorm) || courseNorm.includes(keyNorm)) {
          bestMatchKey = key; break;
       }
    }
    
    if (!bestMatchKey) {
       if (courseNorm.includes('react') || courseNorm.includes('frontend')) bestMatchKey = 'React.js Web Development Intern';
       else if (courseNorm.includes('java')) bestMatchKey = 'Java Programming Intern';
       else if (courseNorm.includes('python')) bestMatchKey = 'Python Programming Intern';
       else if (courseNorm.includes('data')) bestMatchKey = 'Data Analytics Intern';
       else if (courseNorm.includes('cyber') || courseNorm.includes('hack')) bestMatchKey = 'Cybersecurity & Ethical Hacking';
       else if (courseNorm.includes('ui') || courseNorm.includes('ux') || courseNorm.includes('figma')) bestMatchKey = 'Ul/UX Intern';
       else bestMatchKey = Object.keys(DOMAIN_DATA)[0];
    }

    const data = DOMAIN_DATA[bestMatchKey];
    if (data) {
      setFormData(prev => ({
        ...prev,
        skills: data.skills,
        projects: data.projects.map(p => `${p}: Designed and developed core application components leveraging ${data.skills.slice(0, 3).join(', ')} to achieve performance and scalability.`),
        summary: data.summary,
        role: formData.domain.replace(' Intern', '') + ' Intern',
        location: prev.location || 'Mumbai, India',
        education: prev.education?.length > 0 ? prev.education : [
          'Add your degree (e.g. B.Tech Computer Science)',
          'Add your high school (e.g. XII Grade, 2022)'
        ],
        certifications: prev.certifications?.length > 0 ? prev.certifications : [
          'Add your certifications here (e.g. AWS Cloud Practitioner)'
        ]
      }));
    } else {
      alert("Please enter a valid internship domain first.");
    }
  };

  const clearAll = () => {
     if (window.confirm('Are you sure you want to clear all details?')) {
        setFormData({
           name: user?.name || '',
           email: user?.email || '',
           phone: '',
           domain: user?.course || '',
           role: '',
           summary: '',
           skills: [],
           projects: [],
           certifications: [],
           education: [],
           linkedin: '',
           github: ''
        });
     }
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const skills = Array.isArray(prev.skills) ? prev.skills : [];
      const updatedSkills = skills.includes(skill)
        ? skills.filter((s) => s !== skill)
        : [...skills, skill];
      return { ...prev, skills: updatedSkills };
    });
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) setCurrentStep(c => c + 1);
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  const inputClasses = "w-full bg-slate-50/30 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300";
  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((step) => (
            <div 
               key={step.id} 
               onClick={() => setCurrentStep(step.id)}
               className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold cursor-pointer transition-all ${
                 currentStep === step.id ? 'bg-primary text-white shadow-lg' : 
                 currentStep > step.id ? 'bg-indigo-100 text-primary' : 'bg-slate-100 text-slate-400'
               }`}
            >
               {currentStep > step.id ? <span className="material-symbols-outlined text-[14px]">check</span> : step.id}
            </div>
          ))}
        </div>
        <div className="text-center">
           <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{STEPS[currentStep-1].title}</h4>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{STEPS[currentStep-1].subtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 pb-20 custom-scrollbar pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Full Name</label>
                    <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. John Doe" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Current Role / Tagline</label>
                    <input name="role" value={formData.role || ''} onChange={handleChange} placeholder="e.g. Full Stack Developer" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Location</label>
                    <input name="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g. Mumbai, India" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="e.g. john@example.com" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="e.g. +91 98765 43210" className={inputClasses} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100/50">
                    <div className="flex justify-between items-center mb-3">
                       <label className="text-[10px] font-black text-[#0077b5] uppercase tracking-widest">LinkedIn Profile</label>
                    </div>
                    <input 
                      name="linkedin" 
                      value={formData.linkedin || ''} 
                      onChange={handleChange} 
                      className={`${inputClasses} border-blue-200 focus:ring-[#0077b5]/20 focus:border-[#0077b5]`} 
                      placeholder="Username or Full URL" 
                    />
                  </div>
                  <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">GitHub Profile</label>
                    <input 
                      name="github" 
                      value={formData.github || ''} 
                      onChange={handleChange} 
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 text-[13px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-all placeholder:text-slate-600" 
                      placeholder="GitHub Username" 
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="relative group p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                  <div className="flex items-center justify-between mb-4">
                     <div>
                        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Internship Domain</label>
                        <p className="text-[13px] font-bold text-slate-900">{formData.domain || 'Not specified'}</p>
                     </div>
                     <button 
                       onClick={autoFillFromDomain}
                       className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase whitespace-nowrap hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                     >
                       <span className="material-symbols-outlined text-sm">magic_button</span>
                       Auto-Fill Details
                     </button>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Auto-fill will populate industry-standard skills, projects, and summaries based on your enrolled track.</p>
                </div>

                <div>
                  <label className={labelClasses}>Professional Summary</label>
                  <textarea 
                    name="summary" 
                    rows="6" 
                    value={formData.summary || ''} 
                    onChange={handleChange} 
                    placeholder="Brief professional intro..." 
                    className={`${inputClasses} resize-none leading-relaxed`} 
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <label className={labelClasses}>Education History (Inst, Degree, Year, CGPA)</label>
                <div className="space-y-3">
                   <textarea 
                     rows="8" 
                     value={(formData.education || []).join('\n')} 
                     onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value.split('\n').filter(e => e.trim()) }))} 
                     placeholder="IIT Bombay, B.Tech CSE, 2024, 9.2 CGPA&#10;Modern School, XII, 2020, 94%" 
                     className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`} 
                   />
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">• Format: Institute, Degree, Completion Year, Result. One per line.</p>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <label className={labelClasses}>Projects & Experience (Project Name: Description)</label>
                <div className="space-y-3">
                   <textarea 
                     rows="10" 
                     value={(formData.projects || []).join('\n')} 
                     onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value.split('\n').filter(p => p.trim()) }))}
                     placeholder="Project One: Developed a high-scale React application...&#10;Project Two: Integrated RESTful APIs using Node.js..." 
                     className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`} 
                   />
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">• Use colon (:) to separate title and description. One project per line.</p>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <label className={labelClasses}>Technical Expertise</label>
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50/30 border border-slate-200 rounded-2xl min-h-[150px]">
                  {(formData.skills || []).map((skill) => (
                    <motion.button
                      type="button"
                      key={skill}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSkill(skill)}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-900 text-white shadow-sm flex items-center gap-2 group transition-all h-fit"
                    >
                      {skill} <span className="opacity-50 group-hover:opacity-100 transition-opacity">✕</span>
                    </motion.button>
                  ))}
                  <input 
                    type="text" 
                    placeholder="Type skill & press Enter..."
                    className="bg-transparent border-none outline-none text-[12px] font-bold min-w-[200px] ml-2 h-fit mt-1"
                    onKeyDown={(e) => {
                       if (e.key === 'Enter' && e.target.value.trim()) {
                          toggleSkill(e.target.value.trim());
                          e.target.value = '';
                       }
                    }}
                  />
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <label className={labelClasses}>Certifications & Achievements</label>
                <div className="space-y-3">
                   <textarea 
                     rows="6" 
                     value={(formData.certifications || []).join('\n')} 
                     onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value.split('\n').filter(c => c.trim()) }))} 
                     placeholder="AWS Solutions Architect Associate&#10;Hackathon Winner 2023" 
                     className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`} 
                   />
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">• One certification/achievement per line.</p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <button 
          onClick={currentStep === 1 ? clearAll : prevStep} 
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          {currentStep === 1 ? 'Clear All' : 'Back'}
        </button>
        
        {currentStep < STEPS.length ? (
          <button 
            onClick={nextStep}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            Next Step <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        ) : (
          <button 
            onClick={() => {
              alert("Resume updated! See preview on the right or download.");
            }}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            Finish <span className="material-symbols-outlined text-sm">check_circle</span>
          </button>
        )}
      </div>
    </div>
  );
}
