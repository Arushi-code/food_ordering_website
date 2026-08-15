const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'preparing', 'out_for_delivery', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
