const mysql = require('mysql2/promise');
require('dotenv').config();

// ============ MySQL Connection Pool ============
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ============ Test Connection ============
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL Connected Successfully!');
        connection.release();
    } catch (err) {
        console.error('❌ MySQL Connection Failed:', err.message);
    }
})();

module.exports = pool;