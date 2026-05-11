const { Order, Payment } = require('../models');
const razorpayService = require('../services/razorpayService');
const { validateCreateOrder, validateVerifyPayment } = require('../utils/validator');

/**
 * POST /api/payment/create-order
 *
 * Creates a Razorpay order and saves it to the database.
 * Returns the order details needed by the frontend to open the checkout popup.
 */
const createOrder = async (req, res, next) => {
  try {
    const { amount, customerName } = req.body;

    // Validate input
    validateCreateOrder({ amount, customerName });

    // Generate a unique receipt ID
    const receipt = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Create order via Razorpay API
    const razorpayOrder = await razorpayService.createOrder(amount, 'INR', receipt);

    // Save order to PostgreSQL
    const order = await Order.create({
      order_id: razorpayOrder.id,
      customer_name: customerName.trim(),
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      status: 'created',
    });

    console.log(`✅ Order created: ${razorpayOrder.id} for ${customerName}`);

    res.status(201).json({
      success: true,
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payment/verify
 *
 * Verifies the Razorpay payment signature using HMAC SHA256.
 * On success, updates the order status and creates a payment record.
 */
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate input
    validateVerifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

    // Verify signature (HMAC SHA256)
    const isValid = razorpayService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      console.warn(`⚠️ Invalid signature for order: ${razorpay_order_id}`);
      // Update order status to failed
      await Order.update({ status: 'failed' }, { where: { order_id: razorpay_order_id } });

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.',
      });
    }

    // Find the order
    const order = await Order.findOne({ where: { order_id: razorpay_order_id } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order status to paid
    await order.update({ status: 'paid' });

    // Create payment record
    const payment = await Payment.create({
      payment_id: razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount: order.amount,
      status: 'success',
    });

    console.log(`✅ Payment verified: ${razorpay_payment_id} for order ${razorpay_order_id}`);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: order.amount,
        currency: order.currency,
        customer_name: order.customer_name,
        status: 'success',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payment/status/:id
 *
 * Retrieves the status of an order and its associated payment.
 * :id is the Razorpay order ID (e.g., order_XXXXXXXXXXXXX)
 */
const getPaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required',
      });
    }

    const order = await Order.findOne({
      where: { order_id: id },
      include: [{ model: Payment, as: 'payment' }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order: {
        order_id: order.order_id,
        customer_name: order.customer_name,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        created_at: order.created_at,
        payment: order.payment
          ? {
              payment_id: order.payment.payment_id,
              status: order.payment.status,
              created_at: order.payment.created_at,
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentStatus,
};
