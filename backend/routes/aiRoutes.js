// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { getSafetyTips } = require('../controllers/aiController');

// Route: POST /api/ai/safety-tips
router.post('/safety-tips', getSafetyTips);

module.exports = router;
