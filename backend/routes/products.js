const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (authenticated users only)
router.post('/', authenticateToken, validateProduct, productController.createProduct);
router.put('/:id', authenticateToken, validateProduct, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;