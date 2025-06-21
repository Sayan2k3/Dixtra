import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function DisasterForm({ onSuccess, selectedDisaster, clearSelection }) {
  const [formData, setFormData] = useState({
    title: '',
    location_name: '',
    description: '',
    tags: '',
    owner_id: 'user_123',
  });

  const [coords, setCoords] = useState({ lat: '', lon: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDisaster) {
      setFormData({
        title: selectedDisaster.title,
        location_name: selectedDisaster.location_name,
        description: selectedDisaster.description,
        tags: selectedDisaster.tags?.join(', ') || '',
        owner_id: selectedDisaster.owner_id,
      });

      const lat = selectedDisaster.lat || selectedDisaster.location?.coordinates?.[1] || '';
      const lon = selectedDisaster.lon || selectedDisaster.location?.coordinates?.[0] || '';
      setCoords({ lat, lon });
    }
  }, [selectedDisaster]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let { lat, lon } = coords;

      if ((!lat || !lon) && formData.location_name) {
        const geoRes = await api.post('/geocode', { location_name: formData.location_name });
        lat = parseFloat(geoRes.data.lat);
        lon = parseFloat(geoRes.data.lon);
        setCoords({ lat, lon }); // update local display
        alert(`📍 Location resolved: Latitude ${lat.toFixed(4)}, Longitude ${lon.toFixed(4)}`);
      }

      const payload = {
        ...formData,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      if (selectedDisaster?.id) {
        await api.put(`/disasters/${selectedDisaster.id}`, payload);
      } else {
        await api.post('/disasters', payload);
      }

      alert('✅ Disaster submitted successfully!');
      onSuccess?.();
      clearSelection?.();

      // Redirect to /view with AI modal trigger and coordinates
      navigate('/view', {
        state: {
          showBot: true,
          disasterType: formData.title,
          coords: { lat, lon },
        },
      });

    } catch (err) {
      console.error('Submission error:', err);
      alert('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="disaster-form">
      <h2>{selectedDisaster ? '✏️ Edit Disaster' : 'Report a Disaster'}</h2>

      <label>
        Title:
        <input
          name="title"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Location Name:
        <input
          name="location_name"
          placeholder="Enter location"
          value={formData.location_name}
          onChange={handleChange}
          required
        />
      </label>

      {coords.lat && coords.lon && (
        <p style={{ margin: '0.5rem 0', color: '#2c3e50' }}>
          📍 <strong>Lat:</strong> {coords.lat.toFixed(4)} | <strong>Lon:</strong> {coords.lon.toFixed(4)}
        </p>
      )}

      <label>
        Description:
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Tags (comma-separated):
        <input
          name="tags"
          placeholder="e.g., flood, earthquake"
          value={formData.tags}
          onChange={handleChange}
        />
      </label>

      <button type="submit">{selectedDisaster ? 'Update' : 'Submit'}</button>
    </form>
  );
}
