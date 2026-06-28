const model = require('../models/requestModel');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res) => {
  const data = await model.create(req.body);
  res.status(201).json({ status: 'success', data });
});
exports.getByStudent = catchAsync(async (req, res) => {
  const data = await model.getByStudent(req.params.regNo);
  res.status(200).json({ status: 'success', results: data.length, data });
});
exports.updateStatus = catchAsync(async (req, res) => {
  const data = await model.updateStatus(req.params.id, req.body.status);
  res.status(200).json({ status: 'success', data });
});