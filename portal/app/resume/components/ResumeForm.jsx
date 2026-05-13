import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAIN_DATA } from '@/app/utils/skillSuggestions';

export default function ResumeForm({ user, formData, setFormData }) {
  const [showLinkedInVideo, setShowLinkedInVideo] = useState(false);
  
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
        location: 'Mumbai, India',
        college: 'Codtech Institute of Technology',
        education: [
          'IIT Bombay, B.Tech CSE, 2024, 9.2 CGPA',
          'Modern School, XII, 2020, 94%',
          'Modern School, X, 2018, 9.5'
        ],
        certifications: ['AWS Cloud Practitioner', 'Google Data Analytics', 'Coursera Java Masterclass']
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
      
      {/* LinkedIn Video Modal */}
      <AnimatePresence>
        {showLinkedInVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowLinkedInVideo(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-sm uppercase tracking-tight text-slate-900">How to optimize your LinkedIn</h3>
                <button onClick={() => setShowLinkedInVideo(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
                   <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="aspect-video w-full">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/tAXOFWXsq0g?autoplay=1" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 text-center">
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Follow these steps to make your profile placement-ready</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div>
          <label className={labelClasses}>Location</label>
          <input name="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g. Mumbai, India" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>College / University</label>
          <input name="college" value={formData.college || ''} onChange={handleChange} placeholder="e.g. IIT Bombay" className={inputClasses} />
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
        <label className={labelClasses}>Professional Summary / Life Philosophy</label>
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
        <label className={labelClasses}>Technical Skills</label>
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
          <input 
            type="text" 
            placeholder="Type and press enter..."
            className="bg-transparent border-none outline-none text-[11px] font-bold min-w-[150px]"
            onKeyDown={(e) => {
               if (e.key === 'Enter' && e.target.value.trim()) {
                  toggleSkill(e.target.value.trim());
                  e.target.value = '';
               }
            }}
          />
        </div>
      </div>

      {/* Projects */}
      <div>
        <label className={labelClasses}>Projects & Experience (Project Name: Description - One per line)</label>
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
        <label className={labelClasses}>Certifications (Comma separated)</label>
        <input 
          name="certifications" 
          value={Array.isArray(formData.certifications) ? formData.certifications.join(', ') : formData.certifications || ''} 
          onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value.split(',').map(c => c.trim()).filter(c => c) }))} 
          placeholder="AWS Certified, Google Cloud..." 
          className={inputClasses} 
        />
      </div>

      {/* Socials */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1.5">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">LinkedIn (Username)</label>
             <button 
               onClick={() => setShowLinkedInVideo(true)}
               className="flex items-center gap-1 text-[9px] font-black text-primary uppercase hover:underline"
             >
                <span className="material-symbols-outlined text-[12px]">play_circle</span>
                Watch Tutorial
             </button>
          </div>
          <input 
            name="linkedin" 
            value={formData.linkedin || ''} 
            onChange={handleChange} 
            onFocus={() => setShowLinkedInVideo(true)}
            className={inputClasses} 
            placeholder="username" 
          />
        </div>
        <div>
          <label className={labelClasses}>GitHub (Username)</label>
          <input name="github" value={formData.github || ''} onChange={handleChange} className={inputClasses} placeholder="username" />
        </div>
      </div>

    </div>
  );
}
