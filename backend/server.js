require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const Restaurant = require('./models/Restaurant');
const Order = require('./models/Order');
const User = require('./models/User');
const GroupCart = require('./models/GroupCart');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/food_ordering';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json());

// Connect to DB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Seed DB with mock data if empty
async function seedDatabase() {
  // Clear existing restaurants to force re-seed with new menu items
  await Restaurant.deleteMany({});
  const count = await Restaurant.countDocuments();
  if (count === 0) {
    console.log('Seeding database with expanded mock restaurants...');
    const restaurants = [
      {
        name: 'Gourmet Burger Kitchen',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2000&auto=format&fit=crop',
        rating: 4.8,
        tags: ['Burgers', 'American', 'Non-veg'],
        deliveryTime: '20-30 min',
        surpriseBags: {
          available: 3,
          price: 150,
          originalPrice: 450,
          pickupTime: '9:00 PM - 10:00 PM'
        },
        menu: [
          { name: 'Classic Cheeseburger', price: 350, description: 'Beef patty, cheddar, lettuce, tomato'           , image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
          { name: 'Double Bacon Smash', price: 450, description: 'Two smashed patties, crispy bacon, house sauce'           , image: '/double_bacon_smash.jpg' },
          { name: 'Texas BBQ Burger', price: 420, description: 'Beef patty, onion rings, BBQ sauce, cheddar'           , image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80' },
          { name: 'Veggie Bean Burger', price: 280, description: 'Spicy black bean patty with avocado smash (Veg)'           , image: 'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&q=80' },
          { name: 'Truffle Fries', price: 180, description: 'Crispy fries with truffle oil and parmesan'           , image: '/truffle_fries.jpg' },
          { name: 'Loaded Nachos', price: 220, description: 'Tortilla chips, cheese sauce, jalapeños, salsa (Veg)'           , image: '/loaded_nachos.jpg' },
          { name: 'Vanilla Milkshake', price: 150, description: 'Hand-spun vanilla bean milkshake'           , image: '/vanilla_milkshake.png' },
          { name: 'BBQ Wings (6pcs)', price: 290, description: 'Crispy chicken wings tossed in hickory BBQ sauce'           , image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&q=80' },
          { name: 'Onion Rings', price: 130, description: 'Thick-cut, beer-battered onion rings'           , image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80' }
        ]
      },
      {
        name: 'Sushi Master',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2000&auto=format&fit=crop',
        rating: 4.9,
        tags: ['Japanese', 'Sushi', 'Non-veg'],
        deliveryTime: '40-50 min',
        menu: [
          { name: 'Spicy Tuna Roll', price: 550, description: 'Fresh tuna with spicy mayo'           , image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80' },
          { name: 'Salmon Sashimi (5pcs)', price: 650, description: 'Premium cut fresh salmon'           , image: '/salmon_sashimi.jpg' },
          { name: 'Dragon Roll', price: 600, description: 'Eel, cucumber, topped with avocado'           , image: '/dragon_roll.png' },
          { name: 'California Roll', price: 480, description: 'Crab meat, avocado, cucumber'           , image: '/california_roll.png' },
          { name: 'Veggie Sushi Roll', price: 350, description: 'Cucumber, avocado, and carrot roll (Veg)'           , image: '/veggie_sushi_roll.jpg' },
          { name: 'Miso Soup', price: 150, description: 'Traditional miso with tofu and wakame'           , image: '/miso_soup.png' },
          { name: 'Edamame', price: 180, description: 'Steamed soybeans with sea salt (Veg)'           , image: '/edamame.jpg' }
        ]
      },
      {
        name: 'Taco Fiesta',
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=2000&auto=format&fit=crop',
        rating: 4.6,
        tags: ['Mexican', 'Tacos', 'Veg', 'Non-veg'],
        deliveryTime: '15-25 min',
        menu: [
          { name: 'Al Pastor Tacos (3)', price: 320, description: 'Marinated pork with pineapple'           , image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80' },
          { name: 'Carne Asada Burrito', price: 380, description: 'Grilled steak, rice, beans, guac'           , image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&q=80' },
          { name: 'Chicken Enchiladas', price: 350, description: 'Corn tortillas stuffed with chicken, topped with red sauce'           , image: '/chicken_enchiladas.jpg' },
          { name: 'Veggie Fajita Bowl', price: 290, description: 'Grilled peppers, onions, black beans, and rice (Veg)'           , image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
          { name: 'Mushroom Tacos (3)', price: 280, description: 'Sautéed mushrooms, onions, cilantro, salsa (Veg)'           , image: '/mushroom_tacos.jpg' },
          { name: 'Chips & Queso', price: 220, description: 'Warm tortilla chips with melted cheese dip (Veg)'           , image: '/chips_and_queso.png' },
          { name: 'Chicken Quesadilla', price: 280, description: 'Grilled chicken and melted cheese'           , image: '/chicken_quesadilla.jpg' },
          { name: 'Churros', price: 180, description: 'Cinnamon sugar dusted with chocolate dip (Veg)'           , image: '/churros.jpg' }
        ]
      },
      {
        name: 'Green Bowl Cafe',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2000&auto=format&fit=crop',
        rating: 4.7,
        tags: ['Healthy', 'Vegan', 'Veg'],
        deliveryTime: '25-35 min',
        menu: [
          { name: 'Quinoa Power Bowl', price: 380, description: 'Quinoa, roasted sweet potato, kale, tahini dressing'           , image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80' },
          { name: 'Acai Smoothie Bowl', price: 350, description: 'Blended acai topped with granola and fresh fruit'           , image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=500&q=80' },
          { name: 'Avocado Toast', price: 280, description: 'Smashed avocado on artisanal sourdough'           , image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500&q=80' },
          { name: 'Greek Salad', price: 250, description: 'Cucumber, tomatoes, feta cheese, olives, olive oil'           , image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80' },
          { name: 'Green Detox Juice', price: 220, description: 'Cold-pressed celery, apple, ginger, spinach'           , image: '/green_detox_juice.png' },
          { name: 'Vegan Chocolate Brownie', price: 160, description: 'Rich fudge brownie made with almond flour'           , image: '/vegan_chocolate_brownie.png' }
        ]
      },
      {
        name: 'Dragon Wok',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2000&auto=format&fit=crop',
        rating: 4.5,
        tags: ['Chinese', 'Asian', 'Veg', 'Non-veg'],
        deliveryTime: '30-40 min',
        menu: [
          { name: 'Kung Pao Chicken', price: 380, description: 'Spicy stir-fried chicken with peanuts and vegetables'           , image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&q=80' },
          { name: 'Chilli Paneer', price: 320, description: 'Spicy cottage cheese tossed in bell peppers and onions (Veg)'           , image: 'https://images.unsplash.com/photo-1551881192-002e02ad3d87?w=500&q=80' },
          { name: 'Veg Hakka Noodles', price: 240, description: 'Stir-fried noodles with mixed vegetables (Veg)'           , image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80' },
          { name: 'Chicken Fried Rice', price: 280, description: 'Wok-tossed rice with chicken, eggs, and veggies'           , image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80' },
          { name: 'Pork Dumplings (6pcs)', price: 300, description: 'Steamed pork dumplings with soy dipping sauce'           , image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80' },
          { name: 'Veg Spring Rolls (4pcs)', price: 180, description: 'Crispy vegetable spring rolls (Veg)'           , image: '/veg_spring_rolls.jpg' },
          { name: 'Sweet and Sour Chicken', price: 360, description: 'Crispy chicken chunks in sweet and sour glaze'           , image: '/sweet_and_sour_chicken.png' }
        ]
      },
      {
        name: 'Mamma Mia Pizzeria',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=2000&auto=format&fit=crop',
        rating: 4.8,
        tags: ['Italian', 'Pizza', 'Veg', 'Non-veg'],
        deliveryTime: '35-45 min',
        menu: [
          { name: 'Margherita Pizza', price: 450, description: 'Classic pizza with San Marzano tomatoes, mozzarella, and basil (Veg)'           , image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80' },
          { name: 'Pepperoni Pizza', price: 550, description: 'Loaded with Italian pepperoni and cheese'           , image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80' },
          { name: 'Mushroom & Truffle Pizza', price: 580, description: 'White sauce, mushrooms, truffle oil, mozzarella (Veg)'           , image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80' },
          { name: 'Penne Arrabbiata', price: 340, description: 'Pasta in a spicy tomato and garlic sauce (Veg)'           , image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80' },
          { name: 'Chicken Alfredo', price: 420, description: 'Creamy pasta with grilled chicken'           , image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&q=80' },
          { name: 'Garlic Bread with Cheese', price: 220, description: 'Oven-baked garlic bread topped with mozzarella (Veg)'           , image: '/garlic_bread.png' },
          { name: 'Tiramisu', price: 280, description: 'Classic Italian coffee-flavored dessert (Veg)'           , image: '/tiramisu.png' }
        ]
      },
      {
        name: 'Seoul BBQ Kitchen',
        image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=2000&auto=format&fit=crop',
        rating: 4.7,
        tags: ['Korean', 'Asian', 'Veg', 'Non-veg'],
        deliveryTime: '40-50 min',
        menu: [
          { name: 'Beef Bulgogi', price: 580, description: 'Marinated thinly sliced beef grilled to perfection'           , image: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=500&q=80' },
          { name: 'Pork Belly (Samgyeopsal)', price: 550, description: 'Grilled thick-cut pork belly slices'           , image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=500&q=80' },
          { name: 'Bibimbap (Veg)', price: 400, description: 'Mixed rice bowl with vegetables and fried egg (Veg)'           , image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=500&q=80' },
          { name: 'Korean Fried Chicken (6pcs)', price: 450, description: 'Crispy double-fried chicken in spicy gochujang sauce'           , image: '/korean_fried_chicken.jpg' },
          { name: 'Kimchi Fried Rice', price: 350, description: 'Spicy fried rice with fermented kimchi and pork'           , image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80' },
          { name: 'Tteokbokki', price: 300, description: 'Spicy stir-fried rice cakes (Veg)'           , image: '/tteokbokki.png' }
        ]
      },
      {
        name: 'Spice of India',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2000&auto=format&fit=crop',
        rating: 4.9,
        tags: ['Indian', 'Veg', 'Non-veg'],
        deliveryTime: '25-40 min',
        menu: [
          { name: 'Butter Chicken', price: 420, description: 'Tender chicken in a rich, creamy tomato gravy'           , image: '/butter_chicken.png' },
          { name: 'Mutton Rogan Josh', price: 550, description: 'Classic Kashmiri style lamb curry'           , image: '/mutton_rogan_josh.jpg' },
          { name: 'Paneer Tikka Masala', price: 380, description: 'Grilled cottage cheese cubes in spiced curry (Veg)'           , image: '/paneer_tikka_masala.png' },
          { name: 'Palak Paneer', price: 350, description: 'Cottage cheese cubes in a creamy spinach gravy (Veg)'           , image: '/palak_paneer.jpg' },
          { name: 'Dal Makhani', price: 280, description: 'Slow-cooked black lentils with butter and cream (Veg)'           , image: '/dal_makhani.jpg' },
          { name: 'Chicken Biryani', price: 450, description: 'Aromatic basmati rice cooked with marinated chicken and spices'           , image: '/chicken_biryani.jpg' },
          { name: 'Veg Biryani', price: 350, description: 'Basmati rice cooked with mixed vegetables and spices (Veg)'           , image: '/veg_biryani.png' },
          { name: 'Garlic Naan', price: 80, description: 'Soft flatbread topped with garlic and butter (Veg)'           , image: '/garlic_naan.jpg' },
          { name: 'Samosa (2pcs)', price: 100, description: 'Crispy pastry filled with spiced potatoes and peas (Veg)'           , image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80' }
        ]
      },
      {
        name: 'Sweet Tooth Bakery',
        image: 'https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=2000&auto=format&fit=crop',
        rating: 4.9,
        tags: ['Sweets', 'Cakes', 'Desserts', 'Veg'],
        deliveryTime: '15-25 min',
        menu: [
          { name: 'Red Velvet Cupcake', price: 120, description: 'Moist red velvet cake with cream cheese frosting'           , image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&q=80' },
          { name: 'Chocolate Truffle Cake (1kg)', price: 950, description: 'Rich and dense chocolate cake perfect for birthdays'           , image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
          { name: 'Black Forest Cake (500g)', price: 550, description: 'Classic layered chocolate cake with cherries and whipped cream'           , image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80' },
          { name: 'Blueberry Cheesecake Slice', price: 250, description: 'Classic New York style cheesecake with blueberry topping'           , image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' },
          { name: 'Macarons (Box of 5)', price: 400, description: 'Assorted flavors: Pistachio, Raspberry, Lemon, Vanilla, Chocolate'           , image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&q=80' },
          { name: 'Gulab Jamun (2pcs)', price: 100, description: 'Classic Indian sweet soaked in rose syrup'           , image: '/gulab_jamun.png' },
          { name: 'Rasmalai (2pcs)', price: 120, description: 'Soft cottage cheese dumplings in sweetened flavored milk'           , image: '/rasmalai.jpg' }
        ]
      }
    ];
    await Restaurant.insertMany(restaurants);
    console.log('Database seeded with expanded data.');
  }

  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin user seeded (email: admin@example.com, password: password123)');
  }
}

// Auth Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' })
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' })
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Routes
app.get('/api/restaurants/deals/surprise-bags', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ 'surpriseBags.available': { $gt: 0 } });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Protect order route so only logged in users can order (optional, left unprotected for MVP ease, but we can protect it)
// We will leave it open for now or we can protect it. Let's protect it.
app.post('/api/orders', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const newOrder = new Order({ user: req.user._id, items, totalAmount });
    await newOrder.save();
    
    // Simulate order progress
    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: 'preparing' });
    }, 15000); // 15 seconds

    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: 'out_for_delivery' });
    }, 30000); // 30 seconds

    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: 'delivered' });
    }, 45000); // 45 seconds

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User Profile Routes
app.get('/api/users/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: jwt.sign({ id: updatedUser._id }, JWT_SECRET, { expiresIn: '30d' })
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/users/favorites/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.favorites.includes(req.params.id)) {
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
    } else {
      user.favorites.push(req.params.id);
    }
    await user.save();
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders Routes
app.get('/api/orders/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/orders/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      // Allow only the owner or an admin to view
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Routes
app.get('/api/orders', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Restaurant Management Routes
app.post('/api/restaurants', protect, admin, async (req, res) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create restaurant', details: err.message });
  }
});

app.delete('/api/restaurants/:id', protect, admin, async (req, res) => {
  try {
    const deleted = await Restaurant.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Group Cart Routes
app.post('/api/group-cart/start', protect, async (req, res) => {
  try {
    const { restaurantId } = req.body;
    const newSession = new GroupCart({
      restaurantId,
      hostUserId: req.user._id,
      hostName: req.user.name,
      members: [{ userId: req.user._id, name: req.user.name, items: [] }]
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group cart' });
  }
});

app.get('/api/group-cart/my', protect, async (req, res) => {
  try {
    const carts = await GroupCart.find({
      $or: [
        { hostUserId: req.user._id },
        { 'members.name': req.user.name } // Matches if user is a guest but has same name, or we can use userId but currently the frontend might only push name for guests.
      ]
    }).populate('restaurantId').sort({ createdAt: -1 });
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch your group carts' });
  }
});

app.get('/api/group-cart/:id', async (req, res) => {
  try {
    const session = await GroupCart.findById(req.params.id).populate('restaurantId');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/group-cart/:id/add', async (req, res) => {
  try {
    const { name, item } = req.body; // name could be guest or req.user.name
    const session = await GroupCart.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.status === 'locked') return res.status(400).json({ message: 'Session is locked' });

    const memberIndex = session.members.findIndex(m => m.name === name);
    if (memberIndex >= 0) {
      session.members[memberIndex].items.push(item);
    } else {
      session.members.push({ name, items: [item] });
    }
    
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

app.post('/api/group-cart/:id/checkout', protect, async (req, res) => {
  try {
    const cart = await GroupCart.findById(req.params.id);
    if (!cart) return res.status(404).json({ message: 'Session not found' });
    
    if (cart.hostUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the host can lock and checkout the group order' });
    }
    if (cart.status === 'locked') {
      return res.status(400).json({ message: 'Group order is already locked and checked out' });
    }

    cart.status = 'locked';
    await cart.save();

    // Aggregate items
    const allItems = [];
    let totalAmount = 0;
    cart.members.forEach(member => {
      member.items.forEach(item => {
        allItems.push({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        });
        totalAmount += item.price * item.quantity;
      });
    });

    if (allItems.length === 0) {
      return res.status(400).json({ message: 'Cannot checkout an empty group cart' });
    }

    // Create a real Order
    const newOrder = new Order({
      user: req.user._id,
      items: allItems,
      totalAmount
    });
    await newOrder.save();

    // Simulate order progress
    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: 'preparing' });
    }, 15000); // 15 seconds

    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: 'out_for_delivery' });
    }, 30000); // 30 seconds

    setTimeout(async () => {
      await Order.findByIdAndUpdate(newOrder._id, { status: 'delivered' });
    }, 45000); // 45 seconds

    res.json({ message: 'Checkout successful', orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to checkout group cart' });
  }
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve the React app for any other requests
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
