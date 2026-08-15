import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function GroupOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestName, setGuestName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    fetchSession();
    // Poll every 5 seconds to get updates from others
    const interval = setInterval(fetchSession, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchSession = () => {
    fetch(`http://localhost:5000/api/group-cart/${id}`)
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoading(false);
        if (user && data.members?.some(m => m.name === user.name)) {
          setHasJoined(true);
        }
      })
      .catch(console.error);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (user) {
      setHasJoined(true);
    } else if (guestName.trim()) {
      setHasJoined(true);
    }
  };

  const addItem = async (item) => {
    const nameToUse = user ? user.name : guestName;
    try {
      const res = await fetch(`http://localhost:5000/api/group-cart/${id}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameToUse, item: { ...item, quantity: 1 } })
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to add item');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = () => {
    // In a real app, this would convert the GroupCart to a real Order
    alert("Group Order Locked & Checked out! Total will be split.");
    navigate('/');
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Group Cart...</div>;
  if (!session || !session.restaurantId) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Session Not Found</div>;

  const currentUserName = user ? user.name : guestName;
  const isHost = user && session.hostUserId === user._id;

  let totalGroupPrice = 0;
  if (session.members) {
    session.members.forEach(m => {
      m.items.forEach(i => totalGroupPrice += (i.price * i.quantity));
    });
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Group Order: {session.restaurantId.name}</h1>
        <p style={{ color: 'var(--text-muted)' }}>Hosted by {session.hostName}</p>
        
        <div style={{ background: '#eef2ff', padding: '1rem', borderRadius: '8px', display: 'inline-block', marginTop: '1rem' }}>
          <strong>Share this link with friends: </strong>
          <code style={{ background: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem' }}>
            {window.location.href}
          </code>
        </div>
      </div>

      {!hasJoined ? (
        <div style={{ maxWidth: '400px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Join the Group Order</h3>
          {user ? (
            <button onClick={handleJoin} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Join as {user.name}
            </button>
          ) : (
            <form onSubmit={handleJoin} style={{ marginTop: '1rem' }}>
              <input 
                type="text" 
                placeholder="Enter your name" 
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '1rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Join Order</button>
            </form>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Menu Section */}
          <div>
            <h2>Menu</h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {session.restaurantId.menu && session.restaurantId.menu.map(item => (
                <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />}
                  <div className="card-body" style={{ padding: '1rem' }}>
                    <h4 style={{ margin: '0 0 0.5rem' }}>{item.name}</h4>
                    <div style={{ fontWeight: 'bold' }}>₹{item.price.toFixed(0)}</div>
                    <button 
                      onClick={() => addItem(item)}
                      className="btn btn-outline" 
                      style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
                      disabled={session.status === 'locked'}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' }}>
            <h3 style={{ margin: '0 0 1rem' }}>Group Cart</h3>
            {session.status === 'locked' && (
              <div style={{ background: '#fff3cd', color: '#856404', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                This order has been locked by the host.
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', marginBottom: '1rem' }}>
              {session.members.map((member, idx) => {
                let memberTotal = 0;
                return (
                  <div key={idx} style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{member.name} {member.name === currentUserName ? '(You)' : ''}</span>
                    </div>
                    {member.items.length === 0 ? (
                      <div style={{ fontSize: '0.85rem', color: '#888' }}>No items yet</div>
                    ) : (
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0' }}>
                        {member.items.map((item, i) => {
                          memberTotal += item.price;
                          return (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                              <span>{item.name}</span>
                              <span>₹{item.price}</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                    <div style={{ textAlign: 'right', fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)' }}>
                      Subtotal: ₹{memberTotal}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ borderTop: '2px solid #eee', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              <span>Group Total</span>
              <span>₹{totalGroupPrice}</span>
            </div>

            {isHost && session.status !== 'locked' && (
              <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%' }}>
                Lock & Checkout
              </button>
            )}
            {!isHost && session.status !== 'locked' && (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: 0 }}>
                Waiting for host to checkout...
              </p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
