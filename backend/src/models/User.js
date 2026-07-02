const pool = require('../config/db');

class User {
    // ============ CREATE USER ============
    static async create({ name, email, password_hash, address, role }) {
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)`,
            [name, email, password_hash, address, role]
        );
        return this.findById(result.insertId);
    }

    // ============ FIND USER BY EMAIL ============
    static async findByEmail(email) {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    // ============ FIND USER BY ID ============
    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT id, name, email, address, role, created_at FROM users WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    // ============ UPDATE PASSWORD ============
    static async updatePassword(userId, newPasswordHash) {
        await pool.query(
            'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?',
            [newPasswordHash, userId]
        );
    }

    // ============ LIST USERS WITH FILTERS ============
    static async list({ filters = {}, sort = 'name', order = 'ASC', page = 1, limit = 10 }) {
        let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
        const values = [];

        if (filters.name) {
            query += ` AND name LIKE ?`;
            values.push(`%${filters.name}%`);
        }
        if (filters.email) {
            query += ` AND email LIKE ?`;
            values.push(`%${filters.email}%`);
        }
        if (filters.address) {
            query += ` AND address LIKE ?`;
            values.push(`%${filters.address}%`);
        }
        if (filters.role) {
            query += ` AND role = ?`;
            values.push(filters.role);
        }

        const sortField = ['name', 'email', 'address', 'role'].includes(sort) ? sort : 'name';
        const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        values.push(limit, offset);

        const [rows] = await pool.query(query, values);
        return rows;
    }

    // ============ COUNT ALL USERS ============
    static async countAll() {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
        return rows[0].count;
    }

    // ============ UPDATE USER ============
    static async update(id, { name, email, address, role }) {
        const [result] = await pool.query(
            `UPDATE users 
             SET name = ?, email = ?, address = ?, role = ?, updated_at = NOW()
             WHERE id = ?`,
            [name, email, address, role, id]
        );
        return this.findById(id);
    }

    // ============ DELETE USER ============
    static async delete(id) {
        const [result] = await pool.query(
            `DELETE FROM users WHERE id = ?`,
            [id]
        );
        return result;
    }
}

module.exports = User;