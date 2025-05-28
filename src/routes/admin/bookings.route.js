const express = require('express');
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../../controllers/booking.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const { verifyAdminPassword } = require('../../controllers/adminDashboard.controller');

const router = express.Router();

// Protect ALL routes: Only logged-in admins can access
router.use(protect);
router.use(authorize('admin'));
router.use(verifyAdminPassword);

// CRUD endpoints for Bookings (Admin)
router.get('/', getAllBookings);         // List all bookings
router.get('/:id', getBooking);          // Get booking by ID
router.post('/', createBooking);         // Create new booking
router.put('/:id', updateBooking);       // Update booking by ID
router.delete('/:id', deleteBooking);    // Delete booking by ID

module.exports = router;
