const { pool } = require("../config/database");
const ARTICLE_CATEGORIES = require("../constants/articleCategories");

const articleCategories = Object.values(ARTICLE_CATEGORIES);

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Format article data for response
function formatArticle(row) {
  return {
    id: String(row.id),
    authorId: String(row.author_id),
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt ?? null,
    category: row.category,
    featuredImage: row.featured_image ?? null,
    status: row.status,
    isFeatured: !!row.is_featured,
    viewCount: row.view_count || 0,
    tags: row.tags ? JSON.parse(row.tags) : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at ?? null,
  };
}

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      status,
      author_id,
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    let params = [];

    // Filter by category
    if (category && articleCategories.includes(category)) {
      whereClause += " AND category = ?";
      params.push(category);
    }

    // Filter by status
    if (
      status &&
      ["draft", "pending", "published", "rejected"].includes(status)
    ) {
      whereClause += " AND status = ?";
      params.push(status);
    }

    // Filter by author (for user's own articles)
    if (author_id) {
      whereClause += " AND author_id = ?";
      params.push(author_id);
    }

    // Search in title and content
    if (search) {
      whereClause += " AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM articles ${whereClause}`,
      params
    );

    // Get articles with pagination
    const [rows] = await pool.execute(
      `SELECT a.*, u.name as author_name 
       FROM articles a 
       LEFT JOIN users u ON a.author_id = u.id 
       ${whereClause} 
       ORDER BY a.created_at DESC 
       LIMIT ${parseInt(limit)} OFFSET ${offset}`,
      params
    );

    const articles = rows.map((row) => ({
      ...formatArticle(row),
      authorName: row.author_name,
    }));

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data artikel",
    });
  }
};

// Get article by ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const [articles] = await pool.execute(
      `SELECT a.*, u.name as author_name 
       FROM articles a 
       LEFT JOIN users u ON a.author_id = u.id 
       WHERE a.id = ?`,
      [id]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    // Increment view count
    await pool.execute(
      "UPDATE articles SET view_count = view_count + 1 WHERE id = ?",
      [id]
    );

    const article = {
      ...formatArticle(articles[0]),
      authorName: articles[0].author_name,
    };

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil artikel",
    });
  }
};

// Get article by slug
const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [articles] = await pool.execute(
      `SELECT a.*, u.name as author_name 
       FROM articles a 
       LEFT JOIN users u ON a.author_id = u.id 
       WHERE a.slug = ?`,
      [slug]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    // Increment view count
    await pool.execute(
      "UPDATE articles SET view_count = view_count + 1 WHERE slug = ?",
      [slug]
    );

    const article = {
      ...formatArticle(articles[0]),
      authorName: articles[0].author_name,
    };

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error("Get article by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil artikel",
    });
  }
};

