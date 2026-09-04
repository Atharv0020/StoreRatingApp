const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
    // सोपा पासवर्ड
    const password = 'Admin@123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('========================================');
    console.log('📝 Creating New Admin User');
    console.log('========================================');
    console.log('Email: admin@admin.com');
    console.log('Password:', password);
    console.log('Hash:', hashedPassword);
    console.log('========================================');
    
    // Database connection
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root123',
        database: process.env.DB_NAME || 'rating_app'
    });
    
    // Delete all admin users
    await connection.execute('DELETE FROM users WHERE role = ?', ['admin']);
    console.log('✅ All admins deleted');
    
    // Insert new admin
    await connection.execute(
        'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin User', 'admin@admin.com', hashedPassword, 'Pune India', 'admin']
    );
    console.log('✅ New admin created');
    
    // Verify
    const [rows] = await connection.execute('SELECT id, name, email, role FROM users WHERE email = ?', ['admin@admin.com']);
    console.log('✅ Admin user:', rows[0]);
    
    await connection.end();
    console.log('========================================');
    console.log('🎉 Admin created successfully!');
    console.log('Login with:');
    console.log('Email: admin@admin.com');
    console.log('Password:', password);
    console.log('========================================');
}

createAdmin().catch(console.error);