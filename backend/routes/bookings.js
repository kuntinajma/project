const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/', bookingController.createBooking);

// Protected routes (admin only)
router.get('/', authenticateToken, bookingController.getAllBookings);
router.get('/:id', authenticateToken, bookingController.getBookingById);
router.put('/:id/status', authenticateToken, bookingController.updateBookingStatus);
router.delete('/:id', authenticateToken, bookingController.deleteBooking);

module.exports = router;