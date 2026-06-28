const model = require('../models/responseModel');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res) => {
  const data = await model.create(req.body);
  res.status(201).json({ status: 'success', data });
});
exports.getByRequest = catchAsync(async (req, res) => {
  const data = await model.getByRequest(req.params.requestId);
  res.status(200).json({ status: 'success', results: data.length, data });
});