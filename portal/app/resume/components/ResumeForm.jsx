import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAIN_DATA } from '@/app/utils/skillSuggestions';

export default function ResumeForm({ user, formData, setFormData }) {
  const [showLinkedInVideo, setShowLinkedInVideo] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const autoFillFromDomain = () => {
    let bestMatchKey = null;
    const courseNorm = (formData.domain || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Find matching key in DOMAIN_DATA
    for (const key of Object.keys(DOMAIN_DATA)) {
       const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
       if (keyNorm.includes(courseNorm) || courseNorm.includes(keyNorm)) {
          bestMatchKey = key; break;
       }
    }
    
    // Manual fallbacks
    if (!bestMatchKey) {
       if (courseNorm.includes('react') || courseNorm.includes('frontend')) bestMatchKey = 'React.js Web Development Intern';
       else if (courseNorm.includes('java')) bestMatchKey = 'Java Programming Intern';
       else if (courseNorm.includes('python')) bestMatchKey = 'Python Programming Intern';
       else if (courseNorm.includes('data')) bestMatchKey = 'Data Analytics Intern';
       else if (courseNorm.includes('cyber') || courseNorm.includes('hack')) bestMatchKey = 'Cybersecurity & Ethical Hacking';
       else if (courseNorm.includes('ui') || courseNorm.includes('ux') || courseNorm.includes('figma')) bestMatchKey = 'Ul/UX Intern';
       else bestMatchKey = Object.keys(DOMAIN_DATA)[0]; // ultimate fallback
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
           name: user.name || '',
           email: user.email || '',
           phone: '',
           domain: user.course || '',
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

  const inputClasses = "w-full bg-slate-50/30 border border-slate-200 rounded-xl px-4 py-3.5 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300";
  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-2 block";

  return (
    <div className="space-y-8 pb-10">
      
      {/* LinkedIn Video Modal */}
      <AnimatePresence>
        {showLinkedInVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 bg-[#0077b5] text-white rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">link</span>
                   </div>
                   <h3 className="font-black text-[11px] uppercase tracking-tight text-slate-900">Placement-Ready LinkedIn Tutorial</h3>
                </div>
                <button onClick={() => setShowLinkedInVideo(false)} className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
                   <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/tAXOFWXsq0g?autoplay=1" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4 text-center bg-slate-50 border-t">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PRO TIP</p>
                 <p className="text-[12px] font-medium text-slate-600">A well-optimized LinkedIn profile increases your internship selection rate by 4x.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
         <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">Personal <span className="text-primary">Information</span></h4>
         <button onClick={clearAll} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline transition-all flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">delete_sweep</span>
            Clear All
         </button>
      </div>

      {/* Personal Info */}
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

      <div className="relative group p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
        <div className="flex items-center justify-between mb-4">
           <div>
              <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Internship Domain</label>
              <p className="text-[13px] font-bold text-slate-900">{formData.domain}</p>
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
          rows="4" 
          value={formData.summary || ''} 
          onChange={handleChange} 
          placeholder="Brief professional intro..." 
          className={`${inputClasses} resize-none leading-relaxed`} 
        />
      </div>

      {/* Skills */}
      <div>
        <label className={labelClasses}>Technical Expertise</label>
        <div className="flex flex-wrap gap-2 p-4 bg-slate-50/30 border border-slate-200 rounded-2xl min-h-[70px]">
          {(formData.skills || []).map((skill) => (
            <motion.button
              type="button"
              key={skill}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSkill(skill)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-900 text-white shadow-sm flex items-center gap-2 group transition-all"
            >
              {skill} <span className="opacity-50 group-hover:opacity-100 transition-opacity">✕</span>
            </motion.button>
          ))}
          <input 
            type="text" 
            placeholder="Add skill..."
            className="bg-transparent border-none outline-none text-[12px] font-bold min-w-[150px] ml-2"
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
        <label className={labelClasses}>Projects & Experience (Project Name: Description)</label>
        <div className="space-y-3">
           <textarea 
             rows="5" 
             value={(formData.projects || []).join('\n')} 
             onChange={(e) => setFormData(prev => ({ ...prev, projects: e.target.value.split('\n').filter(p => p.trim()) }))}
             placeholder="Project One: Developed a high-scale React application...&#10;Project Two: Integrated RESTful APIs using Node.js..." 
             className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`} 
           />
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">• Use colon (:) to separate title and description. One project per line.</p>
        </div>
      </div>

      {/* Education */}
      <div>
        <label className={labelClasses}>Education History (Inst, Degree, Year, CGPA)</label>
        <div className="space-y-3">
           <textarea 
             rows="3" 
             value={(formData.education || []).join('\n')} 
             onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value.split('\n').filter(e => e.trim()) }))} 
             placeholder="IIT Bombay, B.Tech CSE, 2024, 9.2 CGPA&#10;Modern School, XII, 2020, 94%" 
             className={`${inputClasses} resize-none font-mono text-[12px] leading-relaxed`} 
           />
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2">• Format: Institute, Degree, Completion Year, Result</p>
        </div>
      </div>

      {/* Socials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 bg-blue-50/30 rounded-2xl border border-blue-100/50">
          <div className="flex justify-between items-center mb-3">
             <label className="text-[10px] font-black text-[#0077b5] uppercase tracking-widest">LinkedIn Profile</label>
             <button 
               onClick={() => setShowLinkedInVideo(true)}
               className="flex items-center gap-1.5 text-[9px] font-black text-[#0077b5] uppercase bg-white px-2.5 py-1.5 rounded-lg border border-blue-100 shadow-sm hover:bg-blue-50 transition-all"
             >
                <span className="material-symbols-outlined text-[14px]">play_circle</span>
                Tutorial
             </button>
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
  );
}
