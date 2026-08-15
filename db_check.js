import pool from './lib/db.js';

async function checkDb() {
  try {
    const [domains] = await pool.execute('SELECT count(*) as count FROM domains');
    const [projects] = await pool.execute('SELECT count(*) as count FROM projects');
    const [sample] = await pool.execute('SELECT name FROM domains LIMIT 5');
    
    console.log('--- DB HEALTH CHECK ---');
    console.log('Domains Count:', domains[0].count);
    console.log('Projects Count:', projects[0].count);
    console.log('Sample Domains:', sample.map(d => d.name));
    console.log('-----------------------');
    process.exit(0);
  } catch (err) {
    console.error('DB CHECK ERROR:', err.message);
    process.exit(1);
  }
}

checkDb();
