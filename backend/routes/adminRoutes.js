const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdmins);
router.post('/', adminController.createAdmin);
router.delete('/:id',adminController.deleteadmin);
router.put('/:id',adminController.editAdmin);
// You can add PUT, DELETE here

module.exports = router;