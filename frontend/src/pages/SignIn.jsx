import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Authentication failed');
    }
  };

  return (
    <main className="container" style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>
        
        {error && (
          <div style={{ background: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--text-muted)' }} 
                required 
              />
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--text-muted)' }} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--text-muted)' }} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </main>
  );
}
