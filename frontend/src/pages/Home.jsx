import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Favorites logic
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/restaurants`)
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch restaurants', err);
        setLoading(false);
      });

    fetch(`${API_URL}/api/restaurants/deals/surprise-bags`)
      .then(res => res.json())
      .then(data => setDeals(data))
      .catch(console.error);

    if (user) {
      fetch(`${API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
         if (data.favorites) {
           const favIds = data.favorites.map(f => typeof f === 'object' ? f._id : f);
           setFavoriteIds(favIds);
         }
      })
      .catch(console.error);
    }
  }, [user]);

  const toggleFavorite = async (e, id) => {
    e.preventDefault(); // Prevent navigating to restaurant details
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
        if (favoriteIds.includes(id)) {
          setFavoriteIds(favoriteIds.filter(fid => fid !== id));
        } else {
          setFavoriteIds([...favoriteIds, id]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <main>
      <section className="hero container animate-fade-in">
        <h1>Food delivery you can <br/> count on</h1>
        <p>Experience the best restaurants in your city, delivered straight to your door with real-time tracking.</p>
        <div style={{ width: '100%', maxWidth: '500px', marginTop: '2rem' }}>
          <input 
            type="text" 
            placeholder="Search for restaurants, cuisines, or tags..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1rem 1.5rem', 
              borderRadius: 'var(--radius-pill)', 
              border: '1px solid var(--text-muted)',
              fontSize: '1rem',
              boxShadow: 'var(--shadow-soft)'
            }} 
          />
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '3rem' }}>
        {deals.length > 0 && (
          <>
            <div className="section-title animate-fade-in delay-1">
              <h2>🌱 Eco-Deals: Rescue Surprise Bags</h2>
              <p style={{ color: 'var(--text-muted)' }}>Save food and money at the end of the day!</p>
            </div>
            <div className="grid" style={{ marginBottom: '4rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
              {deals.map(restaurant => (
                <Link to={`/restaurant/${restaurant._id}`} key={`deal-${restaurant._id}`} className="card" style={{ display: 'block', textDecoration: 'none', color: 'inherit', border: '2px solid #10b981' }}>
                  <div style={{ background: '#10b981', color: 'white', padding: '0.5rem', textAlign: 'center', fontWeight: 'bold' }}>
                    {restaurant.surpriseBags.available} Bags Left!
                  </div>
                  <div className="card-body" style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem' }}>{restaurant.name}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>₹{restaurant.surpriseBags.price}</span>
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{restaurant.surpriseBags.originalPrice}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                      🕒 Pickup: {restaurant.surpriseBags.pickupTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="section-title animate-fade-in delay-1">
          <h2>Popular Near You</h2>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading delicious options...
          </div>
        ) : (
          <>
            {filteredRestaurants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No restaurants found matching "{searchTerm}"
              </div>
            ) : (
              <div className="grid">
                {filteredRestaurants.map((restaurant, index) => {
                  const isFav = favoriteIds.includes(restaurant._id);
                  return (
                    <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} className={`card animate-fade-in delay-${(index % 3) + 1}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit', position: 'relative' }}>
                      <div className="card-img-wrapper" style={{ position: 'relative' }}>
                        <img src={restaurant.image} alt={restaurant.name} className="card-img" />
                        <button 
                          onClick={(e) => toggleFavorite(e, restaurant._id)}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 10 }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                      </div>
                      <div className="card-body">
                        <div className="card-header">
                          <h3 className="card-title">{restaurant.name}</h3>
                          <div className="rating">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            {restaurant.rating}
                          </div>
                        </div>
                        <div className="tags">
                          {restaurant.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                          ))}
                        </div>
                        
                        <div className="card-footer">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            {restaurant.deliveryTime}
                          </div>
                          <div style={{ color: 'var(--primary)', fontWeight: 600 }}>Free delivery</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
