import React from 'react';

export const templates = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    description: 'Recruiter-recommended. Simple, black & white, and perfectly readable by ATS.',
    category: 'General',
    html: `<div style="font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.3; background: white; max-width: 210mm; min-height: 297mm; margin: auto;">
      <header style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">{name}</h1>
        <div style="font-size: 11px;">
          {email} | {phone} | {linkedin} | {github}
        </div>
      </header>

      <section style="margin-bottom: 15px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Professional Summary</h2>
        <p style="font-size: 11px;">{summary}</p>
      </section>

      <section style="margin-bottom: 15px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Skills</h2>
        <p style="font-size: 11px;">{skills}</p>
      </section>

      <section style="margin-bottom: 15px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Projects</h2>
        <div style="font-size: 11px;">{projects_list}</div>
      </section>

      <section style="margin-bottom: 15px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Education</h2>
        <div style="font-size: 11px;">{education_list}</div>
      </section>

      <section>
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Certifications</h2>
        <p style="font-size: 11px;">{certifications}</p>
      </section>
    </div>`
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Clean dual-column layout. Ideal for developers and tech interns.',
    category: 'Tech',
    html: `<div style="font-family: 'Inter', sans-serif; display: grid; grid-template-columns: 2fr 1fr; gap: 0; background: white; max-width: 210mm; min-height: 297mm; margin: auto; border: 1px solid #eee;">
      <div style="padding: 40px; border-right: 1px solid #f1f5f9;">
        <header style="margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 5px;">{name}</h1>
          <p style="font-size: 16px; font-weight: 600; color: #4f46e5;">{role}</p>
        </header>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Summary</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #334155;">{summary}</p>
        </section>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Experience & Projects</h2>
          <div style="font-size: 13px; line-height: 1.6; color: #334155;">{projects_list}</div>
        </section>

        <section>
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Education</h2>
          <div style="font-size: 13px; color: #334155;">{education_list}</div>
        </section>
      </div>

      <div style="padding: 40px; background: #f8fafc;">
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Contact</h2>
          <div style="font-size: 12px; color: #334155; space-y: 10px;">
            <p style="margin-bottom: 8px;"><b>Email:</b><br/>{email}</p>
            <p style="margin-bottom: 8px;"><b>Phone:</b><br/>{phone}</p>
            <p style="margin-bottom: 8px;"><b>LinkedIn:</b><br/>{linkedin}</p>
            <p style="margin-bottom: 8px;"><b>GitHub:</b><br/>{github}</p>
          </div>
        </section>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Skills</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 5px;">
            {skills_chips}
          </div>
        </section>

        <section>
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Certificates</h2>
          <p style="font-size: 12px; color: #334155;">{certifications}</p>
        </section>
      </div>
    </div>`
  },
  {
    id: 'creative-canvas',
    name: 'Creative Canvas',
    description: 'Elegant and expressive. Best for UI/UX, Design, and Marketing roles.',
    category: 'Creative',
    html: `<div style="font-family: 'Inter', sans-serif; padding: 50px; color: #1e293b; background: white; max-width: 210mm; min-height: 297mm; margin: auto; border-top: 12px solid #4f46e5;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px;">
        <div>
          <h1 style="font-size: 48px; font-weight: 900; color: #0f172a; line-height: 1; margin-bottom: 10px;">{name}</h1>
          <p style="font-size: 20px; color: #4f46e5; font-weight: 600;">{role}</p>
        </div>
        <div style="text-align: right; font-size: 13px; color: #64748b;">
          <p>{email}</p>
          <p>{phone}</p>
          <p>{linkedin}</p>
        </div>
      </div>

      <div style="margin-bottom: 40px;">
        <p style="font-size: 16px; line-height: 1.6; color: #334155; font-weight: 500;">{summary}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Case Studies & Projects</h3>
          <div style="font-size: 14px; color: #334155;">{projects_list}</div>
        </div>
        <div>
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Expertise</h3>
          <div style="font-size: 14px; color: #334155; margin-bottom: 30px;">{skills}</div>
          
          <h3 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Background</h3>
          <div style="font-size: 14px; color: #334155;">{education_list}</div>
        </div>
      </div>
    </div>`
  }
];

export const getTemplateById = (id) => templates.find((t) => t.id === id) || templates[0];
