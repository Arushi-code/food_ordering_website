import { useState } from 'react';


export default function Offers() {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    alert('Offer claimed! Code FEASTO50 copied to clipboard.');
    navigator.clipboard.writeText('FEASTO50');
  };

  return (
    <main className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>Special Offers</h1>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
        <h2>50% Off First Order!</h2>
        <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Use code FEASTO50 at checkout to get 50% off your first delicious meal.</p>
        <button 
          className={`btn ${claimed ? 'btn-outline' : 'btn-primary'}`} 
          onClick={handleClaim}
          disabled={claimed}
        >
          {claimed ? 'Offer Claimed' : 'Claim Offer'}
        </button>
      </div>
    </main>
  );
}
