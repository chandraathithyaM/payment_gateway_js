/**
 * Request validation helpers.
 * Throws descriptive errors for invalid inputs.
 */

/**
 * Validate create-order request body.
 * @param {Object} body - Request body
 * @throws {Error} If validation fails
 */
const validateCreateOrder = (body) => {
  const { amount, customerName } = body;

  if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
    const error = new Error('Customer name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    const error = new Error('Amount must be a positive number');
    error.statusCode = 400;
    throw error;
  }

  if (amount < 100) {
    const error = new Error('Minimum amount is ₹1 (100 paise)');
    error.statusCode = 400;
    throw error;
  }
};

/**
 * Validate verify-payment request body.
 * @param {Object} body - Request body
 * @throws {Error} If validation fails
 */
const validateVerifyPayment = (body) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id) {
    const error = new Error('Razorpay order ID is required');
    error.statusCode = 400;
    throw error;
  }

  if (!razorpay_payment_id) {
    const error = new Error('Razorpay payment ID is required');
    error.statusCode = 400;
    throw error;
  }

  if (!razorpay_signature) {
    const error = new Error('Razorpay signature is required');
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  validateCreateOrder,
  validateVerifyPayment,
};
