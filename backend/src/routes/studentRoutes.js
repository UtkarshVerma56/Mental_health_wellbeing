const express = require('express');
const ctrl = require('../controllers/studentController');
const router = express.Router();

router.post('/', ctrl.register);
router.get('/:regNo', ctrl.get);

module.exports = router;