// backend/routes/disasterRoutes.js
const express = require('express');
const router = express.Router();
const {
  createDisaster,
  getAllDisasters,
  updateDisaster,
  deleteDisaster
} = require('../controllers/disasterController');

router.post('/', createDisaster);
router.get('/', getAllDisasters);
router.put('/:id', updateDisaster);
router.delete('/:id', deleteDisaster);

module.exports = router;
