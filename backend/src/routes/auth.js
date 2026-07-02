const express = require('express');
const { register, login, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const path = require('path');

// ============ Absolute Path for Validator ============
const validate = require(path.join(__dirname, '..', 'validators', 'validate'));

const router = express.Router();

router.post('/register', validate([
    body('name').isLength({ min: 5, max: 20 }).withMessage('Name must be between 5 and 20 characters'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/).withMessage('Password must be 8-16 characters, contain 1 uppercase and 1 special character'),
    body('address').isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
]), register);

router.post('/login', login);
router.put('/password', auth, changePassword);

module.exports = router;