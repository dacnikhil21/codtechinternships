import React from 'react';
import { motion } from 'framer-motion';
import { templates } from '../utils/templateData';

export default function TemplateGallery({ selectedTemplateId, onSelect }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
            <span className="material-symbols-outlined text-base">style</span>
          </div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase italic">Select <span className="text-primary">Template</span></h3>
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">6 Professional Layouts</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {templates.map((template) => (
          <motion.button
            key={template.id}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(template.id)}
            className={`relative group flex flex-col items-start p-3 rounded-2xl border-2 transition-all text-left ${
              selectedTemplateId === template.id 
              ? 'border-primary bg-indigo-50/30 shadow-lg shadow-primary/5' 
              : 'border-slate-100 hover:border-slate-200 bg-white'
            }`}
          >
            {/* Template Card Visual Preview */}
            <div className={`w-full aspect-[1/1.414] rounded-xl mb-4 overflow-hidden border border-slate-100 shadow-sm transition-all group-hover:shadow-md relative ${
              selectedTemplateId === template.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}>
               {/* Real Visual Preview Image */}
               <img 
                 src={`/resumes/${template.id}.png`} 
                 alt={template.name}
                 className="w-full h-full object-cover object-top"
                 loading="lazy"
               />
               
               {/* Overlay for better contrast on hover */}
               <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors"></div>

                  {/* Selection Badge */}
                  {selectedTemplateId === template.id && (
                     <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg z-10">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                     </div>
                  )}
            </div>

            <div className="w-full">
              <div className="flex items-center gap-1.5 mb-1">
                 <div className={`w-1.5 h-1.5 rounded-full ${
                    template.category === 'Professional' ? 'bg-emerald-500' :
                    template.category === 'Academic' ? 'bg-indigo-500' :
                    template.category === 'Corporate' ? 'bg-orange-500' : 'bg-slate-400'
                 }`}></div>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em]">{template.category}</p>
              </div>
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate">{template.name}</h4>
              <p className="text-[9px] font-medium text-slate-400 mt-0.5 line-clamp-1">{template.description || 'Professional Layout'}</p>
            </div>
          </motion.button>
        ))}
      </div>

    </div>
  );
}
