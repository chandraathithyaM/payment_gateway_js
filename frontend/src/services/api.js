import axios from 'axios';

/**
 * Axios instance configured with the backend base URL.
 * All API calls go through this instance for consistent config.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Create a Razorpay order on the backend.
 * @param {number} amount - Amount in paise (e.g., 50000 for ₹500)
 * @param {string} customerName - Customer's name
 * @returns {Promise<Object>} { success, order: { id, amount, currency, key_id } }
 */
export const createOrder = async (amount, customerName) => {
  const response = await api.post('/api/payment/create-order', {
    amount,
    customerName,
  });
  return response.data;
};

/**
 * Verify a Razorpay payment signature on the backend.
 * @param {Object} paymentData - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Promise<Object>} { success, message, payment }
 */
export const verifyPayment = async (paymentData) => {
  const response = await api.post('/api/payment/verify', paymentData);
  return response.data;
};

/**
 * Get the status of an order by its Razorpay order ID.
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<Object>} { success, order }
 */
export const getPaymentStatus = async (orderId) => {
  const response = await api.get(`/api/payment/status/${orderId}`);
  return response.data;
};

export default api;
