const express = require('express');
const router = express.Router();
const login_controller = require('../controllers/loginController');
const checkNotAuthenticated = require('../utils/checkNotAuthenticated');

router.get('/', checkNotAuthenticated, login_controller.loginPage);
router.post('/', checkNotAuthenticated, login_controller.login);

module.exports = router;
