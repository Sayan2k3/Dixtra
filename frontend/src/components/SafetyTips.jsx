// src/components/SafetyTips.jsx
import { useState } from 'react';
import api from '../api';

export default function SafetyTips() {
  const [type, setType] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTips = async () => {
    if (!type.trim()) return alert('Please enter a disaster type');

    setLoading(true);
    try {
      const res = await api.post('/ai/safety-tips', { type });
      setTips(res.data.tips);
    } catch (err) {
      console.error(err);
      alert('Failed to get tips from AI.');
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h2>🔍 Get AI-Powered Safety Tips</h2>
      <input
        type="text"
        placeholder="Enter disaster type (e.g., flood)"
        value={type}
        onChange={(e) => setType(e.target.value)}
        style={{ padding: '6px', width: '60%', marginRight: '8px' }}
      />
      <button onClick={fetchTips} disabled={loading}>
        {loading ? 'Fetching...' : 'Get Tips'}
      </button>

      {tips && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-line', background: '#f9f9f9', padding: '1rem' }}>
          <strong>Safety Tips:</strong>
          <br />
          {tips}
        </div>
      )}
    </div>
  );
}
