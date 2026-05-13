import React from 'react';

export const templates = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    description: 'Ultra-clean B&W layout (Harshibar style). Best for high-volume ATS systems.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Inter', sans-serif; padding: 40px; color: #000; line-height: 1.5; background: white; max-width: 210mm; min-height: 297mm; margin: auto;">
      <header style="text-align: center; margin-bottom: 25px;">
        <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">{name}</h1>
        <div style="font-size: 11px; display: flex; justify-content: center; gap: 15px; color: #334155;">
          <span>{phone}</span> <span>|</span> <span>{email}</span> <span>|</span> <span>{linkedin}</span> <span>|</span> <span>{github}</span>
        </div>
      </header>

      <section style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px;">Experience</h2>
        <div style="font-size: 11px;">{projects_list}</div>
      </section>

      <section style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px;">Projects</h2>
        <div style="font-size: 11px;">{projects_list}</div>
      </section>

      <section style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px;">Education</h2>
        <div style="font-size: 11px;">{education_list}</div>
      </section>

      <section>
        <h2 style="font-size: 13px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 8px;">Skills</h2>
        <p style="font-size: 11px;">{skills}</p>
      </section>
    </div>`
  },
  {
    id: 'indian-fresher',
    name: 'Indian Fresher',
    description: 'Standard Indian engineering format with education table. Perfect for campus drives.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Times New Roman', serif; padding: 30px; color: #000; line-height: 1.3; background: white; max-width: 210mm; min-height: 297mm; margin: auto; border: 1px solid #ccc;">
      <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="width: 50px; h-50px; background: #f0f0f0; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; font-size: 8px; text-align: center;">LOGO</div>
          <div>
            <h1 style="font-size: 20px; font-weight: bold; margin: 0;">{name}</h1>
            <p style="font-size: 12px; margin: 2px 0;">{role}</p>
          </div>
        </div>
        <div style="text-align: right; font-size: 11px;">
          <p>{phone}</p>
          <p>{email}</p>
          <p>{linkedin}</p>
        </div>
      </header>

      <section style="margin-bottom: 15px;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 8px;">Education</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr style="background: #f9f9f9;">
            <th style="border: 1px solid #000; padding: 4px; text-align: left;">Year</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: left;">Degree/Certificate</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: left;">Institute</th>
            <th style="border: 1px solid #000; padding: 4px; text-align: left;">CGPA/%</th>
          </tr>
          {education_table_rows}
        </table>
      </section>

      <section style="margin-bottom: 15px;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 8px;">Projects</h2>
        <div style="font-size: 11px;">{projects_list}</div>
      </section>

      <section style="margin-bottom: 15px;">
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 8px;">Technical Skills</h2>
        <div style="font-size: 11px;">{skills_grouped}</div>
      </section>

      <section>
        <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 8px;">Certifications & Miscellaneous</h2>
        <div style="font-size: 11px;">{certifications}</div>
      </section>
    </div>`
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: 'Modern corporate style with bold orange highlights and summary block.',
    category: 'Corporate',
    html: `<div style="font-family: 'Helvetica', Arial, sans-serif; padding: 0; color: #333; background: white; max-width: 210mm; min-height: 297mm; margin: auto;">
      <div style="padding: 40px 40px 20px 40px;">
        <h1 style="font-size: 32px; font-weight: 300; margin: 0; color: #000;">{name}</h1>
        <p style="font-size: 14px; color: #666; margin-top: 5px;">{role}</p>
        <p style="font-size: 12px; margin-top: 15px; line-height: 1.6;">{summary}</p>
      </div>

      <div style="background: #e65100; color: white; padding: 8px 40px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
        <span>@ {email}</span>
        <span>in {linkedin}</span>
        <span>gh {github}</span>
        <span>{phone}</span>
      </div>

      <div style="padding: 30px 40px;">
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #e65100; text-transform: uppercase; margin-bottom: 10px;">Skills</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-size: 11px;">
            {skills_cols}
          </div>
        </section>

        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #e65100; text-transform: uppercase; margin-bottom: 10px;">Education</h2>
          <div style="font-size: 11px;">{education_list}</div>
        </section>

        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 14px; font-weight: bold; color: #e65100; text-transform: uppercase; margin-bottom: 10px;">Experience & Projects</h2>
          <div style="font-size: 11px;">{projects_list}</div>
        </section>
      </div>
    </div>`
  },
  {
    id: 'creative-sidebar',
    name: 'Creative Sidebar',
    description: 'Highly visual with a left sidebar, profile picture, and creative icons.',
    category: 'Creative',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; background: #fff; max-width: 210mm; min-height: 297mm; margin: auto;">
      <aside style="width: 240px; background: #f4f4f4; padding: 40px 25px; border-right: 1px solid #eee;">
        <div style="width: 120px; height: 120px; border-radius: 50%; background: #ddd; margin: 0 auto 30px auto; overflow: hidden; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
           <img src="https://ui-avatars.com/api/?name={name}&background=6366f1&color=fff&size=128" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>

        <section style="margin-bottom: 30px;">
          <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #6366f1; background: #eef2ff; padding: 4px 8px; display: inline-block; border-radius: 4px; margin-bottom: 15px;">About Me</h3>
          <p style="font-size: 11px; line-height: 1.6; color: #475569;">{summary}</p>
        </section>

        <section style="margin-bottom: 30px;">
          <h3 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #6366f1; background: #eef2ff; padding: 4px 8px; display: inline-block; border-radius: 4px; margin-bottom: 15px;">Expertise</h3>
          <div style="font-size: 11px; color: #475569;">{skills_sidebar}</div>
        </section>

        <section>
          <div style="font-size: 11px; color: #6366f1; space-y: 8px;">
            <p><b>📧</b> {email}</p>
            <p><b>🔗</b> {linkedin}</p>
            <p><b>🐙</b> {github}</p>
          </div>
        </section>
      </aside>

      <main style="flex: 1; padding: 40px 50px;">
        <header style="margin-bottom: 40px;">
          <h1 style="font-size: 44px; font-weight: 800; color: #1e293b; line-height: 1;">{name}</h1>
          <p style="font-size: 18px; color: #6366f1; font-weight: 600; margin-top: 5px;">{role}</p>
        </header>

        <section style="margin-bottom: 40px;">
           <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #1e293b; border-bottom: 2px solid #6366f1; padding-bottom: 5px; margin-bottom: 20px;">Selected Projects</h2>
           <div style="font-size: 13px;">{projects_list}</div>
        </section>

        <section>
           <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #1e293b; border-bottom: 2px solid #6366f1; padding-bottom: 5px; margin-bottom: 20px;">Education</h2>
           <div style="font-size: 13px;">{education_list}</div>
        </section>
      </main>
    </div>`
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Formal CV style with blue highlights. Best for research and masters applications.',
    category: 'Academic',
    html: `<div style="font-family: 'Garamond', serif; padding: 50px; color: #333; background: white; max-width: 210mm; min-height: 297mm; margin: auto;">
      <header style="margin-bottom: 30px;">
        <h1 style="font-size: 36px; font-weight: bold; color: #1a237e; margin: 0;">{name}</h1>
        <div style="font-size: 12px; margin-top: 10px; color: #555;">
          <p>{email} | {phone}</p>
          <p>{linkedin} | {github}</p>
        </div>
      </header>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; color: #1a237e; border-bottom: 2px solid #1a237e; margin-bottom: 12px;">Personal Profile</h2>
        <p style="font-size: 13px; line-height: 1.6; text-align: justify;">{summary}</p>
      </section>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; color: #1a237e; border-bottom: 2px solid #1a237e; margin-bottom: 12px;">Education</h2>
        <div style="font-size: 13px;">{education_list}</div>
      </section>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 18px; font-weight: bold; color: #1a237e; border-bottom: 2px solid #1a237e; margin-bottom: 12px;">Research & Projects</h2>
        <div style="font-size: 13px;">{projects_list}</div>
      </section>

      <section>
        <h2 style="font-size: 18px; font-weight: bold; color: #1a237e; border-bottom: 2px solid #1a237e; margin-bottom: 12px;">Technical Skills</h2>
        <p style="font-size: 13px;">{skills}</p>
      </section>
    </div>`
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: 'High-impact design with dark header and professional summary. Best for leadership roles.',
    category: 'Corporate',
    html: `<div style="font-family: 'Segoe UI', sans-serif; background: white; max-width: 210mm; min-height: 297mm; margin: auto; color: #334155;">
      <header style="background: #0f172a; color: white; padding: 50px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 42px; font-weight: 800; margin: 0; line-height: 1;">{name}</h1>
          <p style="font-size: 18px; font-weight: 400; color: #38bdf8; margin-top: 10px; letter-spacing: 0.1em; text-transform: uppercase;">{role}</p>
        </div>
        <div style="text-align: right; font-size: 13px; opacity: 0.9;">
           <p style="margin-bottom: 5px;">📞 {phone}</p>
           <p style="margin-bottom: 5px;">📧 {email}</p>
           <p>🔗 {linkedin}</p>
        </div>
      </header>

      <div style="padding: 45px 50px;">
        <section style="margin-bottom: 40px; border-left: 5px solid #0f172a; padding-left: 20px;">
           <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 10px; letter-spacing: 0.05em;">Executive Summary</h2>
           <p style="font-size: 14px; line-height: 1.7; color: #475569;">{summary}</p>
        </section>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 50px;">
          <div>
            <section style="margin-bottom: 40px;">
              <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; letter-spacing: 0.05em;">Key Projects</h2>
              <div style="font-size: 14px;">{projects_list}</div>
            </section>
            
            <section>
              <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; letter-spacing: 0.05em;">Education</h2>
              <div style="font-size: 14px;">{education_list}</div>
            </section>
          </div>

          <div>
            <section style="margin-bottom: 40px;">
              <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; letter-spacing: 0.05em;">Expertise</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                {skills_chips}
              </div>
            </section>

            <section>
              <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 20px; letter-spacing: 0.05em;">Certifications</h2>
              <div style="font-size: 13px; color: #475569; line-height: 1.6;">{certifications}</div>
            </section>
          </div>
        </div>
      </div>
    </div>`
  }
];

export const getTemplateById = (id) => templates.find((t) => t.id === id) || templates[0];
