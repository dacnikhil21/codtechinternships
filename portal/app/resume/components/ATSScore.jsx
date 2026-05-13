import React, { useMemo } from 'react';
import { getTemplateById } from '../utils/templateData';

export default function ATSScore({ formData, selectedTemplateId }) {
  const template = getTemplateById(selectedTemplateId);

  const score = useMemo(() => {
    if (!template || !template.skillTags) return 0;
    
    const userSkills = formData.skills.map(s => s.toLowerCase());
    const targetSkills = template.skillTags.map(s => s.toLowerCase());
    
    if (targetSkills.length === 0) return 100;
    
    const matches = targetSkills.filter(skill => userSkills.includes(skill));
    const baseScore = Math.round((matches.length / targetSkills.length) * 100);
    
    // Add points for contact info
    let bonus = 0;
    if (formData.name) bonus += 5;
    if (formData.email) bonus += 5;
    if (formData.phone) bonus += 5;
    if (formData.linkedin) bonus += 5;
    
    return Math.min(baseScore + bonus, 100);
  }, [formData, template]);

  if (!selectedTemplateId) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ATS Optimization</h4>
          <p className="text-sm font-bold text-slate-900 tracking-tight uppercase italic">Resume <span className="text-primary">Score</span></p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-black tracking-tighter italic ${score > 70 ? 'text-emerald-500' : score > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-300 font-black tracking-widest uppercase">/100</span>
        </div>
      </div>
      
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
        <div 
          className={`h-full transition-all duration-1000 ${score > 70 ? 'bg-emerald-500' : score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
        {score > 70 
          ? "Great! Your resume is well-optimized for ATS systems in this domain." 
          : "Try adding more domain-specific keywords to improve your score."}
      </p>
    </div>
  );
}
