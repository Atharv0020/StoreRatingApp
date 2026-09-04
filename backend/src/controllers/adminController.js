const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const bcrypt = require('bcryptjs');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countAll();
        const totalStores = await Store.countAll();
        const totalRatings = await Rating.countAll();
        res.json({ totalUsers, totalStores, totalRatings });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const { name, email, address, role, sort, order, page, limit } = req.query;
        const users = await User.list({
            filters: { name, email, address, role },
            sort: sort || 'name',
            order: order || 'ASC',
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;
        if (!['admin', 'user', 'owner'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const existing = await User.findByEmail(email);
        if (existing) return res.status(400).json({ error: 'Email already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password_hash: hashed, address, role });
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listStores = async (req, res) => {
    try {
        const { name, email, address, sort, order, page, limit } = req.query;
        const stores = await Store.list({
            filters: { name, email, address },
            sort: sort || 'name',
            order: order || 'ASC',
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
        });
        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createStore = async (req, res) => {
    try {
        const { name, email, address, owner_id } = req.body;
        const store = await Store.create({ name, email, address, owner_id });
        res.status(201).json(store);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};