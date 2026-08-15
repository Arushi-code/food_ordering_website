import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    
    // Fetch profile
    fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => res.json())
    .then(data => {
      setName(data.name);
      setEmail(data.email);
    })
    .catch(err => console.error(err));
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ name, email, password: password || undefined })
      });
      const data = await response.json();
      if (response.ok) {
        setStatus('success');
        login(data); // update local context
        setPassword('');
        setTimeout(() => setStatus(null), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (!user) return null;

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Profile</h2>
      {status === 'success' && <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', marginBottom: '1rem', borderRadius: '4px' }}>Profile updated successfully!</div>}
      {status === 'error' && <div style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', marginBottom: '1rem', borderRadius: '4px' }}>Error updating profile.</div>}
      
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            required 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            required 
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>New Password (leave blank to keep current)</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
