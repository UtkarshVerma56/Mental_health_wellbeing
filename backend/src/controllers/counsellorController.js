const model = require('../models/counsellorModel');
const requestModel = require('../models/requestModel'); // <-- ADDED
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res) => {
  const data = await model.create(req.body);
  res.status(201).json({ status: 'success', data });
});

exports.getAll = catchAsync(async (req, res) => {
  const data = await model.getAll();
  res.status(200).json({ status: 'success', results: data.length, data });
});

// --- NEW FUNCTION ---
exports.getDashboardRequests = catchAsync(async (req, res) => {
  const data = await requestModel.getAllForCounsellor();
  res.status(200).json({ status: 'success', results: data.length, data });
});