import React from 'react';
import { getTemplateById } from '../utils/templateData';

export default function ResumePreview({ formData, selectedTemplateId }) {
  const template = getTemplateById(selectedTemplateId);

  const formatLinkedIn = (username) => {
    if (!username) return '';
    if (username.startsWith('http')) return username;
    return `linkedin.com/in/${username}`;
  };

  const formatGitHub = (username) => {
    if (!username) return '';
    if (username.startsWith('http')) return username;
    return `github.com/${username}`;
  };

  const renderTemplate = () => {
    if (!template) return '<p>Please select a template</p>';
    let html = template.html;

    // Remove "Intern" duplication in role if domain already contains it
    let role = formData.role || formData.domain || 'Intern';
    if (role.toLowerCase().includes('intern') && (formData.domain || '').toLowerCase().includes('intern')) {
       // Just use the domain if it already has "Intern"
       role = formData.domain;
    }

    const replacements = {
      name: formData.name || 'YOUR NAME',
      role: role,
      summary: formData.summary || 'Add a professional summary to highlight your strengths.',
      email: formData.email || 'email@example.com',
      phone: formData.phone || '',
      linkedin: formatLinkedIn(formData.linkedin),
      github: formatGitHub(formData.github),
      skills: Array.isArray(formData.skills) && formData.skills.length > 0 ? formData.skills.join(', ') : '',
      certifications: Array.isArray(formData.certifications) && formData.certifications.length > 0 ? formData.certifications.join(', ') : '',
    };

    // Special list formatting for Projects
    const projectsList = (formData.projects || []).map(p => `
      <div style="margin-bottom: 8px;">
        <p style="font-weight: 700; margin-bottom: 2px;">• ${p.split(':')[0]}</p>
        ${p.includes(':') ? `<p style="font-size: 0.95em; color: #475569;">${p.split(':').slice(1).join(':')}</p>` : ''}
      </div>
    `).join('');
    replacements.projects_list = projectsList || '<p>Add your key projects...</p>';

    // Special list formatting for Education
    const educationList = (formData.education || []).map(e => `
      <div style="margin-bottom: 8px;">
        <p style="font-weight: 700; margin-bottom: 2px;">• ${e}</p>
      </div>
    `).join('');
    replacements.education_list = educationList || '<p>Add your education...</p>';

    // Special formatting for Skills Chips (used in Modern template)
    const skillsChips = (formData.skills || []).map(s => `
      <span style="display: inline-block; background: #e2e8f0; color: #1e293b; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-right: 4px; margin-bottom: 4px;">${s}</span>
    `).join('');
    replacements.skills_chips = skillsChips;

    // Apply replacements
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      html = html.replace(regex, replacements[key] || '');
    });

    // Final cleanup: Remove empty fields (e.g. "| |" or "Email: |")
    // This is template dependent, but we can do a general cleanup
    html = html.replace(/\|\s*\|/g, '|'); // Double pipes
    html = html.replace(/\|\s*<\/div>/g, '</div>'); // Trailing pipe
    
    return html;
  };

  return (
    <div className="relative group w-full flex justify-center">
      <style dangerouslySetInnerHTML={{ __html: `
        #resume-preview-content * {
          box-sizing: border-box;
        }
        @media print {
          body * { visibility: hidden; }
          #resume-preview-content, #resume-preview-content * { visibility: visible; }
          #resume-preview-content { position: absolute; left: 0; top: 0; width: 210mm; height: 297mm; }
        }
      `}} />
      <div 
        id="resume-preview-content"
        className="bg-white shadow-2xl rounded-sm overflow-hidden w-full max-w-[210mm] transition-all duration-300 border border-slate-100"
        dangerouslySetInnerHTML={{ __html: renderTemplate() }}
      />
    </div>
  );
}
