const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { validateId, validatePagination, validateArticle } = require('../middleware/validation');

// Public routes
router.get('/', validatePagination, articleController.getAllArticles);
router.get('/featured', articleController.getFeaturedArticles);
router.get('/slug/:slug', articleController.getArticleBySlug);
router.get('/:id', validateId, articleController.getArticleById);

// Protected routes
router.post('/', 
  authenticateToken, 
  validateArticle,
  // Only authenticated users can create articles
  articleController.createArticle
);

router.put('/:id', 
  authenticateToken, 
  validateId,
  validateArticle,
  // Only the author, admin, or superadmin can update articles
  articleController.updateArticle
);

router.delete('/:id', 
  authenticateToken, 
  validateId,
  // Only the author, admin, or superadmin can delete articles
  articleController.deleteArticle
);

module.exports = router;