// Create new article
const createArticle = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt = null,
      category,
      featuredImage = null,
      status = "draft",
      isFeatured = false,
      tags = [],
    } = req.body;

    // Get author_id from authenticated user
    const authorId = req.user.id;

    // Generate unique slug
    let slug = generateSlug(title);

    // Check if slug exists and make it unique if needed
    const [existingSlugs] = await pool.execute(
      "SELECT slug FROM articles WHERE slug LIKE ?",
      [`${slug}%`]
    );

    if (existingSlugs.length > 0) {
      const existingSlugsList = existingSlugs.map((row) => row.slug);
      let counter = 1;
      let originalSlug = slug;

      while (existingSlugsList.includes(slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
    }

    // Set published_at if status is published
    const publishedAt = status === "published" ? new Date() : null;

    const [result] = await pool.execute(
      `INSERT INTO articles (
        author_id, title, slug, content, excerpt, category, 
        featured_image, status, is_featured, tags, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        authorId,
        title,
        slug,
        content,
        excerpt,
        category,
        featuredImage,
        status,
        isFeatured,
        tags.length > 0 ? JSON.stringify(tags) : null,
        publishedAt,
      ]
    );

    const [newArticle] = await pool.execute(
      `SELECT a.*, u.name as author_name 
       FROM articles a 
       LEFT JOIN users u ON a.author_id = u.id 
       WHERE a.id = ?`,
      [result.insertId]
    );

    const article = {
      ...formatArticle(newArticle[0]),
      authorName: newArticle[0].author_name,
    };

    res.status(201).json({
      success: true,
      message: "Artikel berhasil dibuat",
      data: article,
    });
  } catch (error) {
    console.error("Create article error:", error);

    // Handle duplicate slug error
    if (error.code === "ER_DUP_ENTRY" && error.message.includes("slug")) {
      return res.status(400).json({
        success: false,
        message: "Slug artikel sudah ada, silakan gunakan judul yang berbeda",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error saat membuat artikel",
    });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt = null,
      category,
      featuredImage = null,
      status,
      isFeatured = false,
      tags = [],
    } = req.body;

    // Get authenticated user
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if article exists and user has permission
    const [existingArticles] = await pool.execute(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (existingArticles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    const existingArticle = existingArticles[0];

    // Permission check: only author, admin, or superadmin can update
    if (
      existingArticle.author_id !== userId &&
      !["admin", "superadmin"].includes(userRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk mengubah artikel ini",
      });
    }

    // Generate new slug if title changed
    let slug = existingArticle.slug;
    if (title !== existingArticle.title) {
      slug = generateSlug(title);

      // Check slug uniqueness (exclude current article)
      const [existingSlugs] = await pool.execute(
        "SELECT slug FROM articles WHERE slug LIKE ? AND id != ?",
        [`${slug}%`, id]
      );

      if (existingSlugs.length > 0) {
        const existingSlugsList = existingSlugs.map((row) => row.slug);
        let counter = 1;
        let originalSlug = slug;

        while (existingSlugsList.includes(slug)) {
          slug = `${originalSlug}-${counter}`;
          counter++;
        }
      }
    }

    // Set published_at if status changes to published
    let publishedAt = existingArticle.published_at;
    if (status === "published" && existingArticle.status !== "published") {
      publishedAt = new Date();
    } else if (status !== "published") {
      publishedAt = null;
    }

    await pool.execute(
      `UPDATE articles SET 
        title = ?, slug = ?, content = ?, excerpt = ?, category = ?, 
        featured_image = ?, status = ?, is_featured = ?, tags = ?, published_at = ?
       WHERE id = ?`,
      [
        title,
        slug,
        content,
        excerpt,
        category,
        featuredImage,
        status,
        isFeatured,
        tags.length > 0 ? JSON.stringify(tags) : null,
        publishedAt,
        id,
      ]
    );

    const [updatedArticle] = await pool.execute(
      `SELECT a.*, u.name as author_name 
       FROM articles a 
       LEFT JOIN users u ON a.author_id = u.id 
       WHERE a.id = ?`,
      [id]
    );

    const article = {
      ...formatArticle(updatedArticle[0]),
      authorName: updatedArticle[0].author_name,
    };

    res.json({
      success: true,
      message: "Artikel berhasil diupdate",
      data: article,
    });
  } catch (error) {
    console.error("Update article error:", error);

    // Handle duplicate slug error
    if (error.code === "ER_DUP_ENTRY" && error.message.includes("slug")) {
      return res.status(400).json({
        success: false,
        message: "Slug artikel sudah ada, silakan gunakan judul yang berbeda",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error saat mengupdate artikel",
    });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if article exists and user has permission
    const [existingArticles] = await pool.execute(
      "SELECT * FROM articles WHERE id = ?",
      [id]
    );

    if (existingArticles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    const existingArticle = existingArticles[0];

    // Permission check: only author, admin, or superadmin can delete
    if (
      existingArticle.author_id !== userId &&
      !["admin", "superadmin"].includes(userRole)
    ) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki izin untuk menghapus artikel ini",
      });
    }

    // Delete the article
    const [result] = await pool.execute("DELETE FROM articles WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Artikel berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete article error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat menghapus artikel",
    });
  }
};

// Get featured articles
const getFeaturedArticles = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const [rows] = await pool.execute(
      `SELECT a.*, u.name as author_name 
       FROM articles a 
       LEFT JOIN users u ON a.author_id = u.id 
       WHERE a.is_featured = true AND a.status = 'published'
       ORDER BY a.created_at DESC 
       LIMIT ?`,
      [parseInt(limit)]
    );

    const articles = rows.map((row) => ({
      ...formatArticle(row),
      authorName: row.author_name,
    }));

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error("Get featured articles error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil artikel unggulan",
    });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
};
