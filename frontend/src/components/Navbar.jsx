import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar container">
      <Link to="/" className="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
          <path d="M7 2v20"></path>
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
        </svg>
        Feasto
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/search" className="nav-item">Search</Link>
        <Link to="/offers" className="nav-item">Offers</Link>
        <Link to="/group-orders" className="nav-item">Group Orders</Link>
        <div className="cart-icon" onClick={toggleCart} style={{ cursor: 'pointer', position: 'relative' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </div>
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/favorites" className="nav-item">Favorites</Link>
            <Link to="/orders" className="nav-item">Orders</Link>
            <Link to="/profile" className="nav-item">Profile</Link>
            {user.role === 'admin' && <Link to="/admin" className="nav-item" style={{color: 'var(--primary-color)'}}>Admin</Link>}
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Logout</button>
          </div>
        ) : (
          <Link to="/signin" className="btn btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
