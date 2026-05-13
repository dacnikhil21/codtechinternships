import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ATSScore({ formData, selectedTemplateId }) {
  const score = useMemo(() => {
    let s = 0;
    // Essential Profile Info
    if (formData.name) s += 10;
    if (formData.email) s += 10;
    if (formData.phone) s += 10;
    if (formData.summary && formData.summary.length > 30) s += 15;
    
    // Technical Keywords (ATS Priority)
    const skillCount = (formData.skills || []).length;
    s += Math.min(skillCount * 4, 20);
    
    // Experience & Projects (Action Oriented)
    const projectCount = (formData.projects || []).length;
    s += Math.min(projectCount * 8, 20);
    
    // Professional Links
    if (formData.linkedin) s += 5;
    if (formData.github) s += 5;

    // ATS Compatibility Penalty for Creative/Heavy Layouts
    if (['ats-jake', 'indian-iit'].includes(selectedTemplateId)) {
       s += 5; // Perfect score
    } else if (['altacv-modern', 'awesome-executive'].includes(selectedTemplateId)) {
       s -= 10; // Slightly lower for visual layouts
    }
    
    return Math.max(0, Math.min(s, 100));
  }, [formData, selectedTemplateId]);

  const getLabel = (score) => {
    if (score >= 85) return { text: 'Placement Ready', color: 'text-emerald-500', bg: 'bg-emerald-50' };
    if (score >= 65) return { text: 'Good Stability', color: 'text-sky-500', bg: 'bg-sky-50' };
    if (score >= 45) return { text: 'Improving', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { text: 'Refinement Needed', color: 'text-rose-500', bg: 'bg-rose-50' };
  };

  const label = getLabel(score);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ATS Optimization</h4>
           <p className={`text-[12px] font-black ${label.color} uppercase`}>{label.text}</p>
        </div>
        <div className="flex flex-col items-end">
           <div className="text-3xl font-black text-slate-900 tracking-tighter">{score}%</div>
        </div>
      </div>
      
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden relative z-10 border border-white">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full shadow-sm ${score >= 85 ? 'bg-emerald-500' : score >= 65 ? 'bg-sky-500' : score >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
        />
      </div>
      
      <div className="mt-4 flex items-start gap-2 relative z-10">
         <span className="material-symbols-outlined text-[14px] text-slate-300 mt-0.5">info</span>
         <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
            {score < 85 ? 'Tip: Use the ATS Professional template and add more specific technical keywords to hit 90%+.' : 'Excellent! Your resume is highly optimized for corporate placement systems.'}
         </p>
      </div>
    </div>
  );
}
