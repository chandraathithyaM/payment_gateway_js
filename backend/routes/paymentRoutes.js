const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * Payment API Routes
 *
 * POST /api/payment/create-order  → Create a new Razorpay order
 * POST /api/payment/verify        → Verify payment signature
 * GET  /api/payment/status/:id    → Get order + payment status
 */

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.get('/status/:id', paymentController.getPaymentStatus);

module.exports = router;
