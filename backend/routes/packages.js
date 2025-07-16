const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', packageController.getAllPackages);
router.get('/:id', packageController.getPackageById);

// Protected routes (admin only)
router.post('/', authenticateToken, packageController.createPackage);
router.put('/:id', authenticateToken, packageController.updatePackage);
router.delete('/:id', authenticateToken, packageController.deletePackage);

module.exports = router;