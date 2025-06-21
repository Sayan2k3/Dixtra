// backend/routes/disasterRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDisaster,
  getAllDisasters,
  updateDisaster,
  deleteDisaster
} = require('../controllers/disasterController');

// Route to create a disaster
router.post('/', createDisaster);

// Route to fetch all disasters
router.get('/', getAllDisasters);

// Route to update a disaster by ID
router.put('/:id', updateDisaster);

// Route to delete a disaster by ID
router.delete('/:id', deleteDisaster);

module.exports = router;
