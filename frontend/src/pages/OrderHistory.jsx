import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

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

  if (loading) return <div className="container" style={{ padding: '2rem 1rem' }}>Loading orders...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>My Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {orders.map(order => (
            <div key={order._id} style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  background: order.status === 'delivered' ? '#d4edda' : '#fff3cd',
                  color: order.status === 'delivered' ? '#155724' : '#856404',
                  marginBottom: '0.5rem'
                }}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
                <br/>
                <Link to={`/orders/${order._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>Track Order</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
