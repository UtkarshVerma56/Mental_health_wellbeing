const express = require('express');
const ctrl = require('../controllers/requestController');
const router = express.Router();

router.post('/', ctrl.create);
router.get('/student/:regNo', ctrl.getByStudent);
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;