import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import DisasterMap from '../components/DisasterMap';
import DisasterSafetyBot from '../components/DisasterSafetyBot';
import '../styles/viewall.css';

export default function ViewAll({ disasters, refresh }) {
  const [filtered, setFiltered] = useState([]);
  const [tag, setTag] = useState('');
  const [showBotModal, setShowBotModal] = useState(false);
  const [botInfo, setBotInfo] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setFiltered(disasters);

    if (location.state?.showBot) {
      const selected = disasters.find(d => d.title === location.state.disasterType);
      let lat, lon;

      if (selected?.location && typeof selected.location === 'string') {
        const match = selected.location.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
        if (match) {
          lon = parseFloat(match[1]);
          lat = parseFloat(match[2]);
        }
      }

      setBotInfo({
        disasterType: location.state.disasterType,
        coords: { lat, lon }
      });

      setShowBotModal(true);
    }
  }, [disasters, location.state]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this disaster?')) return;
    try {
      await api.delete(`/disasters/${id}`);
      refresh();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleFilter = () => {
    if (!tag.trim()) {
      setFiltered(disasters);
      return;
    }

    const lower = tag.toLowerCase();
    const filteredData = disasters.filter(d =>
      d.tags?.some(t => t.toLowerCase().includes(lower))
    );
    setFiltered(filteredData);
  };

  const extractLatLon = (locationField) => {
    if (typeof locationField === 'string') {
      const match = locationField.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
      if (match) {
        return {
          lon: parseFloat(match[1]),
          lat: parseFloat(match[2]),
        };
      }
    }
    return { lat: null, lon: null };
  };

  return (
    <div className="viewall-container">
      <h2>📋 All Reported Disasters</h2>

      <div className="filter-section">
        <input
          list="tag-options"
          type="text"
          placeholder="Search by tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <datalist id="tag-options">
          {[...new Set(disasters.flatMap(d => d.tags || []))].map((t, i) => (
            <option key={i} value={t} />
          ))}
        </datalist>
        <button onClick={handleFilter}>Apply</button>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Location</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((d) => {
            const { lat, lon } = extractLatLon(d.location);

            return (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td>{d.location_name}</td>
                <td>{lat ? lat.toFixed(4) : 'N/A'}</td>
                <td>{lon ? lon.toFixed(4) : 'N/A'}</td>
                <td>{d.description}</td>
                <td>{d.tags?.join(', ')}</td>
                <td>{d.owner_id}</td>
                <td>
                  <button onClick={() => navigate(`/edit/${d.id}`)}>Edit</button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    style={{ backgroundColor: '#e74c3c', color: '#fff', marginLeft: '0.5rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="extras-wrapper">
        <div className="map-card">
          <h3>🗺️ Disaster Map</h3>
          <DisasterMap disasters={filtered} />
        </div>
      </div>

      {/* ✅ Modal for AI Bot Suggestion */}
      {showBotModal && botInfo.coords?.lat && botInfo.coords?.lon && (
        <div className="modal-overlay" onClick={() => setShowBotModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowBotModal(false)} style={{ float: 'right' }}>❌</button>
            <h3>
              📍 <strong>{botInfo.disasterType}</strong> @{' '}
              {botInfo.coords.lat.toFixed(4)}, {botInfo.coords.lon.toFixed(4)}
            </h3>
            <DisasterSafetyBot prefill={botInfo.disasterType} coords={botInfo.coords} />
          </div>
        </div>
      )}
    </div>
  );
}
