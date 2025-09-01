const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  total: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
