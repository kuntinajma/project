const express = require('express');
const router = express.Router();
const umkmController = require('../controllers/umkmController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', umkmController.getAllUMKM);
router.get('/:id', umkmController.getUMKMById);

// Protected routes (admin only)
router.post('/', authenticateToken, umkmController.createUMKM);
router.put('/:id', authenticateToken, umkmController.updateUMKM);
router.delete('/:id', authenticateToken, umkmController.deleteUMKM);

module.exports = router;