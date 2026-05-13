import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkillsForDomain } from '@/app/utils/skillSuggestions';

export default function ResumeForm({ user, formData, setFormData }) {
  const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    if (formData.domain) {
      const suggestions = getSkillsForDomain(formData.domain);
      setAvailableSkills(suggestions);
    }
  }, [formData.domain]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    <div className="space-y-6">
      
      {/* Personal Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Full Name</label>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Email Address</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="e.g. john@example.com" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +91 98765 43210" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Current Domain</label>
          <input name="domain" value={formData.domain} onChange={handleChange} placeholder="e.g. Web Development" className={inputClasses} />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Internship Role</label>
        <input name="role" value={formData.role} onChange={handleChange} placeholder="e.g. React.js Developer Intern" className={inputClasses} />
      </div>

      {/* Skills Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClasses}>Technical Skills</label>
          <span className="text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">Domain Suggestions</span>
        </div>
        <div className="flex flex-wrap gap-1.5 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
          {(availableSkills || []).map((skill) => (
            <motion.button
              type="button"
              key={skill}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                (formData.skills || []).includes(skill) 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {skill}
              {(formData.skills || []).includes(skill) && <span className="ml-1.5 text-[10px]">✕</span>}
            </motion.button>
          ))}
          {(availableSkills || []).length === 0 && <p className="text-[11px] text-slate-400 italic">Enter a domain to see suggestions...</p>}
        </div>
      </div>

      {/* Multi-line fields */}
      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Projects (One per line)</label>
          <textarea 
            rows="3" 
            value={(formData.projects || []).join('\n')} 
            onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value.split('\n') }))}
            placeholder="E-commerce Platform using MERN stack..." 
            className={`${inputClasses} resize-none`} 
          />
        </div>
        <div>
          <label className={labelClasses}>Education</label>
          <input name="education" value={(formData.education || []).join(', ')} onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value.split(',') }))} placeholder="B.Tech in CSE, 2024" className={inputClasses} />
        </div>
      </div>

      {/* Socials */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>LinkedIn Profile</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] font-bold">in/</span>
             <input name="linkedin" value={formData.linkedin} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="username" />
          </div>
        </div>
        <div>
          <label className={labelClasses}>GitHub Profile</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-[12px] font-bold">gh/</span>
             <input name="github" value={formData.github} onChange={handleChange} className={`${inputClasses} pl-10`} placeholder="username" />
          </div>
        </div>
      </div>

    </div>
  );
}
