import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReceiptText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetch(`${API_URL}/api/orders/myorders`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => res.json())
    .then(data => {
      setOrders(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user, navigate]);

  if (loading) return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div className="skeleton" style={{ height: '100px', marginBottom: '1rem' }}></div>
      <div className="skeleton" style={{ height: '100px', marginBottom: '1rem' }}></div>
      <div className="skeleton" style={{ height: '100px' }}></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="container" 
      style={{ padding: '2rem 1rem' }}
    >
      <h2 style={{ marginBottom: '1.5rem' }}>My Order History</h2>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--surface)', borderRadius: '12px' }}>
          <ReceiptText size={64} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1rem' }} />
          <h3 style={{ marginBottom: '0.5rem' }}>No orders yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Looks like you haven't placed any orders.</p>
          <Link to="/" className="btn btn-primary">Start Exploring</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={order._id} 
              className="card"
              style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Order #{order._id.substring(order._id.length - 6)}</p>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                <p style={{ margin: 0 }}>Total: ₹{order.totalAmount.toFixed(0)} - {order.items.length} items</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '999px', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  background: order.status === 'delivered' ? '#dcfce7' : '#fef3c7',
                  color: order.status === 'delivered' ? '#166534' : '#92400e',
                  marginBottom: '0.5rem'
                }}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
                <br/>
                <Link to={`/orders/${order._id}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Track Order</Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrderHistory;
