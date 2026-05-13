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
        role: formData.domain.replace(' Intern', '') + ' Intern',
        // Example education for Indian Fresher template table (Institute, Degree, Year, CGPA)
        education: [
          'Codtech Institute of Tech, B.Tech CSE, 2024, 8.5 CGPA',
          'Modern School, XII, 2020, 92%',
          'Modern School, X, 2018, 9.0'
        ]
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
          <label className={labelClasses}>Current Role / Tagline</label>
          <input name="role" value={formData.role || ''} onChange={handleChange} placeholder="e.g. Full Stack Developer" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Email Address</label>
          <input name="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="e.g. john@example.com" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="e.g. +91 98765 43210" className={inputClasses} />
        </div>
        <div className="relative group col-span-full">
          <label className={labelClasses}>Internship Track</label>
          <div className="flex gap-2">
            <input name="domain" value={formData.domain || ''} onChange={handleChange} placeholder="e.g. Web Development" className={inputClasses} readOnly />
            <button 
              onClick={autoFillFromDomain}
              className="px-6 bg-primary text-white rounded-xl text-[11px] font-bold uppercase whitespace-nowrap hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Auto-Fill Details
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className={labelClasses}>Professional Summary / Profile</label>
        <textarea 
          name="summary" 
          rows="4" 
          value={formData.summary || ''} 
          onChange={handleChange} 
          placeholder="Brief professional intro..." 
          className={`${inputClasses} resize-none`} 
        />
      </div>

      {/* Skills */}
      <div>
        <label className={labelClasses}>Technical Skills (Select or Type)</label>
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
            <p className="text-[11px] text-slate-400 font-medium italic">No skills added. Use Auto-Fill or add skills manually.</p>
          )}
        </div>
      </div>

      {/* Projects */}
      <div>
        <label className={labelClasses}>Key Projects (Project Name: Description - One per line)</label>
        <textarea 
          rows="5" 
          value={(formData.projects || []).join('\n')} 
          onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value.split('\n').filter(p => p.trim()) }))}
          placeholder="e.g. Portfolio Website: Built using React and Tailwind CSS..." 
          className={`${inputClasses} resize-none`} 
        />
      </div>

      {/* Education */}
      <div>
        <label className={labelClasses}>Education (Institute, Degree, Year, CGPA/% - One per line)</label>
        <textarea 
          rows="3" 
          value={(formData.education || []).join('\n')} 
          onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value.split('\n').filter(e => e.trim()) }))} 
          placeholder="e.g. ABC College, B.Tech CSE, 2024, 8.5 CGPA" 
          className={`${inputClasses} resize-none`} 
        />
      </div>

      {/* Certifications */}
      <div>
        <label className={labelClasses}>Certifications & Achievements (Comma separated)</label>
        <input 
          name="certifications" 
          value={Array.isArray(formData.certifications) ? formData.certifications.join(', ') : formData.certifications || ''} 
          onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value.split(',').map(c => c.trim()).filter(c => c) }))} 
          placeholder="AWS Certified Cloud Practitioner, Google Cloud..." 
          className={inputClasses} 
        />
      </div>

      {/* Socials */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>LinkedIn (Username only)</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] font-bold">in/</span>
             <input name="linkedin" value={formData.linkedin || ''} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="username" />
          </div>
        </div>
        <div>
          <label className={labelClasses}>GitHub (Username only)</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] font-bold">gh/</span>
             <input name="github" value={formData.github || ''} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="username" />
          </div>
        </div>
      </div>

    </div>
  );
}
