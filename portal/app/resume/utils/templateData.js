import React from 'react';

export const templates = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    description: 'Highly ATS-compatible, black & white, one-page layout. Best for placements.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Times New Roman', serif; padding: 40px; color: #000; line-height: 1.4; background: white; max-width: 210mm; min-height: 297mm; margin: auto;">
      <header style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">{name}</h1>
        <div style="font-size: 11px;">
          {email} | {phone} | {linkedin} | {github}
        </div>
      </header>

      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Professional Summary</h2>
        <p style="font-size: 11px; text-align: justify;">{summary}</p>
      </section>

      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Technical Skills</h2>
        <p style="font-size: 11px;"><b>Core Competencies:</b> {skills}</p>
      </section>

      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Academic Projects</h2>
        <div style="font-size: 11px;">{projects_list}</div>
      </section>

      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Education</h2>
        <div style="font-size: 11px;">{education_list}</div>
      </section>

      <section>
        <h2 style="font-size: 12px; font-weight: bold; border-bottom: 1px solid #000; text-transform: uppercase; margin-bottom: 5px;">Certifications & Achievements</h2>
        <p style="font-size: 11px;">{certifications}</p>
      </section>
    </div>`
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Clean dual-column tech layout. Best for developers and engineering interns.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Inter', sans-serif; display: grid; grid-template-columns: 2.2fr 1fr; gap: 0; background: white; max-width: 210mm; min-height: 297mm; margin: auto; color: #1e293b;">
      <div style="padding: 40px; border-right: 1px solid #f1f5f9;">
        <header style="margin-bottom: 30px;">
          <h1 style="font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 5px;">{name}</h1>
          <p style="font-size: 16px; font-weight: 600; color: #4f46e5;">{role}</p>
        </header>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 12px;">Profile</h2>
          <p style="font-size: 13px; line-height: 1.6; color: #334155;">{summary}</p>
        </section>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 12px;">Key Projects</h2>
          <div style="font-size: 13px; line-height: 1.5; color: #334155;">{projects_list}</div>
        </section>

        <section>
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 12px;">Education</h2>
          <div style="font-size: 13px; color: #334155;">{education_list}</div>
        </section>
      </div>

      <div style="padding: 40px; background: #f8fafc;">
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Contact</h2>
          <div style="font-size: 12px; color: #334155;">
            <p style="margin-bottom: 10px;"><b>Email</b><br/>{email}</p>
            <p style="margin-bottom: 10px;"><b>Phone</b><br/>{phone}</p>
            <p style="margin-bottom: 10px;"><b>LinkedIn</b><br/>{linkedin}</p>
            <p style="margin-bottom: 10px;"><b>GitHub</b><br/>{github}</p>
          </div>
        </section>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Expertise</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            {skills_chips}
          </div>
        </section>

        <section>
          <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">Certifications</h2>
          <p style="font-size: 12px; color: #334155;">{certifications}</p>
        </section>
      </div>
    </div>`
  },
  {
    id: 'corporate-fresher',
    name: 'Corporate Fresher',
    description: 'Professional placement-ready design. Ideal for corporate internship roles.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Inter', sans-serif; padding: 45px; color: #1e293b; background: white; max-width: 210mm; min-height: 297mm; margin: auto; border: 1px solid #e2e8f0;">
      <div style="border-left: 8px solid #1e293b; padding-left: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 34px; font-weight: 900; color: #0f172a; margin-bottom: 4px;">{name}</h1>
        <p style="font-size: 16px; font-weight: 600; color: #64748b;">{role}</p>
        <div style="font-size: 12px; margin-top: 10px; color: #475569;">
          {email} • {phone} • {linkedin}
        </div>
      </div>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #1e293b; margin-bottom: 10px; background: #f1f5f9; padding: 4px 10px;">Objective</h2>
        <p style="font-size: 13px; line-height: 1.5;">{summary}</p>
      </section>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <section>
          <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #1e293b; margin-bottom: 10px; background: #f1f5f9; padding: 4px 10px;">Core Skills</h2>
          <p style="font-size: 13px;">{skills}</p>
        </section>
        <section>
          <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #1e293b; margin-bottom: 10px; background: #f1f5f9; padding: 4px 10px;">Education</h2>
          <div style="font-size: 13px;">{education_list}</div>
        </section>
      </div>

      <section style="margin-top: 25px;">
        <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #1e293b; margin-bottom: 10px; background: #f1f5f9; padding: 4px 10px;">Key Projects & Achievements</h2>
        <div style="font-size: 13px;">{projects_list}</div>
      </section>

      <section style="margin-top: 25px;">
        <h2 style="font-size: 14px; font-weight: 800; text-transform: uppercase; color: #1e293b; margin-bottom: 10px; background: #f1f5f9; padding: 4px 10px;">Certifications</h2>
        <p style="font-size: 13px;">{certifications}</p>
      </section>
    </div>`
  },
  {
    id: 'creative-canvas',
    name: 'Creative Canvas',
    description: 'Visual and expressive. Best for UI/UX, Design, and Marketing interns.',
    category: 'Creative',
    html: `<div style="font-family: 'Inter', sans-serif; padding: 50px; color: #1e293b; background: white; max-width: 210mm; min-height: 297mm; margin: auto; border-top: 15px solid #6366f1;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px;">
        <div>
          <h1 style="font-size: 44px; font-weight: 900; color: #1e293b; line-height: 1;">{name}</h1>
          <p style="font-size: 20px; color: #6366f1; font-weight: 700; margin-top: 5px;">{role}</p>
        </div>
        <div style="text-align: right; font-size: 13px; color: #64748b;">
          <p>{email}</p>
          <p>{phone}</p>
          <p style="color: #6366f1;">{linkedin}</p>
        </div>
      </div>

      <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 40px; font-style: italic;">{summary}</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
        <section>
          <h3 style="font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 15px; border-bottom: 3px solid #6366f1; width: fit-content; padding-bottom: 5px;">Portfolio Projects</h3>
          <div style="font-size: 14px;">{projects_list}</div>
        </section>
        <section>
          <h3 style="font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 15px; border-bottom: 3px solid #6366f1; width: fit-content; padding-bottom: 5px;">Key Skills</h3>
          <p style="font-size: 14px; margin-bottom: 30px;">{skills}</p>
          
          <h3 style="font-size: 18px; font-weight: 900; color: #1e293b; margin-bottom: 15px; border-bottom: 3px solid #6366f1; width: fit-content; padding-bottom: 5px;">Academic Path</h3>
          <div style="font-size: 14px;">{education_list}</div>
        </section>
      </div>
    </div>`
  },
  {
    id: 'minimal-elegant',
    name: 'Minimal Elegant',
    description: 'Clean premium layout with refined typography. Sophisticated and modern.',
    category: 'Modern',
    html: `<div style="font-family: 'Inter', sans-serif; padding: 60px; color: #334155; background: white; max-width: 210mm; min-height: 297mm; margin: auto;">
      <header style="border-bottom: 1px solid #e2e8f0; padding-bottom: 30px; margin-bottom: 30px;">
        <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.2em; color: #0f172a; text-transform: uppercase; margin-bottom: 10px;">{name}</h1>
        <div style="display: flex; gap: 20px; font-size: 12px; color: #94a3b8; font-weight: 500;">
          <span>{email}</span>
          <span>{phone}</span>
          <span>{linkedin}</span>
        </div>
      </header>

      <div style="display: grid; grid-template-columns: 1fr 2.5fr; gap: 40px;">
        <aside>
          <section style="margin-bottom: 30px;">
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a; margin-bottom: 15px;">Expertise</h2>
            <p style="font-size: 12px; line-height: 1.8;">{skills}</p>
          </section>
          <section>
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a; margin-bottom: 15px;">Education</h2>
            <div style="font-size: 12px; line-height: 1.6;">{education_list}</div>
          </section>
        </aside>

        <main>
          <section style="margin-bottom: 30px;">
             <p style="font-size: 14px; line-height: 1.7; color: #475569;">{summary}</p>
          </section>

          <section>
            <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px;">Notable Projects</h2>
            <div style="font-size: 13px; line-height: 1.6;">{projects_list}</div>
          </section>
        </main>
      </div>
    </div>`
  },
  {
    id: 'premium-modern',
    name: 'Premium Modern',
    description: 'Stylish design with a dark header. Strong visual impact for interns.',
    category: 'Modern',
    html: `<div style="font-family: 'Inter', sans-serif; background: white; max-width: 210mm; min-height: 297mm; margin: auto; color: #1e293b;">
      <header style="background: #0f172a; color: white; padding: 40px 60px;">
        <h1 style="font-size: 36px; font-weight: 900; margin-bottom: 5px;">{name}</h1>
        <p style="font-size: 18px; font-weight: 500; color: #38bdf8;">{role}</p>
        <div style="display: flex; gap: 20px; margin-top: 20px; font-size: 13px; opacity: 0.8;">
          <span>{email}</span> • <span>{phone}</span> • <span>{linkedin}</span>
        </div>
      </header>

      <div style="padding: 40px 60px;">
        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 14px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <span style="width: 24px; height: 1px; background: #0284c7;"></span> Professional Summary
          </h2>
          <p style="font-size: 14px; line-height: 1.6;">{summary}</p>
        </section>

        <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px;">
          <section>
            <h2 style="font-size: 14px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
              <span style="width: 24px; height: 1px; background: #0284c7;"></span> Experience & Projects
            </h2>
            <div style="font-size: 13px;">{projects_list}</div>
          </section>
          <section>
            <h2 style="font-size: 14px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
              <span style="width: 24px; height: 1px; background: #0284c7;"></span> Technical Toolkit
            </h2>
            <div style="font-size: 13px; line-height: 1.8;">{skills}</div>
            
            <h2 style="font-size: 14px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 30px; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
              <span style="width: 24px; height: 1px; background: #0284c7;"></span> Academic Background
            </h2>
            <div style="font-size: 13px;">{education_list}</div>
          </section>
        </div>
      </div>
    </div>`
  }
];

export const getTemplateById = (id) => templates.find((t) => t.id === id) || templates[0];
