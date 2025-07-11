const express = require('express');
const router = express.Router();
const controller = require('../controllers/departmentLeaderController');

router.get('/', controller.getAllLeaders);
router.post('/', controller.createLeader);
router.put('/:id', controller.updateLeader);
router.delete('/:id', controller.deleteLeader);

module.exports = router;