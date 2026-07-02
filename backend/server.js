// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS सेटिंग
app.use(cors({
    origin: ['https://store-rating-frontend.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// हेल्थ चेक एंडपॉइंट (सर्वात सोपा)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// एरर हैंडलर
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
});

// सर्व्हर सुरू करा
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});