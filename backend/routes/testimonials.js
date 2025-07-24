const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { authenticateToken } = require('../middleware/auth');
const { validateId, validatePagination, validateTestimonial } = require('../middleware/validation');

// Public routes
router.get('/featured', testimonialsController.getFeaturedTestimonials);
router.post('/', validateTestimonial, testimonialsController.createTestimonial);

// Protected routes (admin only)
router.get('/', authenticateToken, validatePagination, testimonialsController.getAllTestimonials);
router.get('/:id', authenticateToken, validateId, testimonialsController.getTestimonialById);
router.put('/:id', authenticateToken, validateId, validateTestimonial, testimonialsController.updateTestimonial);
router.delete('/:id', authenticateToken, validateId, testimonialsController.deleteTestimonial);

module.exports = router;
