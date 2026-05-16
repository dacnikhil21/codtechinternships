const mysql = require('mysql2/promise');

async function checkTable() {
    const pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'u371402898_ctadmin',
        password: 'Codtech2002',
        database: 'u371402898_ctintern',
        waitForConnections: true,
        connectionLimit: 3
    });

    try {
        const [rows] = await pool.execute("SHOW TABLES LIKE 'support_requests'");
        if (rows.length > 0) {
            console.log("Table 'support_requests' exists.");
        } else {
            console.log("Table 'support_requests' DOES NOT exist.");
        }
    } catch (err) {
        console.error("Database error:", err.message);
    } finally {
        await pool.end();
    }
}

checkTable();
