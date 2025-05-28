const express = require('express');
const {
  getPhotographers,
  getActivePhotographers,
  getPhotographer,
  createPhotographer,
  updatePhotographer,
  deletePhotographer
} = require('../controllers/photographerController');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getPhotographers);
router.get('/active', getActivePhotographers);
router.get('/:id', getPhotographer);

// Admin only routes
router.post('/', protect, authorize('admin'), createPhotographer);
router.put('/:id', protect, authorize('admin'), updatePhotographer);
router.delete('/:id', protect, authorize('admin'), deletePhotographer);

module.exports = router; 