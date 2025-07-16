const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', destinationController.getAllDestinations);
router.get('/:id', destinationController.getDestinationById);

// Protected routes (admin only)
router.post('/', authenticateToken, destinationController.createDestination);
router.put('/:id', authenticateToken, destinationController.updateDestination);
router.delete('/:id', authenticateToken, destinationController.deleteDestination);

module.exports = router;