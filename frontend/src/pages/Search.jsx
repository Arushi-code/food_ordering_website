import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

const Search = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/restaurants`)
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setFilteredRestaurants(data);
        
        // Extract unique tags
        const tags = new Set();
        data.forEach(r => {
          r.tags.forEach(tag => tags.add(tag));
        });
        setAllTags(['All', ...Array.from(tags)]);
      });
  }, []);

  useEffect(() => {
    let result = restaurants;
    if (searchTerm) {
      result = result.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.menu.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedTag !== 'All') {
      result = result.filter(r => r.tags.includes(selectedTag));
    }
    setFilteredRestaurants(result);
  }, [searchTerm, selectedTag, restaurants]);

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h2>Search Restaurants & Dishes</h2>
      
      <div style={{ margin: '2rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search for restaurants, cuisines, or dishes..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1, minWidth: '250px', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
        {allTags.map(tag => (
          <button 
            key={tag}
            onClick={() => setSelectedTag(tag)}
            style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: '999px', 
              border: 'none', 
              background: selectedTag === tag ? 'var(--primary-color)' : '#eee',
              color: selectedTag === tag ? '#fff' : '#333',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {filteredRestaurants.length === 0 ? (
          <p>No results found for "{searchTerm}".</p>
        ) : (
          filteredRestaurants.map(restaurant => (
            <Link to={`/restaurant/${restaurant._id}`} key={restaurant._id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s', background: '#fff' }}>
                <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{restaurant.name}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {restaurant.tags.map(tag => (
                      <span key={tag} style={{ background: '#f0f0f0', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>⭐ {restaurant.rating}</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
