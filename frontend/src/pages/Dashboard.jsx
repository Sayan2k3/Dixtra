
import { useState } from 'react';
import DisasterForm from '../components/DisasterForm';
import DisasterSafetyBot from '../components/DisasterSafetyBot'; // Only bot retained
import '../styles/dashboard.css';

export default function Dashboard({ disasters, refresh }) {
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  return (
    <div className="dashboard-container">
      <h1>🌍 Disaster Management Dashboard</h1>

      <div className="form-wrapper">
        <DisasterForm
          onSuccess={refresh}
          selectedDisaster={selectedDisaster}
          clearSelection={() => setSelectedDisaster(null)}
        />
      </div>

      <div className="extras-wrapper">
        {/* <div className="bot-card">
          <h3>🌪️ AI-Powered Safety Bot</h3>
          <DisasterSafetyBot />
        </div> */}
      </div>
    </div>
  );
}


