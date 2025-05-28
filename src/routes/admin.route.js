const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getUser,
  updateUserRole,
  getBookingAnalytics,
  getRevenueAnalytics,
  verifyAdminPassword
} = require('../controllers/adminDashboard.controller');

const {
  adminLogin,
  getAdminProfile,
  changeAdminPassword
} = require('../controllers/adminAuth.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

// Import admin resource routers (adjust paths if different in your structure)
const adminBookingRouter = require('./admin/bookings.route');
const adminPhotographyServiceRouter = require('./admin/photographyService.route');
const adminAdditionalServiceRouter = require('./admin/additionalService.route');

const router = express.Router();

// 1. Add your login route *before* any middleware
router.post('/login', adminLogin);

// 2. Now, protect everything below
router.use(protect);
router.use(authorize('admin'));

// Admin profile
router.get('/me', getAdminProfile);

// Google admin password check
router.use(verifyAdminPassword);

// Admin dashboard
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/role', updateUserRole);
router.get('/analytics/bookings', getBookingAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);

// Password management
router.put('/change-password', changeAdminPassword);

router.post('/verify-password', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin password verified'
  });
});

// ---------- ADMIN RESOURCE CRUD ROUTES ----------
// All these will be protected and require admin password

router.use('/bookings', adminBookingRouter);
router.use('/photography-services', adminPhotographyServiceRouter);
router.use('/additional-services', adminAdditionalServiceRouter);

module.exports = router;
