const pool = require('../config/db');

class Rating {
    // ============ CREATE OR UPDATE RATING ============
    static async create(userId, storeId, rating) {
        const [result] = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE rating = ?, updated_at = NOW()`,
            [userId, storeId, rating, rating]
        );
        return result;
    }

    // ============ FIND USER RATING FOR A STORE ============
    static async findUserRating(userId, storeId) {
        const [rows] = await pool.query(
            `SELECT rating FROM ratings WHERE user_id = ? AND store_id = ?`,
            [userId, storeId]
        );
        return rows[0] || null;
    }

    // ============ GET ALL RATINGS FOR A STORE ============
    static async getStoreRatings(storeId) {
        const [rows] = await pool.query(
            `SELECT r.id, r.rating, r.user_id, r.created_at, 
                    u.name, u.email 
             FROM ratings r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.store_id = ? 
             ORDER BY r.created_at DESC`,
            [storeId]
        );
        return rows;
    }

    // ============ GET AVERAGE RATING FOR A STORE ============
    static async getAverageRating(storeId) {
        const [rows] = await pool.query(
            `SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as rating_count
             FROM ratings 
             WHERE store_id = ?`,
            [storeId]
        );
        return rows[0];
    }

    // ============ COUNT ALL RATINGS ============
    static async countAll() {
        const [rows] = await pool.query('SELECT COUNT(*) as count FROM ratings');
        return rows[0].count;
    }

    // ============ DELETE RATING ============
    static async delete(userId, storeId) {
        const [result] = await pool.query(
            `DELETE FROM ratings WHERE user_id = ? AND store_id = ?`,
            [userId, storeId]
        );
        return result;
    }

    // ============ GET RATINGS BY USER ============
    static async getUserRatings(userId) {
        const [rows] = await pool.query(
            `SELECT r.*, s.name as store_name 
             FROM ratings r 
             JOIN stores s ON r.store_id = s.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC`,
            [userId]
        );
        return rows;
    }
}

module.exports = Rating;