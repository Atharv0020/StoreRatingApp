const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const ownerController = require('../controllers/ownerController');

const router = express.Router();
router.use(auth);
router.use(roleCheck('owner'));

router.get('/dashboard', ownerController.getDashboard);

module.exports = router;