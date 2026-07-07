require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// ============ CORS Configuration ============
app.use(cors({
    origin: [
        'https://store-rating-app-pearl.vercel.app',
        'https://store-rating-app.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/stores', require('./src/routes/stores'));
app.use('/api/owner', require('./src/routes/owner'));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
});