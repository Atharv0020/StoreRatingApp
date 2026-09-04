const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const adminController = require('../controllers/adminController');

const router = express.Router();
router.use(auth);
router.use(roleCheck('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.listUsers);
router.post('/users', adminController.createUser);
router.get('/stores', adminController.listStores);
router.post('/stores', adminController.createStore);

module.exports = router;