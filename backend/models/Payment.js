const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Payment model — stores verified Razorpay payment transaction details.
 * Created only after successful server-side signature verification.
 */
const Payment = sequelize.define(
  'Payment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Razorpay payment ID (e.g., pay_XXXXXXXXXXXXX)',
    },
    razorpay_order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Razorpay order ID this payment belongs to',
    },
    razorpay_signature: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'HMAC SHA256 signature for verification',
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Amount in paise',
    },
    status: {
      type: DataTypes.ENUM('success', 'failed'),
      allowNull: false,
      defaultValue: 'success',
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Payment;
