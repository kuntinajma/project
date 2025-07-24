const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateFacility, validateFacilityUpdate } = require('../middleware/validation');

// Public routes - get settings
router.get('/', settingsController.getAllSettings);
router.get('/category/:category', settingsController.getSettingsByCategory);
router.get('/facilities', settingsController.getAllFacilities);

// Protected routes - update settings (admin only)
router.put('/category/:category', 
  authenticateToken, 
  authorize('admin', 'superadmin'), 
  settingsController.updateSettings
);

// Facilities management (admin only)
router.post('/facilities', 
  authenticateToken, 
  authorize('admin', 'superadmin'),
  validateFacility,
  settingsController.createFacility
);

router.put('/facilities/:id', 
  authenticateToken, 
  authorize('admin', 'superadmin'),
  validateFacilityUpdate,
  settingsController.updateFacility
);

router.delete('/facilities/:id', 
  authenticateToken, 
  authorize('admin', 'superadmin'),
  settingsController.deleteFacility
);

module.exports = router; 