const express = require('express');
const {
  getAllPhotographyServices,
  getPhotographyService,
  createPhotographyService,
  updatePhotographyService,
  deletePhotographyService
} = require('../controllers/photographyService.controller.js');

const { protect, authorize } = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes
router.get('/', getAllPhotographyServices); // <-- FIXED NAME
router.get('/:id', getPhotographyService);

// Admin only routes
router.post('/', protect, authorize('admin'), createPhotographyService);
router.put('/:id', protect, authorize('admin'), updatePhotographyService);
router.delete('/:id', protect, authorize('admin'), deletePhotographyService);

module.exports = router;
