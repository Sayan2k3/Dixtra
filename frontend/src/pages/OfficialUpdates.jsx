// src/pages/OfficialUpdates.jsx
import { useEffect, useState } from 'react';
import api from '../api';
import '../styles/official.css';

export default function OfficialUpdates() {
  const [updates, setUpdates] = useState({ fema: [], redCross: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUpdates() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/disasters/official-updates`);
        setUpdates(res.data);
      } catch (e) {
        console.error('Fetch error:', e);
        setError('Failed to fetch official updates.');
      } finally {
        setLoading(false);
      }
    }

    fetchUpdates(); // Auto-fetch on page load
  }, []);

  return (
    <div className="official-container">
      <h2>📰 Official Updates Dashboard</h2>

      {loading && <p>⏳ Loading updates...</p>}
      {error && <p className="error">{error}</p>}

      {updates.fema.length > 0 && (
        <section>
          <h3>FEMA Updates</h3>
          <ul>
            {updates.fema.map((u, idx) => (
              <li key={idx}>
                <a href={u.link} target="_blank" rel="noopener noreferrer">
                  {u.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {updates.redCross.length > 0 && (
        <section>
          <h3>Red Cross Updates</h3>
          <ul>
            {updates.redCross.map((u, idx) => (
              <li key={idx}>
                <a href={u.link} target="_blank" rel="noopener noreferrer">
                  {u.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
