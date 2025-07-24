const express = require("express");
const router = express.Router();
const articleController = require("../controllers/articleController");
const { authenticateToken } = require("../middleware/auth");
const { validateArticle, validateId } = require("../middleware/validation");

// Public routes
router.get("/", articleController.getAllArticles);
router.get("/featured", articleController.getFeaturedArticles);
router.get("/:id", validateId, articleController.getArticleById);
router.get("/slug/:slug", articleController.getArticleBySlug);

// Protected routes (authenticated users only)
router.post(
  "/",
  authenticateToken,
  validateArticle,
  articleController.createArticle
);
router.put(
  "/:id",
  authenticateToken,
  validateId,
  validateArticle,
  articleController.updateArticle
);
router.delete(
  "/:id",
  authenticateToken,
  validateId,
  articleController.deleteArticle
);

module.exports = router;
