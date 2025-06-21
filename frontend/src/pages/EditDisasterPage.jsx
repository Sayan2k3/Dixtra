import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';
import DisasterForm from '../components/DisasterForm';

export default function EditDisasterPage({ refresh }) {
  const { id } = useParams();
  const [disaster, setDisaster] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisaster = async () => {
      try {
        const res = await api.get('/disasters');
        const found = res.data.find(d => d.id === id);
        if (!found) return alert('Disaster not found');
        setDisaster(found);
      } catch {
        alert('Error loading disaster data.');
      }
    };

    fetchDisaster();
  }, [id]);

  return (
    <div className="container">
      <h2>✏️ Edit Disaster</h2>
      {disaster && (
        <DisasterForm
          selectedDisaster={disaster}
          onSuccess={() => {
            refresh();
            navigate('/view');
          }}
          clearSelection={() => navigate('/view')}
        />
      )}
    </div>
  );
}
