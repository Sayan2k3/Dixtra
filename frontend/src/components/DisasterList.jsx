// src/components/DisasterList.jsx
import { useState, useEffect } from 'react';
import api from '../api';

export default function DisasterList({ disasters, setFilteredDisasters, refresh, setSelected }) {
  const [tag, setTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const tagSet = new Set();
    disasters.forEach(d => {
      if (d.tags) {
        d.tags.forEach(t => tagSet.add(t));
      }
    });
    setAllTags(Array.from(tagSet));
  }, [disasters]);

  const handleFilter = () => {
    if (!tag.trim()) {
      setFilteredDisasters(disasters);
      return;
    }

    const lower = tag.toLowerCase();
    const filtered = disasters.filter(d =>
      d.tags?.some(t => t.toLowerCase().includes(lower))
    );
    setFilteredDisasters(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this disaster?")) return;
    try {
      await api.delete(`/disasters/${id}`);
      alert("Deleted!");
      refresh(); // refetch list
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete disaster.");
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h2>Reported Disasters</h2>

      <input
        list="tag-options"
        type="text"
        placeholder="Select or enter a tag"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        style={{ padding: '6px', marginRight: '8px' }}
      />
      <datalist id="tag-options">
        {allTags.map((t, i) => (
          <option key={i} value={t} />
        ))}
      </datalist>

      <button onClick={handleFilter}>Apply</button>

      <ul style={{ marginTop: '1rem' }}>
        {disasters
          .filter(d =>
            !tag || d.tags?.some(t => t.toLowerCase().includes(tag.toLowerCase()))
          )
          .map(d => (
            <li key={d.id} style={{ marginBottom: '1rem' }}>
              <strong>{d.title}</strong> – {d.location_name} <br />
              {d.description}
              <br />
              <button onClick={() => setSelected(d)} style={{ marginRight: '8px' }}>Edit</button>
              <button onClick={() => handleDelete(d.id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
