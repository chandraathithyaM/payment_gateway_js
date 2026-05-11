const Razorpay = require('razorpay');
const crypto = require('crypto');

/**
 * Razorpay service — wraps the Razorpay SDK for order creation
 * and implements HMAC SHA256 signature verification.
 *
 * The secret key is NEVER exposed to the frontend.
 */

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay order.
 * @param {number} amount - Amount in paise (e.g., 50000 for ₹500)
 * @param {string} currency - Currency code (default: INR)
 * @param {string} receipt - Unique receipt identifier
 * @returns {Promise<Object>} Razorpay order object
 */
const createOrder = async (amount, currency = 'INR', receipt) => {
  const options = {
    amount,
    currency,
    receipt,
    payment_capture: 1, // Auto-capture payment
  };

  const order = await razorpayInstance.orders.create(options);
  return order;
};

/**
 * Verify Razorpay payment signature using HMAC SHA256.
 * This ensures the payment response hasn't been tampered with.
 *
 * Signature = HMAC_SHA256(order_id + "|" + payment_id, secret)
 *
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Signature from Razorpay checkout response
 * @returns {boolean} Whether the signature is valid
 */
const verifySignature = (orderId, paymentId, signature) => {
  const body = orderId + '|' + paymentId;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};

module.exports = {
  razorpayInstance,
  createOrder,
  verifySignature,
};
