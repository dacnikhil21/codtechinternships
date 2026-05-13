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
        <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase italic">Select <span className="text-primary">Template</span></h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((tpl, i) => (
          <motion.button
            key={tpl.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(tpl.id)}
            className={`p-1.5 rounded-2xl border-2 transition-all text-left relative group overflow-hidden ${
              selectedTemplateId === tpl.id 
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
                : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            {/* Template Card Mockup */}
            <div className={`aspect-[4/5] rounded-xl mb-3 flex flex-col p-3 overflow-hidden ${
              selectedTemplateId === tpl.id ? 'bg-white' : 'bg-slate-50'
            }`}>
              <div className={`w-3/4 h-1.5 rounded-full mb-1 ${selectedTemplateId === tpl.id ? 'bg-primary/20' : 'bg-slate-200'}`} />
              <div className={`w-1/2 h-1 rounded-full mb-3 ${selectedTemplateId === tpl.id ? 'bg-primary/10' : 'bg-slate-100'}`} />
              
              <div className="space-y-1.5">
                {[1, 2, 3].map(n => (
                  <div key={n} className="flex gap-1.5">
                    <div className={`w-4 h-4 rounded-sm ${selectedTemplateId === tpl.id ? 'bg-primary/5' : 'bg-white'}`} />
                    <div className="flex-1 space-y-1">
                      <div className={`w-full h-1 rounded-full ${selectedTemplateId === tpl.id ? 'bg-slate-100' : 'bg-slate-200/50'}`} />
                      <div className={`w-2/3 h-1 rounded-full ${selectedTemplateId === tpl.id ? 'bg-slate-50' : 'bg-slate-100/50'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-2 pb-1">
              <span className={`text-[11px] font-black uppercase tracking-tight ${
                selectedTemplateId === tpl.id ? 'text-primary' : 'text-slate-600'
              }`}>
                {tpl.name}
              </span>
            </div>

            {selectedTemplateId === tpl.id && (
              <div className="absolute top-3 right-3 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[12px] font-bold">check</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
