// backend/routes/geocodeRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { location_name } = req.body;

  if (!location_name) {
    return res.status(400).json({ error: 'location_name is required' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location_name,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'DisasterResponseCoordination/1.0'
      }
    });

    if (response.data.length === 0) {
      return res.status(404).json({ error: 'No location found' });
    }

    const { lat, lon } = response.data[0];
    res.json({ lat, lon });
  } catch (err) {
    res.status(500).json({ error: 'Geocoding failed', detail: err.message });
  }
});

module.exports = router;
