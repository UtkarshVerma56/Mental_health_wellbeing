const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return next(new AppError('Not authenticated. Please log in.', 401));

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mnnit_secret_key_change_in_prod');
    req.user = { userId: decoded.id, userType: decoded.userType };
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.userType))
    return next(new AppError('You do not have permission for this action.', 403));
  next();
};

module.exports = { protect, restrictTo };