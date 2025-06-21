// src/pages/BotPage.jsx
import { useState } from 'react';
import DisasterSafetyBot from '../components/DisasterSafetyBot';
import '../styles/bot.css'; // optional style

export default function BotPage() {
  const [showBot, setShowBot] = useState(true);

  return (
    <div className="bot-page">
      <h2>🤖 Disaster Safety AI Assistant</h2>
      {showBot && (
        <div className="bot-popup">
          <DisasterSafetyBot />
        </div>
      )}
    </div>
  );
}
