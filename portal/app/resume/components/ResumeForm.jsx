import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDomainData } from '@/app/utils/skillSuggestions';
import ResumePreview from '@/app/resume/components/ResumePreview';
import DownloadButton from '@/app/resume/components/DownloadButton';

const STEPS = [
  { id: 1, title: 'Personal Details', icon: 'person' },
  { id: 2, title: 'Education', icon: 'school' },
  { id: 3, title: 'Experience', icon: 'work' },
  { id: 4, title: 'Projects', icon: 'integration_instructions' },
  { id: 5, title: 'Skills', icon: 'bolt' },
  { id: 6, title: 'Certifications', icon: 'workspace_premium' },
  { id: 7, title: 'Summary', icon: 'edit_document' },
  { id: 8, title: 'Additional', icon: 'add_circle' },
  { id: 9, title: 'Preview & Finish', icon: 'visibility' }
];

export default function ResumeForm({ user, formData, setFormData, setFlowState, selectedTemplateId }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  const [domainData, setDomainData] = useState(getDomainData(formData.domain));

  useEffect(() => {
     setDomainData(getDomainData(formData.domain));
  }, [formData.domain]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, key, value) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      if (!arr[index]) arr[index] = {};
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), emptyItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const skills = Array.isArray(prev.skills) ? prev.skills : [];
      const updated = skills.includes(skill)
        ? skills.filter((s) => s !== skill)
        : [...skills, skill];
      return { ...prev, skills: updated };
    });
  };

  const nextStep = () => { if (currentStep < STEPS.length) setCurrentStep(c => c + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(c => c - 1); };

  const inputClasses = "w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300";
  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block";

  // Score Calculation
  const calculateScore = () => {
    let score = 0;
    if (formData.name && formData.email && formData.phone) score += 20;
    if (formData.summary && formData.summary.length > 20) score += 15;
    if (formData.education && formData.education.length > 0) score += 15;
    if (formData.experience && formData.experience.length > 0) score += 20;
    if (formData.projects && formData.projects.length > 0) score += 15;
    if (formData.skills && formData.skills.length > 4) score += 15;
    return score;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between mb-2">
               <div>
                  <h4 className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Domain Auto-Targeting</h4>
                  <p className="text-[10px] font-bold text-indigo-400 mt-1 uppercase tracking-widest">Targeting: {formData.domain || 'Not Specified'}</p>
               </div>
               <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">radar</span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClasses}>Full Name</label>
                <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. John Doe" className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Professional Title</label>
                <input name="role" value={formData.role || ''} onChange={handleChange} placeholder="e.g. React Developer Intern" className={inputClasses} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-100">
              <div>
                <label className={labelClasses}>LinkedIn URL</label>
                <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className={inputClasses} placeholder="linkedin.com/in/username" />
              </div>
              <div>
                <label className={labelClasses}>GitHub URL</label>
                <input name="github" value={formData.github || ''} onChange={handleChange} className={inputClasses} placeholder="github.com/username" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add your academic background. Employers value relevant coursework.</p>
            
            {(formData.education || []).map((edu, idx) => (
              <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm relative group">
                <button onClick={() => removeArrayItem('education', idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelClasses}>College / Institution Name</label>
                    <input value={edu.institution || ''} onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)} placeholder="e.g. IIT Bombay" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Degree</label>
                    <input value={edu.degree || ''} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} placeholder="e.g. B.Tech" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Branch / Specialization</label>
                    <input value={edu.branch || ''} onChange={(e) => handleArrayChange('education', idx, 'branch', e.target.value)} placeholder="e.g. Computer Science" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>CGPA / Percentage</label>
                    <input value={edu.cgpa || ''} onChange={(e) => handleArrayChange('education', idx, 'cgpa', e.target.value)} placeholder="e.g. 9.2 or 92%" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Graduation Year</label>
                    <input value={edu.graduationYear || ''} onChange={(e) => handleArrayChange('education', idx, 'graduationYear', e.target.value)} placeholder="e.g. 2024" className={inputClasses} />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => addArrayItem('education', { institution: '', degree: '', branch: '', cgpa: '', graduationYear: '' })}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 bg-slate-50/50"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span> Add Education
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Include internships, freelance work, or relevant volunteer experience.</p>
            
            {(formData.experience || []).map((exp, idx) => (
              <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm relative group mb-6">
                <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Job Title / Role</label>
                    <input value={exp.title || ''} onChange={(e) => handleArrayChange('experience', idx, 'title', e.target.value)} placeholder="e.g. Frontend Developer Intern" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Company / Organization</label>
                    <input value={exp.company || ''} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} placeholder="e.g. CodTech IT Solutions" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Location</label>
                    <input value={exp.location || ''} onChange={(e) => handleArrayChange('experience', idx, 'location', e.target.value)} placeholder="e.g. Remote" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Start Date</label>
                    <input value={exp.startDate || ''} onChange={(e) => handleArrayChange('experience', idx, 'startDate', e.target.value)} placeholder="e.g. Jan 2024" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>End Date</label>
                    <input value={exp.endDate || ''} onChange={(e) => handleArrayChange('experience', idx, 'endDate', e.target.value)} placeholder="e.g. Present" className={inputClasses} />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Description Bullets (ATS Friendly)</label>
                  <textarea 
                    rows="4"
                    value={(exp.bullets || []).join('\n')}
                    onChange={(e) => handleArrayChange('experience', idx, 'bullets', e.target.value.split('\n'))}
                    className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`}
                    placeholder="• Developed responsive user interfaces...&#10;• Improved load time by 20%..."
                  />
                </div>

                {/* AI Suggestions for Bullets */}
                <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                     <span className="material-symbols-outlined text-[12px]">auto_awesome</span> Suggested Bullets
                  </p>
                  <div className="space-y-2">
                     {domainData.experienceBullets.slice(0, 3).map((bullet, i) => (
                        <div key={i} className="flex gap-2 items-start group/bullet cursor-pointer" onClick={() => {
                           const currentBullets = exp.bullets || [];
                           handleArrayChange('experience', idx, 'bullets', [...currentBullets, bullet]);
                        }}>
                           <span className="material-symbols-outlined text-[14px] text-blue-400 mt-0.5 group-hover/bullet:text-blue-600 transition-colors">add_circle</span>
                           <p className="text-[11px] font-medium text-slate-600 group-hover/bullet:text-slate-900 transition-colors">{bullet}</p>
                        </div>
                     ))}
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => addArrayItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', bullets: [] })}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 bg-slate-50/50"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span> Add Experience
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Showcase your technical projects. Add GitHub and Live links if available.</p>
            
            {/* Suggested Projects */}
            {domainData.projectSuggestions?.length > 0 && (
               <div className="mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lightbulb</span> Recommended Projects for {formData.domain}
                 </p>
                 <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
                    {domainData.projectSuggestions.map((proj, i) => (
                       <div key={i} className="shrink-0 w-64 bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                          <h5 className="text-[12px] font-bold text-slate-900 truncate">{proj.title}</h5>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{proj.description}</p>
                          <button 
                            onClick={() => addArrayItem('projects', proj)}
                            className="mt-3 w-full py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                          >
                            Use Project
                          </button>
                       </div>
                    ))}
                 </div>
               </div>
            )}

            {(formData.projects || []).map((proj, idx) => (
              <div key={idx} className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm relative group mb-6">
                <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Project Title</label>
                    <input value={proj.title || ''} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} placeholder="e.g. E-commerce Dashboard" className={inputClasses} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Tech Stack (Comma separated)</label>
                    <input value={proj.techStack || ''} onChange={(e) => handleArrayChange('projects', idx, 'techStack', e.target.value)} placeholder="e.g. React, Node.js, MongoDB" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>GitHub Link (Optional)</label>
                    <input value={proj.github || ''} onChange={(e) => handleArrayChange('projects', idx, 'github', e.target.value)} placeholder="e.g. github.com/user/repo" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Live Link (Optional)</label>
                    <input value={proj.liveLink || ''} onChange={(e) => handleArrayChange('projects', idx, 'liveLink', e.target.value)} placeholder="e.g. myapp.com" className={inputClasses} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Description</label>
                    <textarea 
                      rows="3"
                      value={proj.description || ''}
                      onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)}
                      className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`}
                      placeholder="Describe what you built and the impact..."
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => addArrayItem('projects', { title: '', techStack: '', description: '', github: '', liveLink: '' })}
              className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-[11px] font-black text-slate-400 uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 bg-slate-50/50"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span> Add Project
            </button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Add relevant skills. ATS systems scan for these exact keywords.</p>
            
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
              <label className={labelClasses}>Your Skills</label>
              <div className="flex flex-wrap gap-2 min-h-[100px] mb-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
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
                        e.preventDefault();
                        toggleSkill(e.target.value.trim());
                        e.target.value = '';
                     }
                  }}
                />
              </div>

              {domainData.skills?.length > 0 && (
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Suggested Skills for your domain</p>
                    <div className="flex flex-wrap gap-2">
                       {domainData.skills.filter(s => !(formData.skills || []).includes(s)).map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[11px] font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-1"
                          >
                             <span className="material-symbols-outlined text-[12px]">add</span> {skill}
                          </button>
                       ))}
                    </div>
                 </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">List professional certificates and achievements.</p>
            
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
               <label className={labelClasses}>Certifications & Awards (One per line)</label>
               <textarea 
                 rows="8" 
                 value={(formData.certifications || []).join('\n')} 
                 onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value.split('\n').filter(c => c.trim()) }))} 
                 placeholder="AWS Solutions Architect Associate&#10;Winner, Smart India Hackathon 2023" 
                 className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`} 
               />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Your summary is the first thing recruiters read. Make it count.</p>
            
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm">
               <label className={labelClasses}>Professional Summary</label>
               <textarea 
                 rows="6" 
                 name="summary"
                 value={formData.summary || ''} 
                 onChange={handleChange} 
                 placeholder="Passionate and results-driven professional..." 
                 className={`${inputClasses} resize-none text-[13px] leading-relaxed mb-4`} 
               />

               {domainData.summarySuggestions?.length > 0 && (
                  <div className="mt-4 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-3 flex items-center gap-1">
                       <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Smart Suggestions
                    </p>
                    <div className="space-y-3">
                       {domainData.summarySuggestions.map((summary, i) => (
                          <div 
                            key={i} 
                            onClick={() => setFormData(prev => ({ ...prev, summary }))}
                            className="p-3 bg-white border border-indigo-100 rounded-lg text-[11px] text-slate-600 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all"
                          >
                             {summary}
                          </div>
                       ))}
                    </div>
                  </div>
               )}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">You can add optional sections to stand out further.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {['Hobbies & Interests', 'Languages', 'Publications', 'Volunteer Experience'].map(section => (
                 <div key={section} className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex items-center gap-3 cursor-not-allowed opacity-60">
                    <input type="checkbox" disabled className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                    <span className="text-[12px] font-bold text-slate-700">{section} (Coming Soon)</span>
                 </div>
               ))}
            </div>
          </div>
        );

      case 9:
        const score = calculateScore();
        return (
          <div className="space-y-8">
            <div className="text-center mb-4">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Your Resume is Ready!</h3>
               <p className="text-xs font-medium text-slate-500 mt-2 max-w-sm mx-auto">Review your placement-ready resume below. You can download it directly as a PDF.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-5">
               <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                  <div>
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">ATS Optimization Score: {score}/100</h4>
                     <p className="text-[10px] text-slate-500 mt-0.5">{score > 70 ? 'Excellent! Highly optimized.' : 'Add more details to boost your score.'}</p>
                  </div>
                  <DownloadButton formData={formData} selectedTemplateId={selectedTemplateId} />
               </div>
            </div>

            <div className="w-full flex justify-center bg-slate-50/50 p-4 md:p-8 rounded-3xl border border-slate-100 overflow-hidden">
               <div className="w-[210mm] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] origin-top transform scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 mb-[-50%] sm:mb-[-40%] md:mb-[-20%] xl:mb-0">
                  <ResumePreview formData={formData} selectedTemplateId={selectedTemplateId} />
               </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-white h-full max-h-[85vh] md:max-h-none">
      
      <div className="mb-6 px-6 md:px-8 mt-4 flex items-center justify-between gap-4 h-12">
        <div className="flex overflow-x-auto gap-2 custom-scrollbar -mx-2 px-2 md:-mx-4 md:px-4 flex-1 items-center">
           {STEPS.map((step) => (
             <button 
               key={step.id}
               onClick={() => { setCurrentStep(step.id); setShowQuickPreview(false); }}
               className={`shrink-0 px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all font-bold text-[11px] uppercase tracking-widest h-10 ${
                 currentStep === step.id 
                 ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                 : currentStep > step.id 
                   ? 'bg-white border-primary/30 text-primary hover:bg-slate-50' 
                   : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
               }`}
             >
                <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                {step.title}
             </button>
           ))}
        </div>
        
        {/* Quick Preview Toggle - Perfectly Aligned */}
        <button 
          onClick={() => setShowQuickPreview(!showQuickPreview)}
          className={`shrink-0 px-4 py-2.5 rounded-xl border font-black text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all h-10 ${showQuickPreview ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
        >
          <span className="material-symbols-outlined text-sm">{showQuickPreview ? 'edit' : 'visibility'}</span>
          {showQuickPreview ? 'Close Preview' : 'Live Preview'}
        </button>
      </div>

      <div className="p-4 md:p-8 flex-1 overflow-y-auto custom-scrollbar min-h-[300px] md:min-h-0">
        <AnimatePresence mode="wait">
          {showQuickPreview ? (
             <motion.div 
               key="preview" 
               initial={{ opacity: 0, scale: 0.98 }} 
               animate={{ opacity: 1, scale: 1 }} 
               className="flex justify-center p-4 md:p-0"
             >
                <div className="w-[210mm] shadow-2xl origin-top transform scale-[0.4] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.8] xl:scale-[0.9] mb-[-60%] sm:mb-[-40%] lg:mb-[-10%]">
                   <ResumePreview formData={formData} selectedTemplateId={selectedTemplateId} />
                </div>
             </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Static Bottom Navigation */}
      <div className="shrink-0 bg-white border-t border-slate-100 p-6 md:p-8 flex items-center justify-between z-10">
        <button 
          onClick={prevStep} 
          disabled={currentStep === 1}
          className={`px-5 py-2.5 rounded-xl border border-slate-200 font-black text-[10px] uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-50 cursor-not-allowed text-slate-400' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Back
        </button>
        
        {currentStep < STEPS.length ? (
          <button 
            onClick={nextStep}
            className="px-8 py-2.5 rounded-xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            Next <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        ) : (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             <span className="material-symbols-outlined text-[16px] text-green-500 align-middle mr-1">check_circle</span> All Steps Complete
          </div>
        )}
      </div>

    </div>
  );
}
