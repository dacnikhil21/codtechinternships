import React from 'react';
import { motion } from 'framer-motion';

export default function PreparationGuide({ courseTitle, prepContent, onView }) {
  if (!prepContent || prepContent.length === 0) {
    return (
      <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 mx-auto">
          <span className="material-symbols-outlined text-4xl text-primary">hourglass_empty</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Preparation Guide Coming Soon</h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm font-medium">
          We are currently updating the specialized preparation materials for the <span className="font-bold text-primary">{courseTitle}</span> track. Please check back later.
        </p>
      </div>
    );
  }

  // Group prep content by category
  const categories = {};
  prepContent.forEach(item => {
    if (!categories[item.category]) categories[item.category] = [];
    categories[item.category].push(item);
  });

  const getIcon = (cat) => {
    const c = cat.toLowerCase();
    if (c.includes('interview')) return 'quiz';
    if (c.includes('challenge')) return 'code';
    if (c.includes('roadmap')) return 'map';
    return 'library_books';
  };

  return (
    <div className="col-span-full space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Header */}
      <div className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1 uppercase tracking-tight">{courseTitle} Prep Guide</h2>
          <p className="text-white/80 text-[13px] font-medium">Master your domain, ace technical rounds, and build your professional path.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(([category, items]) => (
          <section key={category} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center border border-primary/10">
                <span className="material-symbols-outlined text-xl">{getIcon(category)}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">{category}</h3>
            </div>

            <div className="space-y-4 flex-1">
              {items.map((item, idx) => (
                <div key={idx} className="group p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary/20 hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-lg hover:shadow-indigo-100/40">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 text-[13px] tracking-tight group-hover:text-primary transition-colors">{item.title}</h4>
                    <span className="text-[9px] font-black uppercase text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">{item.level || 'Beginner'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed mb-4">{item.description}</p>
                  <button 
                    onClick={() => onView(item)}
                    className="w-full bg-white text-primary border border-primary/10 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    View Material
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
        
        {/* Support Card */}
        <section className="bg-primary/5 rounded-[2.5rem] p-8 border border-dashed border-primary/20 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined">help</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mb-2">Need Help?</h3>
          <p className="text-[11px] text-slate-500 font-medium mb-6">Our mentors are available to guide you through your preparation.</p>
          <button className="text-primary font-bold text-[11px] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
            Join Community <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </section>
      </div>
    </div>
  );
}
