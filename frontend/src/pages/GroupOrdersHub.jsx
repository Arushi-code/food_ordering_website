import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function GroupOrdersHub() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('${API_URL}/api/restaurants')
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const startGroupOrder = async (restaurantId) => {
    if (!user) {
      alert("Please sign in to start a group order");
      return;
    }
    try {
      const res = await fetch('${API_URL}/api/group-cart/start', {
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
