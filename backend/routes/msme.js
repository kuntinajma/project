const express = require('express');
const router = express.Router();
const msmeController = require('../controllers/msmeController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', msmeController.getAllMSMEs);
router.get('/:id', msmeController.getMSMEById);

// Protected routes (authenticated users only)
router.post('/', authenticateToken, msmeController.createMSME);
router.put('/:id', authenticateToken, msmeController.updateMSME);
router.delete('/:id', authenticateToken, msmeController.deleteMSME);

module.exports = router;