const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const adminController = require('../controllers/adminController');
const { body } = require('express-validator');
const path = require('path');

// ============ Fixed Path for Validator ============
const validate = require(path.join(__dirname, '..', 'validators', 'validate'));

const router = express.Router();
router.use(auth);
router.use(roleCheck('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.listUsers);

router.post('/users', validate([
    body('name').isLength({ min: 5, max: 20 }),
    body('email').isEmail(),
    body('password').matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/),
    body('address').isLength({ max: 400 }),
    body('role').isIn(['admin', 'user', 'owner']),
]), adminController.createUser);

router.get('/stores', adminController.listStores);
router.post('/stores', validate([
    body('name').notEmpty(),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
]), adminController.createStore);

module.exports = router;