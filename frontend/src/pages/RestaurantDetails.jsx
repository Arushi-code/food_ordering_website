import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/restaurants/${id}`)
      .then(res => res.json())
      .then(data => {
        setRestaurant(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch restaurant details', err);
        setLoading(false);
      });

    if (user) {
      fetch('${API_URL}/api/users/profile', {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
         if (data.favorites) {
           const favIds = data.favorites.map(f => typeof f === 'object' ? f._id : f);
           setIsFavorite(favIds.includes(id));
         }
      })
      .catch(console.error);
    }
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please sign in to add favorites");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/users/favorites/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startGroupOrder = async () => {
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
        body: JSON.stringify({ restaurantId: id })
      });
      if (res.ok) {
        const data = await res.json();
        navigate(`/group-order/${data._id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Loading Menu...</h2>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Restaurant Not Found</h2>
      </div>
    );
  }

  return (
    <main className="container" style={{ paddingBottom: '6rem' }}>
      <div style={{ marginTop: '2rem', marginBottom: '3rem', position: 'relative', height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', display: 'flex', alignItems: 'flex-end', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <h1 style={{ color: 'white', margin: 0 }}>{restaurant.name}</h1>
            <button 
              onClick={toggleFavorite}
              style={{ background: 'white', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="rating" style={{ background: 'var(--surface)', border: '1px solid var(--surface-light)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {restaurant.rating} Rating
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', padding: '0.25rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-light)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {restaurant.deliveryTime}
          </div>
        </div>
        
        <button 
          onClick={startGroupOrder}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Start Group Order
        </button>
      </div>
      
      {restaurant.surpriseBags && restaurant.surpriseBags.available > 0 && (
        <div style={{ background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem', color: '#047857' }}>🌱 Rescue Surprise Bag</h3>
              <p style={{ margin: 0, color: '#065f46' }}>Contains surplus food worth ₹{restaurant.surpriseBags.originalPrice}. You save food from going to waste!</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#059669' }}><strong>Pickup Window:</strong> {restaurant.surpriseBags.pickupTime}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>₹{restaurant.surpriseBags.price}</div>
              <div style={{ color: '#059669', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{restaurant.surpriseBags.available} left</div>
              <button 
                onClick={() => addToCart({
                  _id: 'surprise-bag',
                  name: 'Surprise Bag',
                  price: restaurant.surpriseBags.price,
                  restaurant: restaurant.name
                })}
                className="btn btn-primary" style={{ background: '#10b981', borderColor: '#10b981' }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <h2>Menu</h2>
      <div className="grid" style={{ marginTop: '2rem' }}>
        {restaurant.menu && restaurant.menu.map(item => (
          <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
            {item.image && (
              <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            )}
            <div className="card-body">
              <h3 className="card-title">{item.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{item.description}</p>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginTop: '1rem' }}>₹{item.price.toFixed(0)}</div>
            </div>
            <div className="card-footer" style={{ padding: '1rem', borderTop: 'none' }}>
              <button onClick={() => addToCart(item)} className="btn btn-outline" style={{ width: '100%' }}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
