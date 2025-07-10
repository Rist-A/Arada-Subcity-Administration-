const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdmins);
router.post('/', adminController.createAdmin);
router.delete('/',adminController.deleteadmin);
router.put('/',adminController.editAdmin);
// You can add PUT, DELETE here

module.exports = router;