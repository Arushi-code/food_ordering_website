import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';
import GroupOrder from './pages/GroupOrder';
import GroupOrdersHub from './pages/GroupOrdersHub';
import { Toaster } from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';
import './index.css';

function App() {
  const { cartItems, removeFromCart, clearCart, isCartOpen, toggleCart, cartTotal } = useCart();
  const { user } = useAuth();
  // Cart sidebar will now redirect to Checkout page instead of doing direct checkout

  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar />

      {/* Cart Sidebar */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Order</h3>
          <button className="close-btn" onClick={toggleCart}>&times;</button>
        </div>
        
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '4rem' }}>
              <ShoppingBag size={64} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              <p>Your cart is empty.</p>
              <button className="btn btn-primary" onClick={toggleCart} style={{ marginTop: '1rem' }}>Browse Restaurants</button>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>₹{item.price.toFixed(0)} x {item.quantity}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.name)} className="remove-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
            <Link 
              to="/checkout"
              className="btn btn-primary" 
              style={{ width: '100%', textAlign: 'center', textDecoration: 'none', display: 'inline-block' }} 
              onClick={toggleCart}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/orders/:id" element={<OrderTracking />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/group-order/:id" element={<GroupOrder />} />
        <Route path="/group-orders" element={<GroupOrdersHub />} />
      </Routes>
    </Router>
  );
}

export default App;
