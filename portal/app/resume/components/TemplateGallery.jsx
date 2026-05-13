import React from 'react';
import { motion } from 'framer-motion';
import { templates } from '../utils/templateData';

export default function TemplateGallery({ selectedTemplateId, onSelect }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
          <span className="material-symbols-outlined text-base">style</span>
        </div>
        <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase italic">Select <span className="text-primary">Layout</span></h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {templates.map((tpl) => (
          <motion.button
            key={tpl.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(tpl.id)}
            className={`p-3 rounded-2xl border-2 transition-all text-left relative group overflow-hidden ${
              selectedTemplateId === tpl.id 
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                <span className={`text-[10px] font-black uppercase tracking-tight block mb-1 ${
                  selectedTemplateId === tpl.id ? 'text-primary' : 'text-slate-900'
                }`}>
                  {tpl.name}
                </span>
                <p className="text-[9px] text-slate-400 font-medium leading-tight">{tpl.description}</p>
              </div>
              
              {selectedTemplateId === tpl.id && (
                <div className="mt-2 flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                   <span className="text-[8px] font-black text-primary uppercase">Active</span>
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
