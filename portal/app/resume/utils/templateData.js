import React from 'react';

export const templates = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    description: '1:1 recreation of the Harshibar B&W resume. Maximum ATS compatibility.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Inter', -apple-system, system-ui, sans-serif; padding: 40px 50px; color: #000; line-height: 1.4; background: white; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 11px;">
      <header style="text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 5px 0; letter-spacing: -0.02em;">{name}</h1>
        <div style="font-size: 10px; display: flex; justify-content: center; align-items: center; gap: 12px; color: #333;">
          <span style="display: flex; align-items: center; gap: 4px;">📞 {phone}</span>
          <span style="color: #cbd5e1;">|</span>
          <span style="display: flex; align-items: center; gap: 4px;">✉️ {email}</span>
          <span style="color: #cbd5e1;">|</span>
          <span style="display: flex; align-items: center; gap: 4px;">🔗 {linkedin}</span>
          <span style="color: #cbd5e1;">|</span>
          <span style="display: flex; align-items: center; gap: 4px;">📍 {location}</span>
        </div>
      </header>

      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 11px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 10px; letter-spacing: 0.05em;">Experience</h2>
        <div style="font-size: 11px;">{projects_list_ats}</div>
      </section>

      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 11px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 10px; letter-spacing: 0.05em;">Projects</h2>
        <div style="font-size: 11px;">{projects_list_ats}</div>
      </section>

      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 11px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 10px; letter-spacing: 0.05em;">Education</h2>
        <div style="font-size: 11px;">{education_list_ats}</div>
      </section>

      <section>
        <h2 style="font-size: 11px; font-weight: 800; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 10px; letter-spacing: 0.05em;">Skills</h2>
        <div style="font-size: 11px; line-height: 1.6;">
           <p><b>Languages:</b> {skills_languages}</p>
           <p><b>Tools:</b> {skills_tools}</p>
        </div>
      </section>
    </div>`
  },
  {
    id: 'indian-fresher',
    name: 'Indian Fresher',
    description: 'Standard 1:1 engineering fresher layout with Education Table and college logo.',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Times New Roman', Times, serif; padding: 40px; color: #000; line-height: 1.3; background: white; max-width: 210mm; min-height: 297mm; margin: auto; border: 0.5pt solid #000;">
      <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
        <div style="display: flex; gap: 15px; align-items: center;">
          <div style="width: 60px; height: 60px; border: 1px solid #ddd; border-radius: 4px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #fff;">
             <img src="https://via.placeholder.com/60?text=LOGO" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
          <div>
            <h1 style="font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase;">{name}</h1>
            <p style="font-size: 13px; margin: 2px 0; font-weight: bold;">{role}</p>
            <p style="font-size: 12px; margin: 0;">{college}</p>
          </div>
        </div>
        <div style="text-align: right; font-size: 11px; font-weight: bold; line-height: 1.4;">
          <p>+91-{phone}</p>
          <p>{email}</p>
          <p>GitHub</p>
          <p>LinkedIn</p>
        </div>
      </header>

      <section style="margin-bottom: 12px;">
        <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 5px; padding-bottom: 2px;">Education</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 10px; text-align: center;">
          <thead>
            <tr style="background: #f2f2f2;">
              <th style="border: 1px solid #000; padding: 5px;">Year</th>
              <th style="border: 1px solid #000; padding: 5px;">Degree/Certificate</th>
              <th style="border: 1px solid #000; padding: 5px;">Institute</th>
              <th style="border: 1px solid #000; padding: 5px;">CGPA/Percentage</th>
            </tr>
          </thead>
          <tbody>
            {education_table_rows}
          </tbody>
        </table>
      </section>

      <section style="margin-bottom: 12px;">
        <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 5px; padding-bottom: 2px;">Experience</h2>
        <div style="font-size: 11px;">{projects_list_indian}</div>
      </section>

      <section style="margin-bottom: 12px;">
        <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 5px; padding-bottom: 2px;">Projects</h2>
        <div style="font-size: 11px;">{projects_list_indian}</div>
      </section>

      <section style="margin-bottom: 12px;">
        <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 5px; padding-bottom: 2px;">Technical Skills</h2>
        <div style="font-size: 11px; line-height: 1.5;">{skills_grouped_indian}</div>
      </section>

      <section style="margin-bottom: 12px;">
        <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 5px; padding-bottom: 2px;">Positions of Responsibility</h2>
        <div style="font-size: 11px;">{experience_list_indian}</div>
      </section>

      <section>
        <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; margin-bottom: 5px; padding-bottom: 2px;">Miscellaneous</h2>
        <div style="font-size: 11px;">{certifications_list_indian}</div>
      </section>

      <footer style="margin-top: 20px; font-size: 9px; text-align: right; color: #666;">
        Last updated: {current_date}
      </footer>
    </div>`
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    description: '1:1 recreation of the Orange Professional resume (John Snow style).',
    category: 'Placement Ready',
    html: `<div style="font-family: 'Inter', sans-serif; padding: 0; color: #333; background: white; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 12px;">
      <div style="padding: 40px 50px 25px 50px;">
        <h1 style="font-size: 36px; font-weight: 300; margin: 0; color: #000; letter-spacing: -0.01em;">{name}</h1>
        <p style="font-size: 15px; color: #666; margin-top: 4px; font-weight: 500;">{role}</p>
        <p style="font-size: 12px; margin-top: 15px; line-height: 1.6; color: #475569;">{summary}</p>
      </div>

      <div style="background: #e65100; color: white; padding: 10px 50px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 600; letter-spacing: 0.02em;">
        <div style="display: flex; gap: 15px;">
           <span>✉️ {email}</span>
           <span>🔗 {linkedin}</span>
           <span>🐙 {github}</span>
        </div>
        <span>📞 {phone}</span>
      </div>

      <div style="padding: 30px 50px;">
        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 15px; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Skills</h2>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; font-size: 11px;">
            {skills_grid_corporate}
          </div>
        </section>

        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 15px; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Education</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; font-size: 11px;">
            {education_grid_corporate}
          </div>
        </section>

        <section style="margin-bottom: 25px;">
          <h2 style="font-size: 15px; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Experience</h2>
          <div style="font-size: 11px;">{projects_list_corporate}</div>
        </section>

        <section>
          <h2 style="font-size: 15px; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Other Activities and Projects</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; font-size: 10px;">
            {projects_small_grid_corporate}
          </div>
        </section>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 25px;">
           <section>
              <h2 style="font-size: 15px; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em;">Awards</h2>
              <div style="font-size: 10px;">{certifications}</div>
           </section>
           <section>
              <h2 style="font-size: 15px; font-weight: 800; color: #e65100; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em;">Languages</h2>
              <div style="font-size: 10px;">{languages_list_corporate}</div>
           </section>
        </div>
      </div>
    </div>`
  },
  {
    id: 'creative-sidebar',
    name: 'Creative Sidebar',
    description: '1:1 recreation of the "My Life Philosophy" resume with two-column layout.',
    category: 'Creative',
    html: `<div style="font-family: 'Inter', sans-serif; display: flex; background: #fff; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 11px;">
      <div style="flex: 1.8; padding: 45px 40px;">
        <header style="margin-bottom: 35px;">
          <h1 style="font-size: 38px; font-weight: 900; color: #000; line-height: 1; margin: 0; font-family: 'Playfair Display', serif;">{name}</h1>
          <p style="font-size: 18px; color: #800000; font-weight: 700; margin: 5px 0 15px 0;">{role}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; font-size: 9px; color: #666; font-weight: 600;">
            <span>✉️ {email}</span> <span>📞 {phone}</span> <span>📍 {location}</span> <span>🔗 {linkedin}</span>
          </div>
        </header>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #800000; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 15px;">Experience</h2>
          <div style="font-size: 11px;">{projects_list_creative}</div>
        </section>

        <section style="margin-bottom: 30px;">
          <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #800000; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 15px;">Projects</h2>
          <div style="font-size: 11px;">{projects_list_creative}</div>
        </section>

        <section>
          <h2 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #800000; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 15px;">A Day of My Life</h2>
          <div style="display: flex; align-items: center; gap: 20px; margin-top: 10px;">
             <div style="width: 100px; height: 100px; border-radius: 50%; border: 15px solid #800000; border-top-color: #d4af37; border-right-color: #555;"></div>
             <div style="font-size: 10px; font-weight: 700; color: #666;">
                <p>• Coding & Logic (60%)</p>
                <p>• Research & Strategy (25%)</p>
                <p>• Hobbies & Sleep (15%)</p>
             </div>
          </div>
        </section>
      </div>

      <aside style="flex: 1; padding: 45px 30px; border-left: 1px solid #eee; background: #fff;">
        <div style="width: 120px; height: 120px; border-radius: 50%; background: #ddd; margin: 0 auto 30px auto; overflow: hidden; border: 5px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
           <img src="https://ui-avatars.com/api/?name={name}&background=800000&color=fff&size=256" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>

        <section style="margin-bottom: 30px;">
          <h3 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #800000; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 15px;">My Life Philosophy</h3>
          <p style="font-size: 12px; font-style: italic; color: #444; line-height: 1.5;">"{summary}"</p>
        </section>

        <section style="margin-bottom: 30px;">
          <h3 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #800000; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 15px;">Strengths</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            {skills_chips_creative}
          </div>
        </section>

        <section style="margin-bottom: 30px;">
          <h3 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #800000; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 15px;">Languages</h3>
          <div style="font-size: 11px;">{languages_dots_creative}</div>
        </section>

        <section>
          <h3 style="font-size: 18px; font-weight: 900; text-transform: uppercase; color: #800000; border-bottom: 2px solid #d4af37; padding-bottom: 4px; margin-bottom: 15px;">Education</h3>
          <div style="font-size: 11px;">{education_list_creative}</div>
        </section>
      </aside>
    </div>`
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: '1:1 recreation of the Blue Research CV style. Formal and detailed.',
    category: 'Academic',
    html: `<div style="font-family: 'Helvetica', Arial, sans-serif; padding: 50px 60px; color: #333; background: white; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 11px;">
      <header style="margin-bottom: 35px;">
        <h1 style="font-size: 34px; font-weight: bold; color: #1a237e; margin: 0; letter-spacing: -0.01em;">{name}</h1>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; font-size: 10px; color: #555; font-weight: 500;">
          <div>
            <p>City, Country</p>
            <p>Mobile: +91 {phone}</p>
            <p>Email: {email}</p>
          </div>
          <div>
            <p>LinkedIn: {linkedin}</p>
            <p>GitHub: {github}</p>
            <p>Nationality: Indian</p>
          </div>
        </div>
      </header>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 15px; font-weight: 800; color: #1a237e; border-bottom: 1.5px solid #1a237e; padding-bottom: 3px; margin-bottom: 10px; text-transform: capitalize;">Personal Profile</h2>
        <p style="font-size: 11px; line-height: 1.6; color: #333; text-align: justify;">{summary}</p>
      </section>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 15px; font-weight: 800; color: #1a237e; border-bottom: 1.5px solid #1a237e; padding-bottom: 3px; margin-bottom: 10px; text-transform: capitalize;">Education</h2>
        <div style="font-size: 11px;">{education_list_research}</div>
      </section>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 15px; font-weight: 800; color: #1a237e; border-bottom: 1.5px solid #1a237e; padding-bottom: 3px; margin-bottom: 10px; text-transform: capitalize;">Experience</h2>
        <div style="font-size: 11px;">{projects_list_research}</div>
      </section>

      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 15px; font-weight: 800; color: #1a237e; border-bottom: 1.5px solid #1a237e; padding-bottom: 3px; margin-bottom: 10px; text-transform: capitalize;">Academic Publications</h2>
        <div style="font-size: 11px;">
           <p style="color: #0284c7; font-weight: bold; margin-bottom: 4px;">{role} Projects | {current_year}</p>
           <p style="font-size: 10px; color: #666;">University Research Lab</p>
        </div>
      </section>

      <section>
        <h2 style="font-size: 15px; font-weight: 800; color: #1a237e; border-bottom: 1.5px solid #1a237e; padding-bottom: 3px; margin-bottom: 10px; text-transform: capitalize;">Skills & Technical Interests</h2>
        <p style="font-size: 11px; line-height: 1.6;">{skills}</p>
      </section>
      
      <div style="text-align: center; margin-top: 40px; font-size: 9px; color: #999;">1</div>
    </div>`
  },
  {
    id: 'executive-premium',
    name: 'Executive Premium',
    description: '1:1 recreation of the Jack Sparrow style. High-end layout with sidebar and dark header.',
    category: 'Corporate',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; flex-direction: column; background: #fff; max-width: 210mm; min-height: 297mm; margin: auto; font-size: 11px;">
      <header style="background: #333; color: white; padding: 40px 60px; text-align: center;">
        <h1 style="font-size: 48px; font-weight: 300; margin: 0; letter-spacing: 0.1em; text-transform: uppercase;">{name}</h1>
        <p style="font-size: 16px; font-weight: 400; opacity: 0.8; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.2em;">{role}</p>
      </header>

      <div style="display: flex; flex: 1;">
        <aside style="width: 240px; background: #f0f0f0; padding: 40px 30px; border-right: 1px solid #ddd;">
           <div style="width: 130px; height: 130px; border-radius: 50%; background: #ccc; margin: 0 auto 40px auto; overflow: hidden; border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <img src="https://ui-avatars.com/api/?name={name}&background=333&color=fff&size=256" style="width: 100%; height: 100%; object-fit: cover;" />
           </div>

           <section style="margin-bottom: 30px;">
              <h3 style="font-size: 12px; font-weight: bold; background: #0284c7; color: white; padding: 3px 10px; display: inline-block; margin-bottom: 12px;">About me</h3>
              <p style="font-size: 10px; line-height: 1.6; color: #555;">{summary}</p>
           </section>

           <section style="margin-bottom: 30px;">
              <h3 style="font-size: 12px; font-weight: bold; background: #0284c7; color: white; padding: 3px 10px; display: inline-block; margin-bottom: 12px;">Expertise</h3>
              <div style="font-size: 10px; line-height: 1.6; color: #555;">{skills_sidebar_premium}</div>
           </section>

           <div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-top: 40px; space-y: 5px;">
              <p>✉️ {email}</p>
              <p>🔗 {linkedin}</p>
              <p>🐙 {github}</p>
           </div>
        </aside>

        <main style="flex: 1; padding: 50px 50px;">
           <section style="margin-bottom: 35px;">
              <h2 style="font-size: 18px; font-weight: 300; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 15px; letter-spacing: 0.1em;">Short Resumé</h2>
              <div style="font-size: 11px;">{projects_list_premium}</div>
           </section>

           <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 35px;">
              <section>
                 <h2 style="font-size: 18px; font-weight: 300; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 15px; letter-spacing: 0.1em;">Degrees</h2>
                 <div style="font-size: 10px;">{education_list_premium}</div>
              </section>
              <section>
                 <h2 style="font-size: 18px; font-weight: 300; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 15px; letter-spacing: 0.1em;">Programming</h2>
                 <div style="font-size: 10px;">{skills_bars_premium}</div>
              </section>
           </div>

           <section>
              <h2 style="font-size: 18px; font-weight: 300; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 15px; letter-spacing: 0.1em;">Certificates & Grants</h2>
              <div style="font-size: 10px;">{certifications_list_premium}</div>
           </section>
        </main>
      </div>

      <footer style="padding: 15px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; display: flex; justify-content: center; gap: 20px;">
         <span>{name}</span> <span>•</span> <span>{email}</span> <span>•</span> <span>{phone}</span>
      </footer>
    </div>`
  }
];

export const getTemplateById = (id) => templates.find((t) => t.id === id) || templates[0];
