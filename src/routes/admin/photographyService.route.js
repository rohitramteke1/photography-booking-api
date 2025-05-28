const express = require('express');
const photographyServiceCtrl = require('../../controllers/photographyService.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');
const { verifyAdminPassword } = require('../../controllers/adminDashboard.controller');

const router = express.Router();

// Protect ALL routes: Only logged-in admins can access
router.use(protect);
router.use(authorize('admin'));
router.use(verifyAdminPassword);

// CRUD endpoints for Photography Services (Admin)
router.get('/', photographyServiceCtrl.getAllPhotographyServices);
router.get('/:id', photographyServiceCtrl.getPhotographyService);
router.post('/', photographyServiceCtrl.createPhotographyService);
router.put('/:id', photographyServiceCtrl.updatePhotographyService);
router.delete('/:id', photographyServiceCtrl.deletePhotographyService);

module.exports = router;
