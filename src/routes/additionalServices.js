const express = require('express');
const {
  getAllAdditionalServices,
  getAdditionalService,
  createAdditionalService,
  updateAdditionalService,
  deleteAdditionalService
} = require('../controllers/additionalService.controller');

const router = express.Router();

router.get('/', getAllAdditionalServices);
router.get('/:id', getAdditionalService);
router.post('/', createAdditionalService);
router.put('/:id', updateAdditionalService);
router.delete('/:id', deleteAdditionalService);

module.exports = router;
