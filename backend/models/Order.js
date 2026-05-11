const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Order model — stores Razorpay order details.
 * Amount is stored in paise (smallest currency unit).
 */
const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Razorpay order ID (e.g., order_XXXXXXXXXXXXX)',
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Amount in paise (e.g., 50000 = ₹500)',
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'INR',
    },
    status: {
      type: DataTypes.ENUM('created', 'paid', 'failed'),
      allowNull: false,
      defaultValue: 'created',
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Order;
