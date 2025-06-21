import { useEffect, useState } from 'react';
import api from '../api';
import '../styles/social.css';

export default function SocialMediaDashboard() {
  const [reports, setReports] = useState([]);
  const [disasterId, setDisasterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSocialMedia = async (id) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/disasters/${id}/social-media`);
      setReports(res.data);
    } catch (err) {
      console.error('Social fetch error:', err);
      setError('❌ Failed to fetch social media reports');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disasterId.trim()) {
      fetchSocialMedia(disasterId.trim());
    }
  };

  return (
    <div className="social-container">
      <h2>📣 Social Media Dashboard</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter Disaster ID"
          value={disasterId}
          onChange={(e) => setDisasterId(e.target.value)}
          required
        />
        <button type="submit">Fetch Reports</button>
      </form>

      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reports.length > 0 && (
        <div className="social-list">
          <h3>📌 Reports for Disaster ID: {disasterId}</h3>
          <div className="report-cards">
            {reports.map((r, i) => (
              <div className={`report-card ${r.priority ? 'priority' : ''}`} key={i}>
                {r.image_url && (
                  <img
                    src={r.image_url}
                    alt={`Post by ${r.user}`}
                    className="report-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://source.unsplash.com/240x140/?emergency,disaster';
                    }}
                  />
                )}
                <p><strong>{r.user}</strong></p>
                <p>{r.post}</p>
                {r.priority && <span className="priority-label">🚨 PRIORITY ALERT</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
