const mysql = require('mysql2/promise');

const config = {
  host: '127.0.0.1',
  user: 'u371402898_ctadmin',
  password: 'Codtech2002',
  database: 'u371402898_ctintern',
  waitForConnections: true,
  connectionLimit: 1,
  connectTimeout: 10000,
};

async function audit() {
  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('--- DATABASE AUDIT START ---\n');

    // 1. Table Counts
    const tables = ['domains', 'projects', 'user', 'task'];
    for (const table of tables) {
      try {
        const [rows] = await conn.execute(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`Table [${table}]: ${rows[0].count} rows`);
      } catch (e) {
        console.log(`Table [${table}]: NOT FOUND or Error: ${e.message}`);
      }
    }

    // 2. Domain Check
    const [domains] = await conn.execute('SELECT id, name FROM domains');
    console.log(`\nTotal Domains in DB: ${domains.length}`);
    
    // 3. Project Distribution
    console.log('\n--- Project Distribution per Domain ---');
    const domainStats = [];
    for (const d of domains) {
      const [pRows] = await conn.execute('SELECT COUNT(*) as count FROM projects WHERE domain_id = ?', [d.id]);
      domainStats.push({ name: d.name, count: pRows[0].count });
    }
    
    domainStats.sort((a, b) => b.count - a.count);
    domainStats.forEach(d => {
      console.log(`${d.count === 30 ? '✅' : '❌'} ${d.name.padEnd(40)}: ${d.count} projects`);
    });

    // 4. User Course vs Domain Name matching check
    console.log('\n--- User Course Matching Check ---');
    const [users] = await conn.execute('SELECT email, course FROM user LIMIT 10');
    const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domainNamesNorm = domains.map(d => normalize(d.name));

    for (const u of users) {
      const uCourseNorm = normalize(u.course);
      const isMatched = domainNamesNorm.includes(uCourseNorm);
      console.log(`${isMatched ? '✅' : '❌'} User [${u.email}] Course [${u.course}] -> ${isMatched ? 'MATCHED' : 'NO MATCH'}`);
    }

    // 5. Legacy Task Table Check
    console.log('\n--- Legacy Task Table Sample ---');
    try {
      const [tasks] = await conn.execute('SELECT title FROM task LIMIT 5');
      tasks.forEach(t => console.log(`- ${t.title}`));
    } catch (e) {}

    console.log('\n--- DATABASE AUDIT END ---');
  } catch (err) {
    console.error('Audit failed:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

audit();
