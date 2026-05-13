import React from 'react';
import { getTemplateById } from '../utils/templateData';

export default function ResumePreview({ formData, selectedTemplateId }) {
  const template = getTemplateById(selectedTemplateId);

  if (!template) {
    return (
      <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-white p-12 text-center">
        <div>
          <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">description</span>
          <p className="text-slate-400 font-medium tracking-tight">Select a template to see your live preview</p>
        </div>
      </div>
    );
  }

  // Simple string replacement for the demo. In a real app, we'd use a more robust template engine or React components.
  const renderTemplate = () => {
    let html = template.html;
    const replacements = {
      name: formData.name || 'Your Name',
      role: formData.role || 'Internship Role',
      domain: formData.domain || 'Domain',
      email: formData.email || 'email@example.com',
      phone: formData.phone || '+91 0000000000',
      skills: Array.isArray(formData.skills) && formData.skills.length > 0 ? formData.skills.join(', ') : 'Add your skills',
      projects: Array.isArray(formData.projects) && formData.projects.length > 0 ? formData.projects.join(', ') : 'Add your projects',
      education: Array.isArray(formData.education) && formData.education.length > 0 ? formData.education.join(', ') : 'Add your education',
      certifications: Array.isArray(formData.certifications) && formData.certifications.length > 0 ? formData.certifications.join(', ') : 'Add your certifications',
      linkedin: formData.linkedin || '#',
      github: formData.github || '#'
    };

    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      html = html.replace(regex, replacements[key]);
    });

    return html;
  };

  return (
    <div className="relative group">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10">
        Live Preview
      </div>
      <div 
        id="resume-preview-content"
        className="bg-white shadow-2xl rounded-sm overflow-hidden transform transition-transform duration-500 hover:scale-[1.01] origin-top"
        dangerouslySetInnerHTML={{ __html: renderTemplate() }}
      />
    </div>
  );
}
