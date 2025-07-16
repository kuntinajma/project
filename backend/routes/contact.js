const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/', contactController.createMessage);

// Protected routes (admin only)
router.get('/', authenticateToken, contactController.getAllMessages);
router.get('/:id', authenticateToken, contactController.getMessageById);
router.put('/:id/reply', authenticateToken, contactController.replyMessage);
router.delete('/:id', authenticateToken, contactController.deleteMessage);

module.exports = router;