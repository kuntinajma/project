const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', testimonialsController.getAllTestimonials);
router.post('/', testimonialsController.createTestimonial);

// Protected routes (admin only)
router.put('/:id', authenticateToken, testimonialsController.updateTestimonial);
router.delete('/:id', authenticateToken, testimonialsController.deleteTestimonial);

module.exports = router;
