const pool = require('../config/db');

class Store {
    // ============ CREATE STORE ============
    static async create({ name, email, address, owner_id }) {
        const [result] = await pool.query(
            `INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)`,
            [name, email, address, owner_id]
        );
        return this.findById(result.insertId);
    }

    // ============ FIND STORE BY ID ============
    static async findById(id) {
        const [rows] = await pool.query(
            `SELECT s.*, u.name as owner_name 
             FROM stores s 
             LEFT JOIN users u ON s.owner_id = u.id 
             WHERE s.id = ?`,
            [id]
        );
        return rows[0];
    }

    // ============ FIND STORE BY EMAIL ============
    static async findByEmail(email) {
        const [rows] = await pool.query(
            `SELECT * FROM stores WHERE email = ?`,
            [email]
        );
        return rows[0];
    }

    // ============ LIST STORES WITH FILTERS ============
    static async list({ filters = {}, sort = 'name', order = 'ASC', page = 1, limit = 10 }) {
        let query = `SELECT s.id, s.name, s.email, s.address, s.owner_id, 
                     ROUND(AVG(r.rating), 1) as avg_rating, 
                     COUNT(r.id) as rating_count
                     FROM stores s 
                     LEFT JOIN ratings r ON s.id = r.store_id
                     WHERE 1=1`;
        const values = [];

        if (filters.name) {
            query += ` AND s.name LIKE ?`;
            values.push(`%${filters.name}%`);
        }
        if (filters.address) {
            query += ` AND s.address LIKE ?`;
            values.push(`%${filters.address}%`);
        }
        if (filters.email) {
            query += ` AND s.email LIKE ?`;
            values.push(`%${filters.email}%`);
        }

        query += ` GROUP BY s.id`;
        
        const sortField = ['name', 'email', 'address'].includes(sort) ? `s.${sort}` : 's.name';
        const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        query += ` ORDER BY ${sortField} ${sortOrder}`;

        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        values.push(limit, offset);

        const [rows] = await pool.query(query, values);
        return rows;
    }

    // ============ COUNT ALL STORES ============
    static async countAll() {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM stores');
        return rows[0].count;
    }

    // ============ FIND STORES BY OWNER ============
    static async findByOwner(ownerId) {
        const [rows] = await pool.query(
            `SELECT s.*, ROUND(AVG(r.rating), 1) as avg_rating 
             FROM stores s 
             LEFT JOIN ratings r ON s.id = r.store_id 
             WHERE s.owner_id = ? 
             GROUP BY s.id`,
            [ownerId]
        );
        return rows;
    }

    // ============ UPDATE STORE ============
    static async update(id, { name, email, address, owner_id }) {
        const [result] = await pool.query(
            `UPDATE stores 
             SET name = ?, email = ?, address = ?, owner_id = ?, updated_at = NOW()
             WHERE id = ?`,
            [name, email, address, owner_id, id]
        );
        return this.findById(id);
    }

    // ============ DELETE STORE ============
    static async delete(id) {
        const [result] = await pool.query(
            `DELETE FROM stores WHERE id = ?`,
            [id]
        );
        return result;
    }
}

module.exports = Store;