import React from 'react';
import { motion } from 'framer-motion';
import { templates } from '../utils/templateData';

export default function TemplateGallery({ selectedTemplateId, onSelect }) {
  
  const renderThumbnail = (id) => {
    switch(id) {
      case 'ats-professional':
        return (
          <div className="w-full h-full p-2 flex flex-col gap-1 bg-white font-sans">
            <div className="w-1/2 h-2.5 bg-slate-950 mx-auto rounded-sm mb-1" />
            <div className="w-full h-0.5 bg-slate-200 mx-auto mb-3" />
            <div className="w-1/3 h-1.5 bg-slate-950 rounded-sm mb-1" />
            <div className="w-full h-0.5 bg-slate-950 mb-2" />
            <div className="space-y-1.5 pl-2 mb-4">
              <div className="flex justify-between items-center"><div className="w-1/2 h-1 bg-slate-300" /><div className="w-1/4 h-1 bg-slate-200" /></div>
              <div className="w-full h-0.5 bg-slate-100" />
              <div className="w-5/6 h-0.5 bg-slate-100" />
            </div>
            <div className="w-1/3 h-1.5 bg-slate-950 rounded-sm mb-1" />
            <div className="w-full h-0.5 bg-slate-950 mb-2" />
            <div className="space-y-1.5 pl-2">
              <div className="w-full h-0.5 bg-slate-100" />
              <div className="w-2/3 h-0.5 bg-slate-100" />
            </div>
          </div>
        );
      case 'indian-fresher':
        return (
          <div className="w-full h-full p-2 flex flex-col gap-1 bg-white border border-slate-200">
            <div className="flex justify-between items-center mb-2">
               <div className="w-6 h-6 bg-slate-100 border border-slate-300 rounded-sm" />
               <div className="w-1/3 h-2 bg-slate-900" />
               <div className="w-1/4 h-3 flex flex-col gap-0.5"><div className="w-full h-0.5 bg-slate-200" /><div className="w-full h-0.5 bg-slate-200" /></div>
            </div>
            <div className="w-1/4 h-1 bg-slate-900 rounded-sm" />
            <div className="w-full h-0.5 bg-slate-900 mb-1" />
            <div className="w-full border border-slate-300 rounded-sm overflow-hidden mb-2">
               <div className="h-2 bg-slate-100 border-b border-slate-300" />
               <div className="h-2 border-b border-slate-200" />
               <div className="h-2 border-b border-slate-200" />
            </div>
            <div className="w-1/4 h-1 bg-slate-900 rounded-sm" />
            <div className="w-full h-0.5 bg-slate-900 mb-1" />
            <div className="space-y-1.5">
               <div className="w-full h-0.5 bg-slate-100" />
               <div className="w-5/6 h-0.5 bg-slate-100" />
            </div>
          </div>
        );
      case 'corporate-professional':
        return (
          <div className="w-full h-full flex flex-col bg-white overflow-hidden">
            <div className="p-3 space-y-1">
               <div className="w-2/3 h-3.5 bg-slate-950" />
               <div className="w-1/2 h-1.5 bg-slate-400" />
               <div className="w-full h-3 bg-slate-50 mt-1" />
            </div>
            <div className="w-full h-3 bg-orange-600 flex items-center px-3 gap-2">
               <div className="w-1/4 h-0.5 bg-white/40" />
               <div className="w-1/4 h-0.5 bg-white/40" />
            </div>
            <div className="p-3 space-y-4">
               <div className="space-y-1">
                  <div className="w-1/4 h-1.5 bg-orange-600 mb-1" />
                  <div className="grid grid-cols-4 gap-1">
                     <div className="h-1 bg-slate-100" /><div className="h-1 bg-slate-100" /><div className="h-1 bg-slate-100" /><div className="h-1 bg-slate-100" />
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="w-1/4 h-1.5 bg-orange-600 mb-1" />
                  <div className="grid grid-cols-2 gap-2"><div className="h-4 bg-slate-50" /><div className="h-4 bg-slate-50" /></div>
               </div>
            </div>
          </div>
        );
      case 'creative-sidebar':
        return (
          <div className="w-full h-full flex bg-white">
            <div className="flex-1 p-3 flex flex-col gap-3">
               <div className="w-3/4 h-5 bg-slate-950 mb-1" />
               <div className="w-1/4 h-1.5 bg-rose-900 border-b border-amber-400 pb-1" />
               <div className="w-full h-12 bg-slate-50 border-l-2 border-slate-200" />
               <div className="w-1/4 h-1.5 bg-rose-900 border-b border-amber-400 pb-1" />
               <div className="w-full h-12 bg-slate-50 border-l-2 border-slate-200" />
            </div>
            <div className="w-[35%] bg-slate-50/50 border-l border-slate-100 p-3 flex flex-col items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-rose-900 border-2 border-white shadow-md" />
               <div className="w-full space-y-2">
                  <div className="w-full h-1 bg-rose-900/20" />
                  <div className="flex flex-wrap gap-1"><div className="w-6 h-2 bg-white border border-slate-200 rounded-sm" /><div className="w-8 h-2 bg-white border border-slate-200 rounded-sm" /></div>
               </div>
               <div className="w-full space-y-1">
                  <div className="w-full h-1 bg-rose-900/20" />
                  <div className="flex justify-between items-center"><div className="w-4 h-0.5 bg-slate-300" /><div className="flex gap-0.5"><div className="w-1 h-1 rounded-full bg-rose-900" /><div className="w-1 h-1 rounded-full bg-rose-900" /><div className="w-1 h-1 rounded-full bg-slate-200" /></div></div>
               </div>
            </div>
          </div>
        );
      case 'academic-research':
        return (
          <div className="w-full h-full p-4 flex flex-col bg-white">
            <div className="w-1/2 h-5 bg-indigo-900 mb-3" />
            <div className="grid grid-cols-2 gap-4 mb-5"><div className="space-y-1"><div className="w-full h-0.5 bg-slate-200" /><div className="w-full h-0.5 bg-slate-200" /></div><div className="space-y-1"><div className="w-full h-0.5 bg-slate-200" /><div className="w-full h-0.5 bg-slate-200" /></div></div>
            <div className="space-y-4">
               <div className="space-y-1.5">
                  <div className="w-1/3 h-2 bg-indigo-900 border-b-2 border-indigo-900 mb-1" />
                  <div className="w-full h-12 bg-indigo-50/50 rounded-sm" />
               </div>
               <div className="space-y-1.5">
                  <div className="w-1/3 h-2 bg-indigo-900 border-b-2 border-indigo-900 mb-1" />
                  <div className="w-full h-12 bg-indigo-50/50 rounded-sm" />
               </div>
            </div>
          </div>
        );
      case 'executive-premium':
        return (
          <div className="w-full h-full flex flex-col bg-white">
            <div className="w-full h-[30%] bg-slate-800 p-4 flex flex-col justify-center items-center gap-2">
               <div className="w-2/3 h-6 bg-white/10" />
               <div className="w-1/3 h-1.5 bg-sky-400/40" />
            </div>
            <div className="flex flex-1">
               <div className="w-[30%] bg-slate-100 p-3 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-800" />
                  <div className="w-full h-12 bg-white rounded-sm" />
                  <div className="w-full space-y-1.5">
                     <div className="w-full h-1 bg-sky-600/30" />
                     <div className="w-full h-0.5 bg-slate-300" /><div className="w-full h-0.5 bg-slate-300" />
                  </div>
               </div>
               <div className="flex-1 p-4 space-y-4">
                  <div className="w-full h-1 bg-slate-800 mb-2" />
                  <div className="w-full h-16 bg-slate-50 border-l-2 border-slate-300" />
                  <div className="w-full h-16 bg-slate-50 border-l-2 border-slate-300" />
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
            <span className="material-symbols-outlined text-base">style</span>
          </div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">Placement <span className="text-primary">Templates</span></h3>
        </div>
        <div className="flex gap-1.5">
           <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[8px] font-black text-emerald-600 uppercase">1:1 Accuracy</div>
           <div className="px-2 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[8px] font-black text-primary uppercase tracking-tighter">ATS 90+</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <motion.button
            key={tpl.id}
            whileHover={{ y: -3, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(tpl.id)}
            className={`flex flex-col rounded-2xl border-2 transition-all text-left relative group overflow-hidden ${
              selectedTemplateId === tpl.id 
                ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/20' 
                : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
            }`}
          >
            <div className={`aspect-[4/5] w-full overflow-hidden border-b ${
              selectedTemplateId === tpl.id ? 'border-primary/20' : 'border-slate-100'
            }`}>
               {renderThumbnail(tpl.id)}
               <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-tight ${
                  selectedTemplateId === tpl.id ? 'text-primary' : 'text-slate-900'
                }`}>
                  {tpl.name}
                </span>
                {tpl.category === 'Placement Ready' && (
                  <span className="text-[7px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full border border-green-100 uppercase">Recommended</span>
                )}
              </div>
              <p className="text-[9px] text-slate-400 font-medium leading-tight line-clamp-2">{tpl.description}</p>
            </div>

            {selectedTemplateId === tpl.id && (
              <div className="absolute top-2 right-2 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                <span className="material-symbols-outlined text-[12px] font-bold">check</span>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
