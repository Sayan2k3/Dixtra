import React, { useState } from 'react';

const GEMINI_API_KEY = 'AIzaSyBD0AwhSiMEXDfOXSTBHNi6KfdytCzWF50';

export default function GeminiTips() {
  const [disaster, setDisaster] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);

  const getTips = async () => {
    if (!disaster.trim()) return alert('Please enter a disaster type');

    setLoading(true);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `Give 5 safety tips for a ${disaster} disaster.` }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (result) {
        setTips(result);
      } else {
        setTips('⚠️ No tips returned. Check API key or quota.');
      }
    } catch (err) {
      console.error('Gemini fetch error:', err);
      setTips('⚠️ Error calling Gemini API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', marginTop: '2rem' }}>
      <h2>AI-Powered Safety Tips</h2>
      <input
        type="text"
        placeholder="Enter disaster type (e.g., earthquake)"
        value={disaster}
        onChange={(e) => setDisaster(e.target.value)}
        style={{ padding: '6px', marginRight: '8px', width: '250px' }}
      />
      <button onClick={getTips} disabled={loading}>
        {loading ? 'Loading...' : 'Get Tips'}
      </button>

      {tips && (
        <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <strong>Tips:</strong>
          <p>{tips}</p>
        </div>
      )}
    </div>
  );
}
