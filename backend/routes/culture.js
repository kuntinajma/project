const express = require('express');
const router = express.Router();
const cultureController = require('../controllers/cultureController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', cultureController.getAllCulture);
router.get('/:id', cultureController.getCultureById);

// Protected routes (admin only)
router.post('/', authenticateToken, cultureController.createCulture);
router.put('/:id', authenticateToken, cultureController.updateCulture);
router.delete('/:id', authenticateToken, cultureController.deleteCulture);

module.exports = router;