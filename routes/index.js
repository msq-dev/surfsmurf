const express = require('express');
const router = express.Router();
const index_controller = require('../controllers/indexController');
const login_controller = require('../controllers/loginController');
const checkAuthenticated = require('../utils/checkAuthenticated');

router.get('/', checkAuthenticated, index_controller.index);
router.delete('/logout', login_controller.logout)
router.post('/deletespot', index_controller.delete_spot);

module.exports = router;
