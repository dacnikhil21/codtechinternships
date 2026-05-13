import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ATSScore({ formData, selectedTemplateId }) {
  const score = useMemo(() => {
    let s = 0;
    // Basic info
    if (formData.name) s += 10;
    if (formData.email) s += 10;
    if (formData.phone) s += 10;
    if (formData.summary && formData.summary.length > 50) s += 15;
    
    // Skills (ATS loves keywords)
    const skillCount = (formData.skills || []).length;
    s += Math.min(skillCount * 5, 25);
    
    // Projects & Experience
    const projectCount = (formData.projects || []).length;
    s += Math.min(projectCount * 10, 20);
    
    // Links
    if (formData.linkedin) s += 5;
    if (formData.github) s += 5;

    // Template bonus
    if (selectedTemplateId === 'ats-professional') s += 10;
    
    return Math.min(s, 100);
  }, [formData, selectedTemplateId]);

  const getLabel = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-500', bg: 'bg-green-50' };
    if (score >= 60) return { text: 'Good', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (score >= 40) return { text: 'Fair', color: 'text-amber-500', bg: 'bg-amber-50' };
    return { text: 'Needs Work', color: 'text-red-500', bg: 'bg-red-50' };
  };

  const label = getLabel(score);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ATS Optimization Score</h4>
           <p className={`text-sm font-black ${label.color}`}>{label.text}</p>
        </div>
        <div className="text-2xl font-black text-slate-900">{score}%</div>
      </div>
      
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className={`h-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
        />
      </div>
      
      <p className="mt-4 text-[11px] text-slate-400 leading-relaxed font-medium">
        {score < 80 ? '💡 Add more technical skills and a detailed professional summary to improve your score.' : '🚀 Your resume is well-optimized for most Applicant Tracking Systems!'}
      </p>
    </div>
  );
}
