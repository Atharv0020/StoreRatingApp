const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const storeController = require('../controllers/storeController');

const router = express.Router();
router.use(auth);
router.use(roleCheck('user'));

router.get('/', storeController.listStores);
router.post('/:storeId/ratings', storeController.submitRating);

module.exports = router;