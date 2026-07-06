const express = require('express');
const { register, login, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// ============ Simple Routes without Validator ============
router.post('/register', register);
router.post('/login', login);
router.put('/password', auth, changePassword);

module.exports = router;