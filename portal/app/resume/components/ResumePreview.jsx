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

    const role = formData.role || formData.domain || 'Intern';
    const replacements = {
      name: formData.name || 'YOUR NAME',
      role: role,
      summary: formData.summary || 'Aspiring professional with a focus on delivering high-quality results and continuous learning.',
      email: formData.email || 'email@example.com',
      phone: formData.phone || '+91 00000 00000',
      location: 'City, Country',
      linkedin: formatLinkedIn(formData.linkedin) || 'linkedin.com/in/username',
      github: formatGitHub(formData.github) || 'github.com/username',
      current_date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      current_year: new Date().getFullYear(),
      college: 'Codtech Institute of Technology',
      skills: Array.isArray(formData.skills) && formData.skills.length > 0 ? formData.skills.join(', ') : 'Add your skills...',
      certifications: Array.isArray(formData.certifications) && formData.certifications.length > 0 ? formData.certifications.join(', ') : 'Add certifications...',
    };

    // --- ATS PROFESSIONAL FORMATTING ---
    replacements.projects_list_ats = (formData.projects || []).map(p => {
        const [title, ...desc] = p.split(':');
        return `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 2px;">
               <span>${title}</span>
               <span style="font-weight: 500;">Aug 2024 - Present</span>
            </div>
            <p style="margin: 0; font-style: italic; color: #444; font-size: 10px; margin-bottom: 4px;">Developer (@project)</p>
            <ul style="margin: 0; padding-left: 18px; list-style-type: disc;">
               <li style="margin-bottom: 2px;">${desc.join(':').trim() || 'Implemented core features and optimized performance.'}</li>
               <li>Led the development of responsive UI components.</li>
            </ul>
          </div>
        `;
    }).join('') || '<p>Add projects...</p>';

    replacements.education_list_ats = (formData.education || []).map(e => {
        const [inst, deg, year] = e.split(',');
        return `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
             <div>
                <p style="font-weight: 700; margin: 0;">${inst || 'Wellesley College'}</p>
                <p style="margin: 0; font-style: italic;">${deg || 'Bachelor of Arts in Computer Science'}</p>
             </div>
             <div style="text-align: right;">
                <p style="font-weight: 500; margin: 0;">${year || 'May 2024'}</p>
                <p style="margin: 0; color: #666; font-size: 10px;">City, State</p>
             </div>
          </div>
        `;
    }).join('') || '<p>Add education...</p>';

    replacements.skills_languages = (formData.skills || []).slice(0, 4).join(', ');
    replacements.skills_tools = (formData.skills || []).slice(4, 10).join(', ');

    // --- INDIAN FRESHER FORMATTING ---
    replacements.education_table_rows = (formData.education || []).map(e => {
        const [inst, deg, year, cgpa] = e.split(',');
        return `
          <tr>
            <td style="border: 1px solid #000; padding: 6px;">${year || '2024'}</td>
            <td style="border: 1px solid #000; padding: 6px;">${deg || 'Degree'}</td>
            <td style="border: 1px solid #000; padding: 6px;">${inst || 'Institute'}</td>
            <td style="border: 1px solid #000; padding: 6px;">${cgpa || '8.5'}</td>
          </tr>
        `;
    }).join('') || '<tr><td colspan="4" style="border: 1px solid #000; padding: 6px;">No data</td></tr>';

    replacements.projects_list_indian = (formData.projects || []).map(p => {
        const title = p.split(':')[0];
        return `
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold;">
               <span>• ${title}</span>
               <span>Mar 2024 - Apr 2024</span>
            </div>
            <p style="margin: 2px 0 0 15px; font-style: italic;">Course or faculty</p>
            <ul style="margin: 2px 0 0 15px; padding-left: 15px;">
               <li>About the project details and implementation.</li>
            </ul>
          </div>
        `;
    }).join('');

    replacements.skills_grouped_indian = `
       <p>• <b>Languages:</b> ${formData.skills?.slice(0, 3).join(', ') || '...'}</p>
       <p>• <b>Tools & Frameworks:</b> ${formData.skills?.slice(3, 7).join(', ') || '...'}</p>
       <p>• <b>Operating Systems:</b> Windows, Linux & Android</p>
    `;

    // --- CORPORATE PROFESSIONAL (ORANGE) FORMATTING ---
    replacements.skills_grid_corporate = (formData.skills || []).map(s => `
       <div style="padding: 2px 0;">• ${s}</div>
    `).join('');

    replacements.education_grid_corporate = (formData.education || []).map(e => {
        const [inst, deg, year] = e.split(',');
        return `
          <div style="margin-bottom: 10px;">
             <p style="font-weight: 800; margin: 0;">${deg || 'M.Sc. Snack Science'}</p>
             <p style="margin: 2px 0; color: #666;">${inst || 'University of Nowhere'} | ${year || '2024'}</p>
          </div>
        `;
    }).join('');

    replacements.projects_list_corporate = (formData.projects || []).map(p => {
        const title = p.split(':')[0];
        return `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
               <p style="font-weight: 800; margin: 0; font-size: 13px;">${title}</p>
               <p style="margin: 0; color: #666; font-size: 10px;">Jul - Sep 2024 (10 weeks)</p>
            </div>
            <p style="margin: 0 0 5px 0; font-size: 10px; color: #888;">Keywords: ${formData.skills?.slice(0, 5).join(', ')}</p>
            <ul style="margin: 0; padding-left: 15px; color: #444;">
               <li>Increased productivity by 100% through optimized workflows.</li>
               <li>Collaborated with cross-functional teams to deliver results.</li>
            </ul>
          </div>
        `;
    }).join('');

    replacements.languages_list_corporate = `
       <p style="margin-bottom: 5px;"><b>Common:</b> Mother tongue</p>
       <p style="margin-bottom: 5px;"><b>English:</b> Fluent</p>
    `;

    // --- CREATIVE SIDEBAR (LIFE PHILOSOPHY) ---
    replacements.projects_list_creative = (formData.projects || []).map(p => {
        const title = p.split(':')[0];
        return `
          <div style="margin-bottom: 20px;">
            <p style="font-weight: 900; font-size: 13px; margin: 0;">${title}</p>
            <p style="color: #800000; font-weight: 800; font-size: 11px; margin: 2px 0;">Company Name</p>
            <p style="font-size: 9px; color: #999; margin-bottom: 5px;">📅 Month 2024 - Ongoing | 📍 Location</p>
            <ul style="margin: 0; padding-left: 15px; color: #555;">
               <li>Job description item 1 for this project.</li>
               <li>Job description item 2 with specific results.</li>
            </ul>
          </div>
        `;
    }).join('');

    replacements.skills_chips_creative = (formData.skills || []).map(s => `
       <span style="border: 1px solid #ddd; border-radius: 4px; padding: 3px 8px; font-size: 10px; color: #666; font-weight: 600;">${s}</span>
    `).join('');

    replacements.languages_dots_creative = (formData.skills || []).slice(0, 3).map(s => `
       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 700;">${s}</span>
          <div style="display: flex; gap: 4px;">
             <div style="width: 8px; height: 8px; border-radius: 50%; background: #800000;"></div>
             <div style="width: 8px; height: 8px; border-radius: 50%; background: #800000;"></div>
             <div style="width: 8px; height: 8px; border-radius: 50%; background: #800000;"></div>
             <div style="width: 8px; height: 8px; border-radius: 50%; background: #800000;"></div>
             <div style="width: 8px; height: 8px; border-radius: 50%; background: #ddd;"></div>
          </div>
       </div>
    `).join('');

    // --- ACADEMIC RESEARCH (BLUE) ---
    replacements.education_list_research = (formData.education || []).map(e => {
        const [inst, deg, year, cgpa] = e.split(',');
        return `
          <div style="margin-bottom: 15px;">
             <div style="display: flex; justify-content: space-between; font-weight: bold; color: #1a237e; font-size: 12px;">
                <span>${year || '2024'} : ${deg || 'MSc in Robotics'}</span>
                <span>GPA: ${cgpa || '3.9'}</span>
             </div>
             <p style="margin: 2px 0; font-weight: 600;">${inst || 'University Name'}</p>
             <p style="margin: 2px 0; color: #666;">Relevant Coursework: ${formData.skills?.slice(0, 5).join(', ')}</p>
          </div>
        `;
    }).join('');

    replacements.projects_list_research = (formData.projects || []).map(p => {
        const title = p.split(':')[0];
        return `
          <div style="margin-bottom: 15px;">
             <div style="display: flex; justify-content: space-between; font-weight: bold; color: #1a237e;">
                <span>${title}</span>
                <span>May 2024 - Present</span>
             </div>
             <p style="margin: 2px 0; color: #666;">University Robotics Lab</p>
             <ul style="margin: 5px 0 0 0; padding-left: 18px;">
                <li>Implemented advanced algorithms for autonomous navigation.</li>
                <li>Collaborated on a high-impact research paper.</li>
             </ul>
          </div>
        `;
    }).join('');

    // --- EXECUTIVE PREMIUM (JACK SPARROW) ---
    replacements.skills_sidebar_premium = (formData.skills || []).map(s => `
       <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 9px; margin-bottom: 3px;">
             <span>${s}</span>
             <span style="color: #0284c7;">●●●●○</span>
          </div>
       </div>
    `).join('');

    replacements.projects_list_premium = (formData.projects || []).map(p => {
        const title = p.split(':')[0];
        return `
          <div style="margin-bottom: 20px; border-left: 2px solid #ddd; padding-left: 15px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; color: #333;">
               <span>${title}</span>
               <span style="color: #999;">2024 - Present</span>
            </div>
            <p style="margin: 2px 0; color: #0284c7; text-transform: uppercase; font-size: 9px; font-weight: bold;">Lead Developer</p>
            <p style="margin: 5px 0; color: #666; font-size: 10px;">Managed end-to-end delivery of complex technical solutions with focus on scalability.</p>
          </div>
        `;
    }).join('');

    replacements.education_list_premium = (formData.education || []).map(e => {
        const [inst, deg, year] = e.split(',');
        return `
          <div style="margin-bottom: 12px;">
             <p style="font-weight: bold; margin: 0;">${deg || 'Captain'}</p>
             <p style="color: #666; margin: 0; font-size: 9px;">${inst || 'Tortuga Uni'} | ${year || '1710'}</p>
          </div>
        `;
    }).join('');

    replacements.skills_bars_premium = (formData.skills || []).slice(0, 5).map(s => `
       <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 9px; margin-bottom: 3px;">
             <span>${s}</span>
          </div>
          <div style="width: 100%; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
             <div style="width: ${Math.floor(Math.random() * 40 + 60)}%; height: 100%; background: #0284c7;"></div>
          </div>
       </div>
    `).join('');

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
