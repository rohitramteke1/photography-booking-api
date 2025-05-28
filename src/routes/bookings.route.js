const express = require('express');
const {
  calculateBookingPrice,
  createBooking,
  getUserBookings,
  getBooking,
  updateBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/booking.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Price calculation - accessible to logged in users
router.post('/calculate', protect, calculateBookingPrice);

// User booking routes
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.put('/:id/cancel', protect, cancelBooking);

// Admin only routes
router.get('/admin/all', protect, authorize('admin'), getAllBookings);
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router; 