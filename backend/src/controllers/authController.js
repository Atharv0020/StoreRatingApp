const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============ REGISTER ============
exports.register = async (req, res) => {
    try {
        console.log('========================================');
        console.log('📝 REGISTER API CALLED');
        console.log('📤 Request Body:', req.body);
        console.log('========================================');

        const { name, email, password, address } = req.body;

        // Check if user exists
        console.log('🔍 Checking if email exists:', email);
        const existing = await User.findByEmail(email);
        
        if (existing) {
            console.log('❌ Email already registered:', email);
            return res.status(400).json({ error: 'Email already registered' });
        }
        console.log('✅ Email is available');

        // Hash password
        console.log('🔐 Hashing password...');
        const hashed = await bcrypt.hash(password, 10);
        console.log('✅ Password hashed successfully');

        // Create user
        console.log('👤 Creating new user...');
        const newUser = await User.create({ 
            name, 
            email, 
            password_hash: hashed, 
            address, 
            role: 'user' 
        });
        console.log('✅ User created successfully:', newUser);
        console.log('========================================');

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser 
        });
    } catch (err) {
        console.error('❌ REGISTER ERROR:', err);
        console.error('❌ Error Stack:', err.stack);
        console.log('========================================');
        res.status(500).json({ error: err.message });
    }
};

// ============ LOGIN ============
exports.login = async (req, res) => {
    try {
        console.log('========================================');
        console.log('🔑 LOGIN API CALLED');
        console.log('📤 Request Body:', req.body);
        console.log('========================================');

        const { email, password } = req.body;

        // Find user by email
        console.log('🔍 Finding user by email:', email);
        const user = await User.findByEmail(email);
        
        if (!user) {
            console.log('❌ User not found:', email);
            console.log('========================================');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log('✅ User found:', {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        // Compare password
        console.log('🔐 Comparing password...');
        const valid = await bcrypt.compare(password, user.password_hash);
        console.log('✅ Password valid?', valid);

        if (!valid) {
            console.log('❌ Invalid password for user:', email);
            console.log('========================================');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log('✅ Password matched successfully');

        // Generate JWT token
        console.log('🔑 Generating JWT token...');
        const token = jwt.sign(
            { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        console.log('✅ JWT Token generated');

        // Response
        const responseData = {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
        console.log('📤 Login Response:', responseData);
        console.log('✅ LOGIN SUCCESSFUL for:', email);
        console.log('========================================');

        res.json(responseData);
    } catch (err) {
        console.error('❌ LOGIN ERROR:', err);
        console.error('❌ Error Stack:', err.stack);
        console.log('========================================');
        res.status(500).json({ error: err.message });
    }
};

// ============ CHANGE PASSWORD ============
exports.changePassword = async (req, res) => {
    try {
        console.log('========================================');
        console.log('🔄 CHANGE PASSWORD API CALLED');
        console.log('📤 Request Body:', req.body);
        console.log('👤 User ID:', req.user?.id);
        console.log('========================================');

        const { oldPassword, newPassword } = req.body;

        // Find user
        console.log('🔍 Finding user by email:', req.user.email);
        const user = await User.findByEmail(req.user.email);
        
        if (!user) {
            console.log('❌ User not found');
            console.log('========================================');
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('✅ User found:', user.email);

        // Verify old password
        console.log('🔐 Verifying old password...');
        const valid = await bcrypt.compare(oldPassword, user.password_hash);
        console.log('✅ Old password valid?', valid);

        if (!valid) {
            console.log('❌ Old password is incorrect');
            console.log('========================================');
            return res.status(400).json({ error: 'Old password is incorrect' });
        }
        console.log('✅ Old password verified');

        // Hash new password
        console.log('🔐 Hashing new password...');
        const hashed = await bcrypt.hash(newPassword, 10);
        console.log('✅ New password hashed');

        // Update password
        console.log('💾 Updating password in database...');
        await User.updatePassword(req.user.id, hashed);
        console.log('✅ Password updated successfully');
        console.log('========================================');

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('❌ CHANGE PASSWORD ERROR:', err);
        console.error('❌ Error Stack:', err.stack);
        console.log('========================================');
        res.status(500).json({ error: err.message });
    }
};