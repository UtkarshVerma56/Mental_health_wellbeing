const express = require('express');
const ctrl = require('../controllers/adminController');
const router = express.Router();

router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
router.get('/dashboard/requests', ctrl.getDashboardRequests);

module.exports = router;