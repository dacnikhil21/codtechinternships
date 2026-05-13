import React from 'react';
import { motion } from 'framer-motion';
import { templates } from '../utils/templateData';

export default function TemplateGallery({ selectedTemplateId, onSelect }) {
  
  // A helper to render a visual representation of each template structure
  const renderThumbnail = (id) => {
    switch(id) {
      case 'ats-professional':
        return (
          <div className="w-full h-full p-2 flex flex-col gap-1.5">
            <div className="w-1/2 h-2 bg-slate-900/10 mx-auto rounded-full mb-2" />
            <div className="w-full h-0.5 bg-slate-900/10 rounded-full" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-slate-100 rounded-full" />
              <div className="w-5/6 h-1 bg-slate-100 rounded-full" />
            </div>
            <div className="w-full h-0.5 bg-slate-900/10 rounded-full mt-1" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-slate-100 rounded-full" />
              <div className="w-full h-1 bg-slate-100 rounded-full" />
              <div className="w-2/3 h-1 bg-slate-100 rounded-full" />
            </div>
          </div>
        );
      case 'modern-tech':
        return (
          <div className="w-full h-full flex">
            <div className="w-2/3 p-2 border-r border-slate-100 flex flex-col gap-1.5">
               <div className="w-3/4 h-3 bg-primary/20 rounded-sm mb-1" />
               <div className="w-full h-1 bg-slate-100 rounded-full" />
               <div className="w-5/6 h-1 bg-slate-100 rounded-full" />
               <div className="w-full h-1 bg-slate-100 rounded-full mt-2" />
               <div className="w-full h-1 bg-slate-100 rounded-full" />
            </div>
            <div className="w-1/3 bg-slate-50 p-2 flex flex-col gap-2">
               <div className="w-full h-1 bg-slate-200 rounded-full" />
               <div className="w-full h-1 bg-slate-200 rounded-full" />
               <div className="mt-2 flex flex-wrap gap-1">
                  <div className="w-3 h-3 bg-primary/10 rounded-sm" />
                  <div className="w-3 h-3 bg-primary/10 rounded-sm" />
                  <div className="w-3 h-3 bg-primary/10 rounded-sm" />
               </div>
            </div>
          </div>
        );
      case 'corporate-fresher':
        return (
          <div className="w-full h-full p-2 flex flex-col gap-2">
            <div className="flex gap-2 border-l-4 border-slate-900 pl-2">
               <div className="flex-1 space-y-1">
                  <div className="w-3/4 h-2.5 bg-slate-900/10 rounded-sm" />
                  <div className="w-1/2 h-1 bg-slate-200 rounded-full" />
               </div>
            </div>
            <div className="w-full h-3 bg-slate-50 rounded-sm mt-1" />
            <div className="grid grid-cols-2 gap-2 mt-1">
               <div className="space-y-1">
                  <div className="w-full h-1 bg-slate-100 rounded-full" />
                  <div className="w-full h-1 bg-slate-100 rounded-full" />
               </div>
               <div className="space-y-1">
                  <div className="w-full h-1 bg-slate-100 rounded-full" />
                  <div className="w-full h-1 bg-slate-100 rounded-full" />
               </div>
            </div>
          </div>
        );
      case 'creative-canvas':
        return (
          <div className="w-full h-full border-t-8 border-indigo-500 flex flex-col p-2 gap-3">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <div className="w-12 h-4 bg-slate-900/10 rounded-sm" />
                  <div className="w-8 h-2 bg-indigo-500/20 rounded-sm" />
               </div>
               <div className="w-8 h-8 bg-slate-50 rounded-full" />
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full" />
            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1">
                  <div className="w-full h-1.5 bg-indigo-50 rounded-full" />
                  <div className="w-full h-1.5 bg-indigo-50 rounded-full" />
               </div>
               <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-50 rounded-full" />
                  <div className="w-full h-1.5 bg-slate-50 rounded-full" />
               </div>
            </div>
          </div>
        );
      case 'minimal-elegant':
        return (
          <div className="w-full h-full p-4 flex flex-col gap-4">
             <div className="w-full h-0.5 bg-slate-100" />
             <div className="flex gap-4">
                <div className="w-1/4 space-y-1.5">
                   <div className="w-full h-1 bg-slate-200 rounded-full" />
                   <div className="w-full h-1 bg-slate-200 rounded-full" />
                   <div className="w-full h-1 bg-slate-200 rounded-full" />
                </div>
                <div className="flex-1 space-y-2">
                   <div className="w-full h-10 bg-slate-50 rounded-sm" />
                   <div className="w-full h-1 bg-slate-100 rounded-full" />
                   <div className="w-5/6 h-1 bg-slate-100 rounded-full" />
                </div>
             </div>
          </div>
        );
      case 'premium-modern':
        return (
          <div className="w-full h-full flex flex-col">
            <div className="w-full h-1/4 bg-slate-900 p-2 flex flex-col gap-1.5">
               <div className="w-1/2 h-2 bg-white/20 rounded-sm" />
               <div className="w-1/3 h-1 bg-blue-400/30 rounded-sm" />
            </div>
            <div className="flex-1 p-2 space-y-3 mt-1">
               <div className="w-full h-1 bg-slate-100 rounded-full" />
               <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="w-full h-1 bg-slate-100 rounded-full" />
                    <div className="w-full h-1 bg-slate-100 rounded-full" />
                  </div>
                  <div className="w-1/3 space-y-1">
                    <div className="w-full h-1 bg-slate-200 rounded-full" />
                    <div className="w-full h-1 bg-slate-200 rounded-full" />
                  </div>
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
          <span className="material-symbols-outlined text-base">style</span>
        </div>
        <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase italic italic">Select <span className="text-primary">Template</span></h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <motion.button
            key={tpl.id}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(tpl.id)}
            className={`flex flex-col rounded-2xl border-2 transition-all text-left relative group overflow-hidden ${
              selectedTemplateId === tpl.id 
                ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
                : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            {/* Visual Thumbnail */}
            <div className={`aspect-[4/5] w-full overflow-hidden border-b ${
              selectedTemplateId === tpl.id ? 'border-primary/20' : 'border-slate-100'
            }`}>
               {renderThumbnail(tpl.id)}
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-tight ${
                  selectedTemplateId === tpl.id ? 'text-primary' : 'text-slate-900'
                }`}>
                  {tpl.name}
                </span>
                {tpl.category === 'Placement Ready' && (
                  <span className="text-[7px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full border border-green-100 uppercase">⭐ Pro</span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-tight line-clamp-2">{tpl.description}</p>
            </div>

            {selectedTemplateId === tpl.id && (
              <div className="absolute top-2 right-2 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <span className="material-symbols-outlined text-[12px] font-bold">check</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
