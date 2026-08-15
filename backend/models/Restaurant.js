const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  tags: [{ type: String }],
  deliveryTime: { type: String },
  menu: [menuItemSchema],
  surpriseBags: {
    available: { type: Number, default: 0 },
    price: { type: Number },
    originalPrice: { type: Number },
    pickupTime: { type: String }
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
