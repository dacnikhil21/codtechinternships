import React from 'react';

export const templates = [
  {
    id: 1,
    name: 'Modern Minimal',
    skillTags: ['React', 'JavaScript', 'CSS', 'HTML', 'Tailwind', 'Next.js'],
    html: `<div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; background: white;">
      <header style="margin-bottom: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
        <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 4px; color: #0f172a; text-transform: uppercase; letter-spacing: -0.025em;">{name}</h1>
        <p style="font-size: 16px; font-weight: 600; color: #4f46e5; margin-bottom: 12px;">{role} – {domain}</p>
        <div style="font-size: 12px; color: #64748b; display: flex; gap: 15px; flex-wrap: wrap;">
          <span>{email}</span>
          <span>{phone}</span>
          <a href="{linkedin}" style="color: #4f46e5; text-decoration: none;">LinkedIn</a>
          <a href="{github}" style="color: #4f46e5; text-decoration: none;">GitHub</a>
        </div>
      </header>
      
      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-left: 4px solid #4f46e5; padding-left: 10px;">Technical Skills</h2>
        <p style="font-size: 13px; color: #334155;">{skills}</p>
      </section>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-left: 4px solid #4f46e5; padding-left: 10px;">Projects</h2>
        <p style="font-size: 13px; color: #334155;">{projects}</p>
      </section>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-left: 4px solid #4f46e5; padding-left: 10px;">Education</h2>
        <p style="font-size: 13px; color: #334155;">{education}</p>
      </section>

      <section>
        <h2 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; border-left: 4px solid #4f46e5; padding-left: 10px;">Certifications</h2>
        <p style="font-size: 13px; color: #334155;">{certifications}</p>
      </section>
    </div>`
  },
  {
    id: 2,
    name: 'Executive Slate',
    skillTags: ['Python', 'SQL', 'Data Analysis', 'Tableau', 'Excel', 'Pandas'],
    html: `<div style="font-family: 'Inter', sans-serif; padding: 40px; color: #334155; line-height: 1.6; background: #f8fafc;">
      <div style="background: #1e293b; margin: -40px -40px 30px -40px; padding: 40px; color: white;">
        <h1 style="font-size: 36px; font-weight: 700; margin-bottom: 8px;">{name}</h1>
        <p style="font-size: 18px; opacity: 0.9;">{role}</p>
        <div style="margin-top: 15px; font-size: 13px; opacity: 0.8;">
          {email} | {phone} | {domain}
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 40px;">
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Skills</h3>
          <p style="font-size: 13px;">{skills}</p>
          
          <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Education</h3>
          <p style="font-size: 13px;">{education}</p>
        </div>
        <div>
          <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Projects</h3>
          <p style="font-size: 13px;">{projects}</p>
          
          <h3 style="font-size: 16px; font-weight: 700; color: #1e293b; margin-top: 25px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Certifications</h3>
          <p style="font-size: 13px;">{certifications}</p>
        </div>
      </div>
    </div>`
  },
  {
    id: 3,
    name: 'Creative Indigo',
    skillTags: ['UI/UX', 'Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    html: `<div style="font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; background: white; border-top: 10px solid #4f46e5;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 42px; font-weight: 900; color: #4f46e5; margin-bottom: 10px;">{name}</h1>
        <p style="font-size: 20px; font-weight: 500; color: #64748b;">{role} – {domain}</p>
        <div style="margin-top: 15px; font-size: 14px; color: #94a3b8;">
          {email} • {phone} • <a href="{linkedin}" style="color: #4f46e5;">LinkedIn</a>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 15px; display: flex; items-center; gap: 10px;">
          <span style="background: #4f46e5; color: white; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; rounded: 4px; font-size: 12px;">S</span>
          Core Competencies
        </h2>
        <div style="background: #f5f3ff; padding: 20px; border-radius: 12px; font-size: 14px; color: #4c1d95;">
          {skills}
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 15px; display: flex; items-center; gap: 10px;">
          <span style="background: #4f46e5; color: white; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; rounded: 4px; font-size: 12px;">P</span>
          Key Projects
        </h2>
        <p style="font-size: 14px; color: #334155; padding-left: 34px;">{projects}</p>
      </div>
    </div>`
  },
  {
    id: 4,
    name: 'Classic Professional',
    skillTags: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker', 'Kubernetes'],
    html: `<div style="font-family: 'Inter', sans-serif; padding: 50px; color: #2d3748; line-height: 1.4; background: white;">
      <div style="text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: 700; color: #1a202c; margin-bottom: 5px;">{name}</h1>
        <div style="font-size: 13px; color: #4a5568;">
          {email} | {phone} | {linkedin}
        </div>
      </div>

      <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; text-transform: uppercase; border-bottom: 1px solid #cbd5e0; margin-bottom: 10px; padding-bottom: 2px;">Professional Summary</h3>
      <p style="font-size: 13px; margin-bottom: 20px;">Dedicated {role} with a focus on {domain}. Committed to delivering high-quality solutions and continuous learning.</p>

      <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; text-transform: uppercase; border-bottom: 1px solid #cbd5e0; margin-bottom: 10px; padding-bottom: 2px;">Technical Skills</h3>
      <p style="font-size: 13px; margin-bottom: 20px;">{skills}</p>

      <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; text-transform: uppercase; border-bottom: 1px solid #cbd5e0; margin-bottom: 10px; padding-bottom: 2px;">Projects</h3>
      <p style="font-size: 13px; margin-bottom: 20px;">{projects}</p>

      <h3 style="font-size: 14px; font-weight: 700; color: #2d3748; text-transform: uppercase; border-bottom: 1px solid #cbd5e0; margin-bottom: 10px; padding-bottom: 2px;">Education</h3>
      <p style="font-size: 13px;">{education}</p>
    </div>`
  }
];

export const getTemplateById = (id) => templates.find((t) => t.id === id);
