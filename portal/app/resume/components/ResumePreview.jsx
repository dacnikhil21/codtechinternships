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

    let role = formData.role || formData.domain || 'Intern';
    if (role.toLowerCase().includes('intern') && (formData.domain || '').toLowerCase().includes('intern')) {
       role = formData.domain;
    }

    const replacements = {
      name: formData.name || 'YOUR NAME',
      role: role,
      summary: formData.summary || 'Aspiring professional with a focus on delivering high-quality results and continuous learning.',
      email: formData.email || 'email@example.com',
      phone: formData.phone || '+91 00000 00000',
      linkedin: formatLinkedIn(formData.linkedin),
      github: formatGitHub(formData.github),
      skills: Array.isArray(formData.skills) && formData.skills.length > 0 ? formData.skills.join(', ') : 'Add your skills...',
      certifications: Array.isArray(formData.certifications) && formData.certifications.length > 0 ? formData.certifications.join(', ') : 'Add certifications...',
    };

    // Special formatting for Projects
    const projectsList = (formData.projects || []).map(p => `
      <div style="margin-bottom: 12px;">
        <p style="font-weight: 700; color: #1e293b; margin: 0 0 4px 0;">${p.split(':')[0]}</p>
        ${p.includes(':') ? `<p style="margin: 0; color: #475569; font-size: 0.95em;">${p.split(':').slice(1).join(':')}</p>` : ''}
      </div>
    `).join('');
    replacements.projects_list = projectsList || '<p>Add your key projects...</p>';

    // Special formatting for Education
    const educationList = (formData.education || []).map(e => `
      <div style="margin-bottom: 10px;">
        <p style="font-weight: 700; color: #1e293b; margin: 0 0 2px 0;">${e.split(',')[0]}</p>
        <p style="margin: 0; color: #64748b; font-size: 0.9em;">${e.split(',').slice(1).join(', ')}</p>
      </div>
    `).join('');
    replacements.education_list = educationList || '<p>Add your education...</p>';

    // Tag for Indian Fresher Education Table
    const educationTableRows = (formData.education || []).map(e => {
        const parts = e.split(',');
        return `
          <tr>
            <td style="border: 1px solid #000; padding: 6px;">${parts[2] || 'Year'}</td>
            <td style="border: 1px solid #000; padding: 6px;">${parts[1] || 'Degree'}</td>
            <td style="border: 1px solid #000; padding: 6px;">${parts[0] || 'Institute'}</td>
            <td style="border: 1px solid #000; padding: 6px;">${parts[3] || 'CGPA'}</td>
          </tr>
        `;
    }).join('') || '<tr><td colspan="4" style="border: 1px solid #000; padding: 6px; text-align: center;">No education added</td></tr>';
    replacements.education_table_rows = educationTableRows;

    // Tag for Grouped Skills (Indian Fresher)
    replacements.skills_grouped = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div><b>Languages:</b> ${formData.skills?.slice(0, 3).join(', ') || '...'}</div>
        <div><b>Tools:</b> ${formData.skills?.slice(3, 6).join(', ') || '...'}</div>
      </div>
    `;

    // Tag for Column Skills (Corporate)
    const skillsChunks = [];
    const chunkSize = 3;
    const skillsArray = formData.skills || [];
    for (let i = 0; i < skillsArray.length; i += chunkSize) {
        skillsChunks.push(skillsArray.slice(i, i + chunkSize));
    }
    replacements.skills_cols = skillsChunks.map(chunk => `
      <div style="margin-bottom: 5px;">• ${chunk.join('<br/>• ')}</div>
    `).join('');

    // Tag for Sidebar Skills (Creative)
    replacements.skills_sidebar = (formData.skills || []).map(s => `
      <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
           <span>${s}</span>
           <span style="font-weight: bold; color: #6366f1;">80%</span>
        </div>
        <div style="width: 100%; height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden;">
           <div style="width: 80%; height: 100%; background: #6366f1;"></div>
        </div>
      </div>
    `).join('');

    // Tag for Skills Chips (Premium)
    replacements.skills_chips = (formData.skills || []).map(s => `
      <span style="display: inline-block; background: #f1f5f9; color: #0f172a; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; margin: 0 4px 4px 0; border: 1px solid #e2e8f0;">${s}</span>
    `).join('');

    // Apply replacements
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      html = html.replace(regex, replacements[key] || '');
    });

    return html;
  };

  return (
    <div className="relative group w-full flex justify-center">
      <style dangerouslySetInnerHTML={{ __html: `
        #resume-preview-content * {
          box-sizing: border-box;
        }
        @media print {
          @page { margin: 0; size: A4; }
          body * { visibility: hidden; }
          #resume-preview-content, #resume-preview-content * { visibility: visible; }
          #resume-preview-content { position: absolute; left: 0; top: 0; width: 210mm; height: 297mm; border: none !important; box-shadow: none !important; }
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
