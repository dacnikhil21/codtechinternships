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
            {/* Template Card Visual Representation */}
            <div className={`w-full aspect-[1/1.414] rounded-xl mb-4 overflow-hidden border border-slate-100 shadow-sm transition-all group-hover:shadow-md ${
              selectedTemplateId === template.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}>
              <div className={`w-full h-full bg-white p-4 relative flex flex-col gap-2 ${template.id === 'ats-jake' ? 'bg-slate-50' : ''}`}>
                 {/* CSS Based Mini Preview */}
                 {template.id === 'ats-jake' && (
                    <div className="space-y-1">
                       <div className="h-1.5 w-3/4 bg-slate-800 mx-auto rounded-full"></div>
                       <div className="h-1 w-1/2 bg-slate-200 mx-auto rounded-full"></div>
                       <div className="h-0.5 w-full bg-slate-100 mt-2"></div>
                       <div className="space-y-1 mt-1">
                          <div className="h-1 w-full bg-slate-200 rounded-full"></div>
                          <div className="h-1 w-5/6 bg-slate-100 rounded-full"></div>
                       </div>
                    </div>
                 )}
                 {template.id === 'indian-iit' && (
                    <div className="space-y-1">
                       <div className="flex justify-between items-center">
                          <div className="h-2 w-1/3 bg-slate-800 rounded-sm"></div>
                          <div className="h-2 w-1/4 bg-slate-200 rounded-sm"></div>
                       </div>
                       <div className="h-0.5 w-full bg-slate-900 mt-1"></div>
                       <div className="grid grid-cols-4 gap-0.5 mt-2">
                          {[...Array(4)].map((_, i) => <div key={i} className="h-1.5 bg-slate-100 border border-slate-200"></div>)}
                          {[...Array(8)].map((_, i) => <div key={i} className="h-1 bg-slate-50 border border-slate-200"></div>)}
                       </div>
                    </div>
                 )}
                 {template.id === 'corporate-orange' && (
                    <div className="space-y-1">
                       <div className="h-3 w-1/2 bg-slate-900 rounded-sm"></div>
                       <div className="h-2 w-1/3 bg-orange-500 rounded-sm"></div>
                       <div className="h-4 w-full bg-slate-800 rounded-sm mt-1"></div>
                       <div className="grid grid-cols-3 gap-1 mt-2">
                          {[...Array(6)].map((_, i) => <div key={i} className="h-2 bg-slate-100 rounded-sm"></div>)}
                       </div>
                    </div>
                 )}
                 {template.id === 'altacv-modern' && (
                    <div className="flex h-full gap-2">
                       <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-teal-800 rounded-sm"></div>
                          <div className="h-2 w-1/2 bg-teal-500 rounded-sm"></div>
                          <div className="h-1 w-full bg-slate-200 rounded-full"></div>
                          <div className="space-y-1">
                             <div className="h-2 w-full bg-slate-100 rounded-sm"></div>
                             <div className="h-1 w-3/4 bg-slate-50 rounded-sm"></div>
                          </div>
                       </div>
                       <div className="w-1/3 bg-slate-50 rounded-sm p-1 space-y-1">
                          <div className="h-1.5 w-full bg-slate-300 rounded-sm"></div>
                          <div className="h-1.5 w-full bg-slate-300 rounded-sm"></div>
                          <div className="h-4 w-full bg-slate-200 rounded-sm"></div>
                       </div>
                    </div>
                 )}
                 {template.id === 'deedy-research' && (
                    <div className="flex h-full gap-2">
                       <div className="w-1/3 bg-white p-1 space-y-2">
                          <div className="h-3 w-full bg-slate-800 rounded-sm"></div>
                          <div className="h-1 w-full bg-slate-300 rounded-sm"></div>
                          <div className="h-1 w-full bg-slate-300 rounded-sm"></div>
                          <div className="h-4 w-full bg-slate-100 rounded-sm"></div>
                       </div>
                       <div className="flex-1 space-y-2">
                          <div className="h-2 w-full bg-slate-300 border-b border-slate-900"></div>
                          <div className="h-4 w-full bg-slate-50 rounded-sm"></div>
                          <div className="h-2 w-full bg-slate-300 border-b border-slate-900"></div>
                          <div className="h-4 w-full bg-slate-50 rounded-sm"></div>
                       </div>
                    </div>
                 )}
                 {template.id === 'awesome-executive' && (
                    <div className="space-y-2">
                       <div className="flex flex-col items-center gap-1">
                          <div className="h-3 w-1/2 bg-slate-800 rounded-sm"></div>
                          <div className="h-2 w-1/3 bg-red-600 rounded-sm"></div>
                       </div>
                       <div className="h-0.5 w-full bg-red-600"></div>
                       <div className="space-y-2 mt-2">
                          <div className="h-3 w-full bg-slate-50 rounded-sm"></div>
                          <div className="h-3 w-full bg-slate-50 rounded-sm"></div>
                       </div>
                    </div>
                 )}

                 {/* Selection Badge */}
                 {selectedTemplateId === template.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white shadow-lg">
                       <span className="material-symbols-outlined text-xs">check</span>
                    </div>
                 )}
              </div>
            </div>

            <div className="w-full">
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter truncate">{template.name}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{template.category}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
