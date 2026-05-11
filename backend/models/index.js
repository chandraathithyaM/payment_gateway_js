const sequelize = require('../config/database');
const Order = require('./Order');
const Payment = require('./Payment');

/**
 * Model associations:
 * - An Order has one Payment (created upon successful verification)
 * - A Payment belongs to one Order (linked via razorpay_order_id)
 */
Order.hasOne(Payment, {
  foreignKey: 'razorpay_order_id',
  sourceKey: 'order_id',
  as: 'payment',
});

Payment.belongsTo(Order, {
  foreignKey: 'razorpay_order_id',
  targetKey: 'order_id',
  as: 'order',
});

module.exports = {
  sequelize,
  Order,
  Payment,
};
