const mongoose = require('mongoose');
const Order = require('../backend/models/Order');

async function checkDB() {
  await mongoose.connect('mongodb+srv://aarushijha12_db_user:vXzRxtAZcGZ6bujk@cluster0.ksdkizn.mongodb.net/?appName=Cluster0');
  const orders = await Order.find().populate('user', 'name');
  console.log('Total orders:', orders.length);
  orders.forEach(o => {
    console.log(`Order ID: ${o._id}, User: ${o.user ? o.user.name : 'Unknown'}, Status: ${o.status}`);
  });
  process.exit();
}
checkDB();
