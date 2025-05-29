const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/user', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/verifytoken', userController.checkIsAuthenticated);
router.get('/logout', userController.handleLogout);

module.exports = router;