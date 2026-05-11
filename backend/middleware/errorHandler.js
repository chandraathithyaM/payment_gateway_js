/**
 * Centralized error handling middleware.
 * Catches all errors thrown in routes/controllers and returns
 * a consistent JSON error response.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors.map((e) => e.message),
    });
  }

  // Sequelize database errors
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Database error',
    });
  }

  // Razorpay API errors
  if (err.statusCode && err.error) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.error?.description || 'Razorpay API error',
    });
  }

  // Custom application errors (from validators)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
