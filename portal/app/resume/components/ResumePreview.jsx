import React from 'react';
import { getTemplateById } from '../utils/templateData';

export default function ResumePreview({ formData, selectedTemplateId }) {
  const template = getTemplateById(selectedTemplateId);

  const formatLinkedIn = (username) => {
    if (!username) return 'linkedin.com/in/username';
    if (username.startsWith('http')) return username;
    return `linkedin.com/in/${username}`;
  };

  const formatGitHub = (username) => {
    if (!username) return 'github.com/username';
    if (username.startsWith('http')) return username;
    return `github.com/${username}`;
  };

  const renderTemplate = () => {
    if (!template) return '<p>Please select a template</p>';
    let html = template.html;

    const role = formData.role || formData.domain || 'Intern';
    const nameParts = (formData.name || 'YOUR NAME').split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const replacements = {
      name: formData.name || 'YOUR NAME',
      name_first: firstName,
      name_last: lastName,
      role: role,
      summary: formData.summary || 'Add your professional summary here.',
      email: formData.email || 'email@example.com',
      phone: formData.phone || '+91 00000 00000',
      college: 'Institute',
      linkedin_url: formatLinkedIn(formData.linkedin),
      github_url: formatGitHub(formData.github),
      current_date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      current_year: new Date().getFullYear(),
    };

    // --- Jake's Resume Formatting ---
    replacements.education_jake = (formData.education?.length > 0) ? formData.education.map(e => {
      const parts = e.split(',');
      const inst = parts[0]?.trim() || 'Institution Name';
      const deg = parts[1]?.trim() || 'Degree / Standard';
      const year = parts[2]?.trim() || 'Year';
      return `
        <div style="display: flex; justify-content: space-between; margin-bottom: 2pt;">
          <span style="font-weight: bold;">${inst}</span>
          <span>${year}</span>
        </div>
        <div style="font-style: italic; font-size: 10pt; margin-bottom: 5pt;">${deg}</div>
      `;
    }).join('') : '<p style="color:#999; font-style:italic;">Add your education details...</p>';

    replacements.experience_jake = (formData.projects?.length > 0) ? formData.projects.map(p => {
      const parts = p.split(':');
      const title = parts[0]?.trim() || 'Project/Experience Title';
      const desc = parts.slice(1).join(':').trim();
      return `
        <div style="display: flex; justify-content: space-between; margin-bottom: 1pt;">
          <span style="font-weight: bold;">${title}</span>
        </div>
        ${desc ? `
        <ul style="margin: 4pt 0 8pt 0; padding-left: 15pt; font-size: 10pt; list-style-type: disc;">
          <li>${desc}</li>
        </ul>
        ` : '<div style="margin-bottom:8pt;"></div>'}
      `;
    }).join('') : '<p style="color:#999; font-style:italic;">Add your internship/project experience...</p>';

    replacements.projects_jake = replacements.experience_jake; // Reuse for projects

    replacements.skills_jake = formData.skills?.length > 0 ? `
      <p><b>Technical Skills:</b> ${formData.skills.join(', ')}</p>
    ` : '<p style="color:#999; font-style:italic;">Add your technical skills...</p>';

    // --- Indian IIT Table Formatting ---
    replacements.education_table_rows = (formData.education?.length > 0) ? formData.education.map(e => {
        const parts = e.split(',');
        const inst = parts[0]?.trim() || 'Institute';
        const deg = parts[1]?.trim() || 'Degree';
        const year = parts[2]?.trim() || 'Year';
        const cgpa = parts[3]?.trim() || '-';
        return `
          <tr>
            <td style="border: 1px solid #000; padding: 4pt;">${year}</td>
            <td style="border: 1px solid #000; padding: 4pt;">${deg}</td>
            <td style="border: 1px solid #000; padding: 4pt;">${inst}</td>
            <td style="border: 1px solid #000; padding: 4pt;">${cgpa}</td>
          </tr>
        `;
    }).join('') : '<tr><td colspan="4" style="border: 1px solid #000; padding: 4pt; text-align:center; color:#999; font-style:italic;">Add your education details...</td></tr>';

    replacements.experience_indian = replacements.experience_jake;
    replacements.projects_indian = replacements.experience_jake;
    replacements.skills_indian = replacements.skills_jake;

    // --- Corporate Orange Formatting ---
    replacements.skills_corporate = formData.skills?.length > 0 ? formData.skills.map(s => `<div style="padding: 2pt 0;">• ${s}</div>`).join('') : '<div style="color:#999; font-style:italic;">Add skills...</div>';
    replacements.education_corporate = formData.education?.length > 0 ? formData.education.map(e => {
        const parts = e.split(',');
        const inst = parts[0]?.trim() || 'Institute';
        const deg = parts[1]?.trim() || 'Degree';
        const year = parts[2]?.trim() || 'Year';
        return `<div style="margin-bottom: 8pt;"><p style="font-weight: 800; margin: 0;">${deg}</p><p style="margin: 2pt 0; color: #666;">${inst} | ${year}</p></div>`;
    }).join('') : '<div style="color:#999; font-style:italic;">Add education...</div>';
    replacements.experience_corporate = replacements.experience_jake;
    replacements.certifications_corporate = formData.certifications?.length > 0 ? formData.certifications.map(c => `• ${c}`).join('<br/>') : '<span style="color:#999; font-style:italic;">Add certifications...</span>';

    // --- AltaCV Formatting ---
    replacements.experience_alta = replacements.experience_jake;
    replacements.projects_alta = replacements.experience_jake;
    replacements.skills_alta = formData.skills?.length > 0 ? formData.skills.map(s => `<span style="background: #e0f2f1; color: #004d40; padding: 3pt 8pt; border-radius: 4pt; font-weight: 700; font-size: 9pt; display:inline-block; margin-right:4pt; margin-bottom:4pt;">${s}</span>`).join('') : '<span style="color:#999; font-style:italic;">Add skills...</span>';
    replacements.education_alta = replacements.education_corporate;

    // --- Deedy Academic Formatting ---
    replacements.education_deedy = formData.education?.length > 0 ? formData.education.map(e => {
        const parts = e.split(',');
        const inst = parts[0]?.trim() || 'Institute';
        const deg = parts[1]?.trim() || 'Degree';
        const year = parts[2]?.trim() || 'Year';
        return `<div style="margin-bottom: 10pt;"><p style="font-weight: bold; color: #333; margin: 0; font-size: 11pt;">${inst}</p><p style="margin: 2pt 0; font-weight: 600; color: #0284c7;">${deg}</p><p style="margin: 0; color: #666; font-size: 9pt;">${year}</p></div>`;
    }).join('') : '<div style="color:#999; font-style:italic;">Add education...</div>';
    replacements.skills_deedy = formData.skills?.length > 0 ? `<b>Technical Skills:</b> ${formData.skills.join(', ')}` : '<span style="color:#999; font-style:italic;">Add skills...</span>';
    replacements.experience_deedy = replacements.experience_jake;
    replacements.projects_deedy = replacements.experience_jake;

    // --- Awesome Executive Formatting ---
    replacements.experience_awesome = replacements.experience_jake;
    replacements.education_awesome = replacements.education_corporate;
    replacements.skills_awesome = replacements.skills_jake;

    // Apply all replacements
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      html = html.replace(regex, replacements[key] || '');
    });

    return html;
  };

  return (
    <div className="relative group w-full flex justify-center">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,900&family=Roboto:wght@300;400;500;700;900&family=Open+Sans:wght@300;400;600;700&display=swap');
        
        #resume-preview-content * {
          box-sizing: border-box;
          -webkit-print-color-adjust: exact;
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
