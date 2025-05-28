const express = require('express');
const {
  getAllAdditionalServices,
  getAdditionalService,
  createAdditionalService,
  updateAdditionalService,
  deleteAdditionalService,
} = require('../../controllers/additionalService.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const { verifyAdminPassword } = require('../../controllers/adminDashboard.controller');

const router = express.Router();

// Protect all routes: Only logged-in admins can access
router.use(protect);
router.use(authorize('admin'));
router.use(verifyAdminPassword);

// CRUD endpoints for Additional Services (Admin)
router.get('/', getAllAdditionalServices);
router.get('/:id', getAdditionalService);
router.post('/', createAdditionalService);
router.put('/:id', updateAdditionalService);
router.delete('/:id', deleteAdditionalService);

module.exports = router;
