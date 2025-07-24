const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Public routes - no authentication required
router.get('/', homeController.getHomeData);
router.get('/transportation', homeController.getTransportationData);

module.exports = router; 