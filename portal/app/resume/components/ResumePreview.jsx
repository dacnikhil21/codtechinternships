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
      summary: formData.summary || 'Detail-oriented professional with strong problem-solving skills and a focus on delivering high-impact solutions. Committed to continuous learning and excellence in development.',
      email: formData.email || 'email@example.com',
      phone: formData.phone || '+91 00000 00000',
      college: 'CodTech University',
      linkedin_url: formatLinkedIn(formData.linkedin),
      github_url: formatGitHub(formData.github),
      current_date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      current_year: new Date().getFullYear(),
    };

    // --- Jake's Resume Formatting ---
    replacements.education_jake = (formData.education || []).map(e => {
      const [inst, deg, year] = e.split(',');
      return `
        <div style="display: flex; justify-content: space-between; margin-bottom: 2pt;">
          <span style="font-weight: bold;">${inst || 'University Name'}</span>
          <span>${year || 'May 2024'}</span>
        </div>
        <div style="font-style: italic; font-size: 10pt; margin-bottom: 5pt;">${deg || 'Bachelor of Technology'}</div>
      `;
    }).join('') || '<p>Add education...</p>';

    replacements.experience_jake = (formData.projects || []).map(p => {
      const [title, ...desc] = p.split(':');
      return `
        <div style="display: flex; justify-content: space-between; margin-bottom: 1pt;">
          <span style="font-weight: bold;">${title}</span>
          <span>Jan 2024 -- Present</span>
        </div>
        <div style="font-style: italic; font-size: 10pt; margin-bottom: 3pt;">CodTech Intern</div>
        <ul style="margin: 0 0 8pt 0; padding-left: 15pt; font-size: 10pt; list-style-type: disc;">
          <li>${desc.join(':').trim() || 'Implemented core features and optimized performance for high-scale applications.'}</li>
          <li>Collaborated with cross-functional teams to deliver production-ready code.</li>
        </ul>
      `;
    }).join('');

    replacements.projects_jake = replacements.experience_jake; // Reuse for projects

    replacements.skills_jake = `
      <p><b>Languages:</b> ${formData.skills?.slice(0, 5).join(', ') || 'C++, Java, Python, JavaScript, SQL'}</p>
      <p><b>Frameworks:</b> ${formData.skills?.slice(5, 10).join(', ') || 'React, Node.js, Express, MongoDB'}</p>
      <p><b>Developer Tools:</b> Git, VS Code, Postman, Docker</p>
    `;

    // --- Indian IIT Table Formatting ---
    replacements.education_table_rows = (formData.education || []).map(e => {
        const [inst, deg, year, cgpa] = e.split(',');
        return `
          <tr>
            <td style="border: 1px solid #000; padding: 4pt;">${year || '2024'}</td>
            <td style="border: 1px solid #000; padding: 4pt;">${deg || 'Degree'}</td>
            <td style="border: 1px solid #000; padding: 4pt;">${inst || 'Institute'}</td>
            <td style="border: 1px solid #000; padding: 4pt;">${cgpa || '8.5'}</td>
          </tr>
        `;
    }).join('') || '<tr><td colspan="4" style="border: 1px solid #000; padding: 4pt;">No data available</td></tr>';

    replacements.experience_indian = replacements.experience_jake;
    replacements.projects_indian = replacements.experience_jake;
    replacements.skills_indian = replacements.skills_jake;

    // --- Corporate Orange Formatting ---
    replacements.skills_corporate = (formData.skills || []).map(s => `<div style="padding: 2pt 0;">• ${s}</div>`).join('');
    replacements.education_corporate = (formData.education || []).map(e => {
        const [inst, deg, year] = e.split(',');
        return `<div style="margin-bottom: 8pt;"><p style="font-weight: 800; margin: 0;">${deg || 'B.Tech'}</p><p style="margin: 2pt 0; color: #666;">${inst || 'CodTech Uni'} | ${year || '2024'}</p></div>`;
    }).join('');
    replacements.experience_corporate = replacements.experience_jake;
    replacements.certifications_corporate = (formData.certifications || []).map(c => `• ${c}`).join('<br/>');

    // --- AltaCV Formatting ---
    replacements.experience_alta = replacements.experience_jake;
    replacements.projects_alta = replacements.experience_jake;
    replacements.skills_alta = (formData.skills || []).map(s => `<span style="background: #e0f2f1; color: #004d40; padding: 3pt 8pt; border-radius: 4pt; font-weight: 700; font-size: 9pt;">${s}</span>`).join('');
    replacements.education_alta = replacements.education_corporate;

    // --- Deedy Academic Formatting ---
    replacements.education_deedy = (formData.education || []).map(e => {
        const [inst, deg, year] = e.split(',');
        return `<div style="margin-bottom: 10pt;"><p style="font-weight: bold; color: #333; margin: 0; font-size: 11pt;">${inst || 'IIT Delhi'}</p><p style="margin: 2pt 0; font-weight: 600; color: #0284c7;">${deg || 'B.Tech CS'}</p><p style="margin: 0; color: #666; font-size: 9pt;">Expected ${year || '2024'}</p></div>`;
    }).join('');
    replacements.skills_deedy = `<b>Languages:</b> ${formData.skills?.join(', ') || '...'}`;
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
