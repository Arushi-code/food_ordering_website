const mongoose = require('mongoose');

const groupCartSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  hostUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hostName: { type: String, required: true },
  status: { type: String, enum: ['active', 'locked'], default: 'active' },
  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    items: [{
      menuItemId: { type: mongoose.Schema.Types.ObjectId },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 }
    }]
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupCart', groupCartSchema);
