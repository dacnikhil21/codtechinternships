import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAIN_DATA } from '@/app/utils/skillSuggestions';

export default function ResumeForm({ user, formData, setFormData }) {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const autoFillFromDomain = () => {
    const data = DOMAIN_DATA[formData.domain];
    if (data) {
      setFormData(prev => ({
        ...prev,
        skills: data.skills,
        projects: data.projects,
        summary: data.summary,
        role: formData.domain.replace(' Intern', '') + ' Intern'
      }));
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

  const inputClasses = "w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300";
  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block";

  return (
    <div className="space-y-6 pb-10">
      
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Full Name</label>
          <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="e.g. John Doe" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Email Address</label>
          <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="e.g. john@example.com" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="e.g. +91 98765 43210" className={inputClasses} />
        </div>
        <div className="relative group">
          <label className={labelClasses}>Internship Track</label>
          <div className="flex gap-2">
            <input name="domain" value={formData.domain || ''} onChange={handleChange} placeholder="e.g. Web Development" className={inputClasses} readOnly />
            <button 
              onClick={autoFillFromDomain}
              className="px-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase whitespace-nowrap hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              title="Auto-fill skills and projects for this domain"
            >
              Auto-Fill
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClasses}>Professional Summary</label>
        <textarea 
          name="summary" 
          rows="3" 
          value={formData.summary || ''} 
          onChange={handleChange} 
          placeholder="Brief professional intro..." 
          className={`${inputClasses} resize-none`} 
        />
      </div>

      {/* Skills */}
      <div>
        <label className={labelClasses}>Technical Skills (Click to remove)</label>
        <div className="flex flex-wrap gap-1.5 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl min-h-[60px]">
          {(formData.skills || []).map((skill) => (
            <motion.button
              type="button"
              key={skill}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSkill(skill)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-900 border border-slate-900 text-white shadow-sm flex items-center gap-1.5"
            >
              {skill} <span>✕</span>
            </motion.button>
          ))}
          {(formData.skills || []).length === 0 && (
            <button onClick={autoFillFromDomain} className="text-[11px] text-primary font-bold italic underline">Click Auto-Fill to suggest skills</button>
          )}
        </div>
      </div>

      {/* Projects */}
      <div>
        <label className={labelClasses}>Key Projects (One per line)</label>
        <textarea 
          rows="4" 
          value={(formData.projects || []).join('\n')} 
          onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value.split('\n').filter(p => p.trim()) }))}
          placeholder="Describe your best projects..." 
          className={`${inputClasses} resize-none`} 
        />
      </div>

      {/* Education & Certs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Education (One per line)</label>
          <textarea 
            rows="2" 
            value={(formData.education || []).join('\n')} 
            onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value.split('\n').filter(e => e.trim()) }))} 
            placeholder="College Name, Degree..." 
            className={`${inputClasses} resize-none`} 
          />
        </div>
        <div>
          <label className={labelClasses}>Certifications (Comma separated)</label>
          <input 
            name="certifications" 
            value={Array.isArray(formData.certifications) ? formData.certifications.join(', ') : formData.certifications || ''} 
            onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value.split(',').map(c => c.trim()).filter(c => c) }))} 
            placeholder="AWS, Google Cloud..." 
            className={inputClasses} 
          />
        </div>
      </div>

      {/* Socials */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>LinkedIn Profile</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] font-bold">in/</span>
             <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="username" />
          </div>
        </div>
        <div>
          <label className={labelClasses}>GitHub Profile</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] font-bold">gh/</span>
             <input name="github" value={formData.github || ''} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="username" />
          </div>
        </div>
      </div>

    </div>
  );
}
