import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchOrder = () => {
      fetch(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
    };

    fetchOrder();
    // Poll for status updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id, user, navigate]);

  if (loading) return <div className="container" style={{ padding: '2rem 1rem' }}>Loading tracking info...</div>;
  if (!order || order.message) return <div className="container" style={{ padding: '2rem 1rem' }}>Order not found or unauthorized.</div>;

  const statuses = ['pending', 'preparing', 'out_for_delivery', 'delivered'];
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Order Tracking</h2>
      <p style={{ color: 'var(--text-muted)' }}>Order ID: {order._id}</p>

      <div style={{ margin: '3rem 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '4px', background: '#eee', zIndex: 1, transform: 'translateY(-50%)' }}></div>
        <div style={{ 
          position: 'absolute', top: '50%', left: 0, height: '4px', background: 'var(--primary-color)', zIndex: 1, transform: 'translateY(-50%)',
          width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
          transition: 'width 0.5s ease'
        }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          {statuses.map((s, idx) => (
            <div key={s} style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '30px', height: '30px', borderRadius: '50%', background: idx <= currentIndex ? 'var(--primary-color)' : '#fff', 
                border: `3px solid ${idx <= currentIndex ? 'var(--primary-color)' : '#eee'}`,
                margin: '0 auto', transition: 'all 0.5s ease'
              }}></div>
              <p style={{ marginTop: '0.5rem', fontWeight: idx <= currentIndex ? 'bold' : 'normal', color: idx <= currentIndex ? '#333' : '#999', fontSize: '0.875rem' }}>
                {s.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
        <h3>Order Details</h3>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {order.items.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{item.quantity}x {item.name}</span>
              <span>₹{(item.price * item.quantity).toFixed(0)}</span>
            </li>
          ))}
        </ul>
        <hr style={{ margin: '1rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Total Paid</span>
          <span>₹{order.totalAmount.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
