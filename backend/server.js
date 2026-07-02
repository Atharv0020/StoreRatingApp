const express = require('express');
const cors = require('cors');
const app = express();

// CORS
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Root
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Routes (Commented - Debug साठी)
// const authRoutes = require('./src/routes/auth');
// const adminRoutes = require('./src/routes/admin');
// const storeRoutes = require('./src/routes/stores');
// const ownerRoutes = require('./src/routes/owner');

// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/stores', storeRoutes);
// app.use('/api/owner', ownerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});