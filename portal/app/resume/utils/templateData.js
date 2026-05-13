import React from 'react';

export const templates = [
  {
    id: 'ats-jake',
    name: 'ATS Professional',
    description: 'Jake\'s Resume style - clean, high-performance ATS template.',
    category: 'Placement Ready',
    thumbnail: 'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs/thumbnail.png',
    html: `<div style="font-family: 'Times New Roman', Times, serif; padding: 40px 50px; color: #000; line-height: 1.2; background: white; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 10.5pt;">
      <header style="text-align: center; margin-bottom: 12pt;">
        <h1 style="font-size: 24pt; font-weight: bold; margin: 0 0 4pt 0; text-transform: uppercase;">{name}</h1>
        <div style="font-size: 10pt; display: flex; justify-content: center; align-items: center; gap: 8pt;">
          <span>{phone}</span>
          <span>|</span>
          <span><a href="mailto:{email}" style="color: #000; text-decoration: none;">{email}</a></span>
          <span>|</span>
          <span><a href="{linkedin_url}" style="color: #000; text-decoration: none;">LinkedIn</a></span>
          <span>|</span>
          <span><a href="{github_url}" style="color: #000; text-decoration: none;">GitHub</a></span>
        </div>
      </header>

      <section style="margin-bottom: 10pt;">
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 1pt; margin-bottom: 4pt;">Education</h2>
        {education_jake}
      </section>

      <section style="margin-bottom: 10pt;">
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 1pt; margin-bottom: 4pt;">Experience</h2>
        {experience_jake}
      </section>

      <section style="margin-bottom: 10pt;">
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 1pt; margin-bottom: 4pt;">Projects</h2>
        {projects_jake}
      </section>

      <section>
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 1pt; margin-bottom: 4pt;">Technical Skills</h2>
        <div style="font-size: 10.5pt; line-height: 1.4;">
           {skills_jake}
        </div>
      </section>
    </div>`
  },
  {
    id: 'indian-iit',
    name: 'Indian Fresher (IIT Style)',
    description: 'Placement-ready engineering resume with structured education table.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Times New Roman', Times, serif; padding: 35px 45px; color: #000; line-height: 1.3; background: white; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 11pt;">
      <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15pt; border-bottom: 2px solid #000; padding-bottom: 10pt;">
        <div>
          <h1 style="font-size: 20pt; font-weight: bold; margin: 0; text-transform: uppercase;">{name}</h1>
          <p style="font-size: 11pt; margin: 2pt 0; font-weight: bold;">{role}</p>
          <p style="font-size: 11pt; margin: 0;">{college}</p>
        </div>
        <div style="text-align: right; font-size: 10pt; line-height: 1.4;">
          <p><b>Phone:</b> +91 {phone}</p>
          <p><b>Email:</b> {email}</p>
          <p><b>Profiles:</b> <a href="{github_url}">GitHub</a> | <a href="{linkedin_url}">LinkedIn</a></p>
        </div>
      </header>

      <section style="margin-bottom: 12pt;">
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; background: #eee; padding: 2pt 6pt; margin-bottom: 6pt;">Education</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 10pt; text-align: center; border: 1px solid #000;">
          <thead>
            <tr style="background: #f9f9f9;">
              <th style="border: 1px solid #000; padding: 4pt;">Year</th>
              <th style="border: 1px solid #000; padding: 4pt;">Degree/Certificate</th>
              <th style="border: 1px solid #000; padding: 4pt;">Institute/Board</th>
              <th style="border: 1px solid #000; padding: 4pt;">CGPA/Percentage</th>
            </tr>
          </thead>
          <tbody>
            {education_table_rows}
          </tbody>
        </table>
      </section>

      <section style="margin-bottom: 12pt;">
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; background: #eee; padding: 2pt 6pt; margin-bottom: 6pt;">Internships & Experience</h2>
        {experience_indian}
      </section>

      <section style="margin-bottom: 12pt;">
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; background: #eee; padding: 2pt 6pt; margin-bottom: 6pt;">Technical Projects</h2>
        {projects_indian}
      </section>

      <section style="margin-bottom: 12pt;">
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; background: #eee; padding: 2pt 6pt; margin-bottom: 6pt;">Technical Skills</h2>
        <div style="font-size: 10.5pt; line-height: 1.5;">{skills_indian}</div>
      </section>

      <section>
        <h2 style="font-size: 12pt; font-weight: bold; text-transform: uppercase; background: #eee; padding: 2pt 6pt; margin-bottom: 6pt;">Positions of Responsibility</h2>
        <div style="font-size: 10.5pt;">
           • Active member of Technical Club at {college}<br/>
           • Led a team of 4 for domain-specific internship projects at CodTech.
        </div>
      </section>
    </div>`
  },
  {
    id: 'corporate-orange',
    name: 'Corporate Professional',
    description: 'Modern John Snow style layout with professional orange accents.',
    category: 'Corporate',
    html: `<div style="font-family: 'Inter', sans-serif; padding: 0; color: #333; background: white; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 11pt;">
      <div style="padding: 40pt 50pt 20pt 50pt;">
        <h1 style="font-size: 32pt; font-weight: 300; margin: 0; color: #000; letter-spacing: -0.01em; text-transform: uppercase;">{name}</h1>
        <p style="font-size: 14pt; color: #e65100; margin-top: 4pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">{role}</p>
        <p style="font-size: 10.5pt; margin-top: 12pt; line-height: 1.5; color: #444;">{summary}</p>
      </div>

      <div style="background: #333; color: white; padding: 8pt 50pt; display: flex; justify-content: space-between; align-items: center; font-size: 9.5pt; font-weight: 500;">
        <div style="display: flex; gap: 15pt;">
           <span>✉️ {email}</span>
           <span>🔗 LinkedIn</span>
           <span>🐙 GitHub</span>
        </div>
        <span>📞 {phone}</span>
      </div>

      <div style="padding: 25pt 50pt;">
        <section style="margin-bottom: 20pt;">
          <h2 style="font-size: 14pt; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 10pt; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 4pt;">Core Expertise</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10pt; font-size: 10pt;">
            {skills_corporate}
          </div>
        </section>

        <section style="margin-bottom: 20pt;">
          <h2 style="font-size: 14pt; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 10pt; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 4pt;">Professional Experience</h2>
          {experience_corporate}
        </section>

        <section style="margin-bottom: 20pt;">
          <h2 style="font-size: 14pt; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 10pt; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 4pt;">Education</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30pt;">
            {education_corporate}
          </div>
        </section>

        <section>
          <h2 style="font-size: 14pt; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 10pt; letter-spacing: 0.05em; border-bottom: 1px solid #eee; padding-bottom: 4pt;">Certifications</h2>
          <div style="font-size: 10pt; line-height: 1.6;">
            {certifications_corporate}
          </div>
        </section>
      </div>
    </div>`
  },
  {
    id: 'altacv-modern',
    name: 'AltaCV Modern',
    description: 'Two-column modern layout with icons and professional sidebar.',
    category: 'Creative',
    html: `<div style="font-family: 'Inter', sans-serif; display: flex; background: #fff; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 10pt; color: #333;">
      <div style="flex: 2; padding: 40pt 35pt; border-right: 1px solid #f0f0f0;">
        <header style="margin-bottom: 30pt;">
          <h1 style="font-size: 30pt; font-weight: 900; color: #004d40; line-height: 1; margin: 0;">{name}</h1>
          <p style="font-size: 14pt; color: #00796b; font-weight: 700; margin: 5pt 0 15pt 0; text-transform: uppercase; letter-spacing: 0.1em;">{role}</p>
          <p style="font-size: 10pt; color: #666; line-height: 1.5; font-style: italic;">{summary}</p>
        </header>

        <section style="margin-bottom: 25pt;">
          <h2 style="font-size: 14pt; font-weight: 900; text-transform: uppercase; color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 3pt; margin-bottom: 12pt;">Experience</h2>
          {experience_alta}
        </section>

        <section style="margin-bottom: 25pt;">
          <h2 style="font-size: 14pt; font-weight: 900; text-transform: uppercase; color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 3pt; margin-bottom: 12pt;">Key Projects</h2>
          {projects_alta}
        </section>

        <section>
          <h2 style="font-size: 14pt; font-weight: 900; text-transform: uppercase; color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 3pt; margin-bottom: 12pt;">My Life Philosophy</h2>
          <div style="padding: 10pt; background: #e0f2f1; border-radius: 8pt; color: #00695c; font-style: italic;">
             "Strive for excellence through continuous learning and innovative problem solving."
          </div>
        </section>
      </div>

      <aside style="flex: 1; padding: 40pt 25pt; background: #fafafa;">
        <div style="margin-bottom: 25pt; font-size: 9pt; color: #555;">
          <div style="margin-bottom: 8pt;">✉️ {email}</div>
          <div style="margin-bottom: 8pt;">📞 {phone}</div>
          <div style="margin-bottom: 8pt;">📍 City, India</div>
          <div style="margin-bottom: 8pt;">🔗 LinkedIn</div>
          <div style="margin-bottom: 8pt;">🐙 GitHub</div>
        </div>

        <section style="margin-bottom: 25pt;">
          <h3 style="font-size: 12pt; font-weight: 900; text-transform: uppercase; color: #004d40; margin-bottom: 10pt; border-left: 4pt solid #004d40; padding-left: 8pt;">Skills</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 5pt;">
            {skills_alta}
          </div>
        </section>

        <section style="margin-bottom: 25pt;">
          <h3 style="font-size: 12pt; font-weight: 900; text-transform: uppercase; color: #004d40; margin-bottom: 10pt; border-left: 4pt solid #004d40; padding-left: 8pt;">Education</h3>
          {education_alta}
        </section>

        <section>
          <h3 style="font-size: 12pt; font-weight: 900; text-transform: uppercase; color: #004d40; margin-bottom: 10pt; border-left: 4pt solid #004d40; padding-left: 8pt;">Languages</h3>
          <div style="font-size: 9.5pt;">
             • English (Fluent)<br/>
             • Hindi (Native)
          </div>
        </section>
      </aside>
    </div>`
  },
  {
    id: 'deedy-research',
    name: 'Deedy Academic',
    description: 'High-density research layout inspired by the Deedy CV.',
    category: 'Academic',
    html: `<div style="font-family: 'Open Sans', sans-serif; display: flex; background: #fff; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 10pt; color: #333; line-height: 1.2;">
      <aside style="flex: 1; padding: 40pt 25pt; border-right: 1px solid #eee; background: #fff;">
        <header style="margin-bottom: 20pt;">
          <h1 style="font-size: 28pt; font-weight: 300; color: #333; line-height: 1; margin: 0; text-transform: uppercase;">{name}</h1>
        </header>

        <section style="margin-bottom: 20pt;">
          <h3 style="font-size: 13pt; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 8pt; border-bottom: 1px solid #eee;">Contact</h3>
          <p style="font-size: 9.5pt; color: #555;">{email}</p>
          <p style="font-size: 9.5pt; color: #555;">{phone}</p>
          <p style="font-size: 9.5pt; color: #555;">LinkedIn: /in/{name}</p>
        </section>

        <section style="margin-bottom: 20pt;">
          <h3 style="font-size: 13pt; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 8pt; border-bottom: 1px solid #eee;">Education</h3>
          {education_deedy}
        </section>

        <section style="margin-bottom: 20pt;">
          <h3 style="font-size: 13pt; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 8pt; border-bottom: 1px solid #eee;">Skills</h3>
          <div style="font-size: 9.5pt; color: #555;">
             {skills_deedy}
          </div>
        </section>

        <section>
          <h3 style="font-size: 13pt; font-weight: 600; color: #666; text-transform: uppercase; margin-bottom: 8pt; border-bottom: 1px solid #eee;">Coursework</h3>
          <p style="font-size: 9pt; color: #777;">Data Structures, Algorithms, OS, DBMS, Web Tech</p>
        </section>
      </aside>

      <div style="flex: 2.2; padding: 40pt 35pt;">
        <section style="margin-bottom: 25pt;">
          <h2 style="font-size: 14pt; font-weight: 400; color: #333; text-transform: uppercase; margin-bottom: 10pt; letter-spacing: 0.1em; border-bottom: 1px solid #333;">Experience</h2>
          {experience_deedy}
        </section>

        <section style="margin-bottom: 25pt;">
          <h2 style="font-size: 14pt; font-weight: 400; color: #333; text-transform: uppercase; margin-bottom: 10pt; letter-spacing: 0.1em; border-bottom: 1px solid #333;">Projects</h2>
          {projects_deedy}
        </section>

        <section>
          <h2 style="font-size: 14pt; font-weight: 400; color: #333; text-transform: uppercase; margin-bottom: 10pt; letter-spacing: 0.1em; border-bottom: 1px solid #333;">Publications</h2>
          <div style="font-size: 10pt; color: #555;">
             • "Advanced Optimization in {role}" - Published in Technical Journal 2024.<br/>
             • Contributing Researcher at CodTech Technical Wing.
          </div>
        </section>
      </div>
    </div>`
  },
  {
    id: 'awesome-executive',
    name: 'Awesome Executive',
    description: 'Premium Awesome CV style with iconic header and bold typography.',
    category: 'Executive',
    html: `<div style="font-family: 'Roboto', sans-serif; padding: 45pt 55pt; color: #333; background: white; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 11pt;">
      <header style="text-align: center; margin-bottom: 30pt;">
        <h1 style="font-size: 38pt; font-weight: 300; margin: 0; color: #000; letter-spacing: 0.05em;"><span style="font-weight: 900; color: #dc2626;">{name_first}</span> {name_last}</h1>
        <p style="font-size: 14pt; color: #dc2626; margin-top: 8pt; font-weight: 500; text-transform: uppercase; letter-spacing: 0.15em;">{role}</p>
        <div style="font-size: 10pt; display: flex; justify-content: center; align-items: center; gap: 15pt; margin-top: 15pt; color: #666;">
           <span>📞 {phone}</span>
           <span>✉️ {email}</span>
           <span>📍 City, India</span>
           <span>🔗 LinkedIn</span>
        </div>
      </header>

      <section style="margin-bottom: 25pt;">
        <h2 style="font-size: 16pt; font-weight: 900; color: #333; text-transform: uppercase; margin-bottom: 15pt; border-bottom: 1px solid #dc2626; padding-bottom: 5pt; display: flex; align-items: center; gap: 10pt;">
           <span style="color: #dc2626;">★</span> Summary
        </h2>
        <p style="font-size: 11pt; line-height: 1.6; color: #444;">{summary}</p>
      </section>

      <section style="margin-bottom: 25pt;">
        <h2 style="font-size: 16pt; font-weight: 900; color: #333; text-transform: uppercase; margin-bottom: 15pt; border-bottom: 1px solid #dc2626; padding-bottom: 5pt; display: flex; align-items: center; gap: 10pt;">
           <span style="color: #dc2626;">★</span> Experience
        </h2>
        {experience_awesome}
      </section>

      <section style="margin-bottom: 25pt;">
        <h2 style="font-size: 16pt; font-weight: 900; color: #333; text-transform: uppercase; margin-bottom: 15pt; border-bottom: 1px solid #dc2626; padding-bottom: 5pt; display: flex; align-items: center; gap: 10pt;">
           <span style="color: #dc2626;">★</span> Education
        </h2>
        {education_awesome}
      </section>

      <section>
        <h2 style="font-size: 16pt; font-weight: 900; color: #333; text-transform: uppercase; margin-bottom: 15pt; border-bottom: 1px solid #dc2626; padding-bottom: 5pt; display: flex; align-items: center; gap: 10pt;">
           <span style="color: #dc2626;">★</span> Technical Skills
        </h2>
        {skills_awesome}
      </section>
    </div>`
  }
];

export const getTemplateById = (id) => templates.find((t) => t.id === id) || templates[0];
