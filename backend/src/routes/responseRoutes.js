const express = require('express');
const ctrl = require('../controllers/responseController');
const router = express.Router();

router.post('/', ctrl.create);
router.get('/request/:requestId', ctrl.getByRequest);

module.exports = router;