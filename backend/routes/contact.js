const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateContactMessage, validateContactReply, validateId } = require('../middleware/validation');

// Public routes
router.post('/', validateContactMessage, contactController.createMessage);

// Protected routes (admin only)
router.get('/', authenticateToken, contactController.getAllMessages);
router.get('/unread-count', authenticateToken, contactController.getUnreadCount);
router.get('/:id', authenticateToken, validateId, contactController.getMessageById);
router.put('/:id/reply', authenticateToken, validateId, validateContactReply, contactController.replyMessage);
router.patch('/:id/mark-read', authenticateToken, validateId, contactController.markAsRead);
router.delete('/:id', authenticateToken, validateId, contactController.deleteMessage);

module.exports = router;