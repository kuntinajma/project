const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (admin only)
router.get('/stats', authenticateToken, dashboardController.getDashboardStats);

module.exports = router;