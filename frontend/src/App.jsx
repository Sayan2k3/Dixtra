import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import ViewAll from './pages/ViewAll';
import EditDisasterPage from './pages/EditDisasterPage';
import BotPage from './pages/BotPage';
import SocialMedia from './pages/SocialMedia';
import OfficialUpdates from './pages/OfficialUpdates'; // ✅ correct
// ✅ rename to match actual component
import api from './api';

import './styles/dashboard.css';

export default function App() {
  const [disasters, setDisasters] = useState([]);

  const fetchDisasters = async () => {
    try {
      const res = await api.get('/disasters');
      setDisasters(res.data);
    } catch (error) {
      console.error('Failed to fetch disasters:', error);
    }
  };

  useEffect(() => {
    fetchDisasters();
  }, []);

  return (
    <Router>
      <nav className="navbar">
        <Link to="/">🏠 Dashboard</Link>
        <Link to="/view">📋 View All</Link>
        <Link to="/bot">🧠 Talk to the AI</Link>
        <Link to="/social-media">📣 Social Media</Link>
        <Link to="/official">📰 Official Updates</Link>

        {/* Remove the following line */}
        {/* <Link to="/disasters/:id">🌍 Browse Disasters</Link> */}
      </nav>

      <Routes>
        <Route
          path="/"
          element={<Dashboard disasters={disasters} refresh={fetchDisasters} />}
        />
        <Route
          path="/view"
          element={<ViewAll disasters={disasters} refresh={fetchDisasters} />}
        />
        <Route
          path="/edit/:id"
          element={<EditDisasterPage refresh={fetchDisasters} />}
        />
        <Route path="/bot" element={<BotPage />} />
        <Route path="/social-media" element={<SocialMedia />} />
        <Route path="/official" element={<OfficialUpdates />} />

        
      </Routes>
    </Router>
  );
}
