import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL || '';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [address, setAddress] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to place an order.");
      navigate('/signin');
      return;
    }

    if (cartItems.length === 0) return;

    try {
      setStatus('processing');
      const cleanItems = cartItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }));

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: cleanItems,
          totalAmount: cartTotal,
          address // For future extension
        })
      });
      if (response.ok) {
        setStatus('success');
        clearCart();
        setTimeout(() => {
          navigate('/orders'); // Redirect to order history
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (cartItems.length === 0 && status !== 'success') {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Restaurants</button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ color: 'var(--success-color)' }}>Order Placed Successfully! 🎉</h2>
        <p>Redirecting to your orders...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>Checkout</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem' }}>
        <div>
          <h3>Delivery Details</h3>
          <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Delivery Address</label>
              <textarea 
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
                rows="3" 
                placeholder="Enter full delivery address"
              ></textarea>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={status === 'processing'}
              style={{ padding: '1rem', fontSize: '1.1rem' }}
            >
              {status === 'processing' ? 'Processing...' : `Pay ₹${cartTotal.toFixed(0)}`}
            </button>
            {status === 'error' && <p style={{ color: 'red' }}>Error placing order. Try again.</p>}
          </form>
        </div>
        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Order Summary</h3>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {cartItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.quantity}x {item.name}</span>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                  <button 
                    onClick={() => removeFromCart(item.name)} 
                    style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: '0.25rem' }}
                    title="Remove item"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
            <hr style={{ margin: '1rem 0' }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total</span>
              <span>₹{cartTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
