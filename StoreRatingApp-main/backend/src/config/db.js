const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL Connected Successfully!');
        client.release();
    } catch (err) {
        console.error('❌ PostgreSQL Connection Failed:', err.message);
    }
})();

module.exports = pool;