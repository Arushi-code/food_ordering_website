import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function GroupOrdersHub() {
  const [restaurants, setRestaurants] = useState([]);
  const [myGroupCarts, setMyGroupCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch restaurants
    fetch(`${API_URL}/api/restaurants`)
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch user's group carts if logged in
    if (user) {
      fetch(`${API_URL}/api/group-cart/my`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setMyGroupCarts(data))
        .catch(console.error);
    }
  }, [user]);

  const startGroupOrder = async (restaurantId) => {
    if (!user) {
      alert("Please sign in to start a group order");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/group-cart/start`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ restaurantId })
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/group-order/${data._id}`);
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to start group order');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="container" style={{ padding: '2rem 1rem' }}>
      
      {user && myGroupCarts.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>My Group Orders</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {myGroupCarts.map(cart => (
              <div key={cart._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem' }}>{cart.restaurantId?.name || 'Restaurant'}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Hosted by {cart.hostName} • {new Date(cart.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    backgroundColor: cart.status === 'locked' ? '#e2e8f0' : '#dcfce7',
                    color: cart.status === 'locked' ? '#475569' : '#166534'
                  }}>
                    {cart.status.toUpperCase()}
                  </span>
                  
                  <Link 
                    to={`/group-order/${cart._id}`} 
                    className={cart.status === 'locked' ? "btn btn-outline" : "btn btn-primary"}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                  >
                    {cart.status === 'locked' ? 'View Receipt' : 'Open Cart'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Start a Group Order</h1>
        <p style={{ color: 'var(--text-muted)' }}>Choose a restaurant below, invite your friends, and order together!</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center' }}>Loading restaurants...</div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {restaurants.map(restaurant => (
            <div key={restaurant._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div className="card-body" style={{ padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem' }}>{restaurant.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {restaurant.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <button 
                  onClick={() => startGroupOrder(restaurant._id)}
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Start Group Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
