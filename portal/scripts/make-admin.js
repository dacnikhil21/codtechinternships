// scripts/make-admin.js
// Utility to promote a user to admin role via CLI
const mysql = require('mysql2/promise');

async function makeAdmin(email) {
  if (!email) {
    console.error('❌ Please provide an email address.');
    process.exit(1);
  }

  const dbConfig = {
    host: '127.0.0.1',
    user: 'u371402898_ctadmin',
    password: 'Codtech2002',
    database: 'u371402898_ctintern'
  };

  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log(`📡 Connected to database...`);

    const [result] = await conn.execute(
      'UPDATE user SET role = ? WHERE email = ?',
      ['admin', email.toLowerCase().trim()]
    );

    if (result.affectedRows > 0) {
      console.log(`✅ SUCCESS: User with email "${email}" has been promoted to ADMIN.`);
    } else {
      console.error(`❌ FAILED: No user found with email "${email}".`);
    }

    await conn.end();
  } catch (err) {
    console.error('❌ ERROR:', err.message);
  }
}

const targetEmail = process.argv[2];
makeAdmin(targetEmail);
