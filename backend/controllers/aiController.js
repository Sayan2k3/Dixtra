// backend/controllers/aiController.js
const axios = require('axios');
require('dotenv').config(); // Ensure environment variables are loaded

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

exports.getSafetyTips = async (req, res) => {
  const { disaster } = req.body;

  if (!disaster) {
    return res.status(400).json({ error: 'Missing disaster type' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Missing Gemini API Key in environment variables' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: `Give 5 safety tips for a ${disaster} disaster.` }]
          }
        ]
      }
    );

    const tips = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!tips) {
      return res.status(500).json({ error: 'AI did not return tips.' });
    }

    res.json({ tips });
  } catch (err) {
    console.error('❌ Gemini API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get tips from AI' });
  }
};
