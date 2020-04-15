const express = require('express');
const router = express.Router();
const search_controller = require('../controllers/searchController');

router.get('/', search_controller.result);
router.post('/savespot', search_controller.save_spot);

module.exports = router;
