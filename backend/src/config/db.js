const mysql = require('mysql2/promise');
require('dotenv').config();

// ============ MySQL Connection Pool ============
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rating_app',
    port: process.env.DB_PORT || 3306,
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
        console.error('Please check:');
        console.error('1. MySQL is running');
        console.error('2. DB_USER and DB_PASSWORD are correct');
        console.error('3. Database "rating_app" exists');
    }
})();

module.exports = pool;