const express = require('express');
const ctrl = require('../controllers/deanController');
const router = express.Router();

// Dean CRUD
router.post('/', ctrl.create);
router.get('/', ctrl.getAll);

// Dashboard
router.get('/dashboard/requests', ctrl.getDashboardRequests);

// Analytics — bar chart: full statistics
router.get('/dashboard/statistics', ctrl.getStatistics);

// Analytics — line chart: trends by period (?period=week|month|year)
router.get('/dashboard/trends', ctrl.getTrends);

module.exports = router;