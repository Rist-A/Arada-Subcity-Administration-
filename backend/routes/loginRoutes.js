const express = require('express');
const router = express.Router();
const authController = require('../controllers/loginController');

router.post('/', authController.loginUser);

module.exports = router;