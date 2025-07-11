const express = require('express');
const router = express.Router();
const requestTypeController = require('../controllers/requestTypeController');

router.get('/', requestTypeController.getAllRequestTypes);
router.post('/', requestTypeController.createRequestType);
router.put('/:id', requestTypeController.updateRequestType);
router.delete('/:id', requestTypeController.deleteRequestType);

module.exports = router;