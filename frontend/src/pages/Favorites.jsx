import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    Promise.all([
      fetch('http://localhost:5000/api/restaurants').then(res => res.json()),
      fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${user.token}` }
      }).then(res => res.json())
    ])
    .then(([allRestaurants, profile]) => {
      const favIds = profile.favorites ? profile.favorites.map(f => typeof f === 'object' ? f._id : f) : [];
      const favRestaurants = allRestaurants.filter(r => favIds.includes(r._id));
      setRestaurants(favRestaurants);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [user, navigate]);

  if (loading) return <div className="container" style={{ padding: '2rem 1rem' }}>Loading favorites...</div>;

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>My Favorite Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>You haven't added any restaurants to your favorites yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          {restaurants.map(restaurant => (
            <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s', background: '#fff' }}>
                <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{restaurant.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>⭐ {restaurant.rating}</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
