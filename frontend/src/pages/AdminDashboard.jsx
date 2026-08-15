import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  
  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Restaurants State
  const [restaurants, setRestaurants] = useState([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  
  // Add Restaurant Form State
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80',
    rating: 4.5,
    tags: '',
    deliveryTime: '30-40 min',
  });

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    // Fetch Orders
    fetch('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Not authorized');
      return res.json();
    })
    .then(data => {
      setOrders(data);
      setLoadingOrders(false);
    })
    .catch(err => {
      console.error(err);
      navigate('/');
    });

    // Fetch Restaurants
    fetch('http://localhost:5000/api/restaurants')
    .then(res => res.json())
    .then(data => {
      setRestaurants(data);
      setLoadingRestaurants(false);
    })
    .catch(err => console.error(err));
  }, [user, navigate]);

  // Orders functions
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  // Restaurants functions
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newRestaurant,
        tags: newRestaurant.tags.split(',').map(t => t.trim()),
        menu: []
      };
      
      const res = await fetch('http://localhost:5000/api/restaurants', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const added = await res.json();
        setRestaurants([...restaurants, added]);
        setNewRestaurant({
          name: '', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80', rating: 4.5, tags: '', deliveryTime: '30-40 min'
        });
      }
    } catch (err) {
      console.error('Failed to add restaurant', err);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setRestaurants(restaurants.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete restaurant', err);
    }
  };

  if (loadingOrders || loadingRestaurants) return <div className="container" style={{ padding: '2rem 1rem' }}>Loading dashboard...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin Dashboard</h2>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          style={{ padding: '0.5rem 1rem', background: activeTab === 'orders' ? 'var(--primary)' : '#eee', color: activeTab === 'orders' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
        >
          Order Management
        </button>
        <button 
          onClick={() => setActiveTab('restaurants')}
          style={{ padding: '0.5rem 1rem', background: activeTab === 'restaurants' ? 'var(--primary)' : '#eee', color: activeTab === 'restaurants' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
        >
          Restaurant Management
        </button>
      </div>

      {activeTab === 'orders' && (
        <div>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Total Revenue</h4>
              <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>₹{totalRevenue.toFixed(0)}</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Total Orders</h4>
              <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{orders.length}</p>
            </div>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: 0, color: 'var(--text-muted)' }}>Pending Orders</h4>
              <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: 'bold', color: pendingCount > 0 ? '#d9534f' : 'inherit' }}>{pendingCount}</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Recent Orders</h3>
            <div>
              <label style={{ marginRight: '0.5rem', fontWeight: 500 }}>Filter Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '1rem' }}>Order ID</th>
                <th style={{ padding: '1rem' }}>User</th>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Total</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{order._id.substring(order._id.length - 6)}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{order.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>₹{order.totalAmount.toFixed(0)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem',
                      background: order.status === 'delivered' ? '#d4edda' : order.status === 'out_for_delivery' ? '#cce5ff' : '#fff3cd'
                    }}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      style={{ padding: '0.4rem 0.8rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && <p style={{ padding: '2rem', textAlign: 'center' }}>No orders found.</p>}
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
          
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0 }}>Add New Restaurant</h3>
            <form onSubmit={handleAddRestaurant} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
              <input type="text" placeholder="Restaurant Name" required value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Tags (comma separated)" required value={newRestaurant.tags} onChange={e => setNewRestaurant({...newRestaurant, tags: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Delivery Time (e.g. 20-30 min)" required value={newRestaurant.deliveryTime} onChange={e => setNewRestaurant({...newRestaurant, deliveryTime: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" step="0.1" placeholder="Initial Rating" required value={newRestaurant.rating} onChange={e => setNewRestaurant({...newRestaurant, rating: parseFloat(e.target.value)})} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ gridColumn: '1 / -1', padding: '0.8rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
                Add Restaurant
              </button>
            </form>
          </div>

          <div>
            <h3>All Restaurants</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {restaurants.map(rest => (
                <div key={rest._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <img src={rest.image} alt={rest.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{rest.name}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rest.tags?.join(', ')}</div>
                  </div>
                  <button onClick={() => handleDeleteRestaurant(rest._id)} style={{ padding: '0.5rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p style={{ margin: '0 0 0.5rem 0' }}><strong>Customer:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
              <p style={{ margin: 0 }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Items Ordered</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₹{item.price} x {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 600 }}>₹{(item.price * item.quantity).toFixed(0)}</div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <strong style={{ fontSize: '1.1rem' }}>Total Amount</strong>
              <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>₹{selectedOrder.totalAmount.toFixed(0)}</strong>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
