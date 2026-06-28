const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/login', ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.post('/reset-password', ctrl.forgotPassword);
router.post('/change-password', protect, ctrl.changePassword);
router.post('/logout', protect, ctrl.logout);
router.post('/refresh-token', protect, ctrl.refreshToken);

module.exports = router;