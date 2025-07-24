const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateUser, validateUserUpdate, validateId, validatePagination, validatePasswordChange } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken);

// Get all users (superadmin only)
router.get('/', authorize('superadmin'), validatePagination, userController.getAllUsers);

// Get user roles (for dropdowns)
router.get('/roles', authorize('superadmin'), userController.getUserRoles);

// Get user by ID (superadmin only)
router.get('/:id', authorize('superadmin'), validateId, userController.getUserById);

// Create new user (superadmin only)
router.post('/', authorize('superadmin'), validateUser, userController.createUser);

// Update user (superadmin only)
router.put('/:id', authorize('superadmin'), validateId, validateUserUpdate, userController.updateUser);

// Change user password (superadmin only)
router.put('/:id/password', authorize('superadmin'), validateId, validatePasswordChange, userController.changeUserPassword);

// Delete user (superadmin only)
router.delete('/:id', authorize('superadmin'), validateId, userController.deleteUser);

// Toggle user status (superadmin only)
router.patch('/:id/toggle-status', authorize('superadmin'), validateId, userController.toggleUserStatus);

module.exports = router;