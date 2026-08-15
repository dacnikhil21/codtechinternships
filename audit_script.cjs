const mysql = require('mysql2/promise');
const { readFileSync } = require('fs');

async function audit() {
  try {
    const dbPath = 'c:/Users/ABHINAYA BEDGUM/Desktop/ct 2.0/portal/lib/db.js';
    const content = readFileSync(dbPath, 'utf8');
    const hostMatch = content.match(/host:\s*'([^']+)'/);
    const userMatch = content.match(/user:\s*'([^']+)'/);
    const passMatch = content.match(/password:\s*'([^']+)'/);
    const dbMatch = content.match(/database:\s*'([^']+)'/);
    
    if(!hostMatch) { console.log('Could not find DB credentials'); return; }
    
    const pool = mysql.createPool({
      host: hostMatch[1],
      user: userMatch[1],
      password: passMatch[1],
      database: dbMatch[1],
    });

    console.log('--- PROJECTS AUDIT ---');
    try {
      const [projects] = await pool.execute('SELECT course, count(*) as count FROM projects GROUP BY course');
      console.log('Projects per domain:');
      console.table(projects);
    } catch(e) { console.log('Projects table error:', e.message); }

    console.log('\n--- CURRICULUM AUDIT ---');
    try {
      const [curriculum] = await pool.execute('SELECT course, count(*) as count FROM curriculum GROUP BY course');
      console.log('Curriculum per domain:');
      console.table(curriculum);
    } catch(e) { console.log('Curriculum table error:', e.message); }
    
    process.exit(0);
  } catch(err) {
    console.error(err);
    process.exit(1);
  }
}
audit();
