require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');
const storeRoutes = require('./src/routes/stores');
const ownerRoutes = require('./src/routes/owner');

const app = express();

// ============ CORS Configuration ============
app.use(cors({
    origin: ['https://store-rating-frontend.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// ============ Routes ============
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

// ============ Health Check ============
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// ============ Error Handler ============
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message });
});

// ============ Start Server ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});