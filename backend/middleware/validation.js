const { body, param, query, validationResult } = require("express-validator");
const USER_ROLE = require("../constants/roles");
const DESTINATION_CATEGORIES = require("../constants/destinationCategories");
const ARTICLE_CATEGORIES = require("../constants/articleCategories");
const CULTURE_CATEGORIES = require("../constants/cultureCategories");

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }
  next();
};

const roles = Object.values(USER_ROLE);
const destinationCategories = Object.values(DESTINATION_CATEGORIES);
const articleCategories = Object.values(ARTICLE_CATEGORIES);
const cultureCategories = Object.values(CULTURE_CATEGORIES);

// User validation rules
const validateUser = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Nama harus 2-255 karakter"),
  body("email").isEmail().normalizeEmail().withMessage("Email tidak valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
  body("role").optional().isIn(roles).withMessage("Role tidak valid"),
  body("is_active").optional().toBoolean(),
  handleValidationErrors,
];

const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Nama harus 2-255 karakter"),
  body("role").optional().isIn(roles).withMessage("Role tidak valid"),
  body("is_active").optional().toBoolean(),
  handleValidationErrors,
];

// Login validation
const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Email tidak valid"),
  body("password").notEmpty().withMessage("Password diperlukan"),
  handleValidationErrors,
];

// Destination validation
const validateDestination = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Judul harus 3-255 karakter"),
  body("shortDescription")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Deskripsi singkat harus 10-500 karakter"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage("Deskripsi minimal 50 karakter"),
  body("category")
    .isIn(destinationCategories)
    .withMessage("Kategori tidak valid"),
  body("image")
    .optional()
    .isString()
    .withMessage("URL gambar utama tidak valid"),
  body("location")
    .optional()
    .custom((location) => {
      if (
        location &&
        (typeof location.lat !== "number" || typeof location.lng !== "number")
      ) {
        throw new Error("Lokasi harus berisi lat dan lng yang berupa angka");
      }
      if (
        location &&
        (location.lat < -90 ||
          location.lat > 90 ||
          location.lng < -180 ||
          location.lng > 180)
      ) {
        throw new Error("Koordinat lokasi tidak valid");
      }
      return true;
    }),
  body("gallery")
    .optional()
    .custom((gallery) => {
      if (gallery === null) return true;
      if (!Array.isArray(gallery)) {
        throw new Error("Galeri harus berupa array");
      }
      for (const url of gallery) {
        if (typeof url !== "string") {
          throw new Error("Semua item galeri harus berupa URL valid");
        }
      }
      return true;
    }),
  handleValidationErrors,
];

// Tour package validation
const validateTourPackage = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Nama paket harus 3-255 karakter"),
  body("description")
    .trim()
    .isLength({ min: 50 })
    .withMessage("Deskripsi minimal 50 karakter"),
  body("price").isFloat({ min: 0 }).withMessage("Harga harus angka positif"),
  body("duration").trim().notEmpty().withMessage("Durasi diperlukan"),
  body("minPersons")
    .isInt({ min: 1 })
    .withMessage("Minimal peserta harus angka positif"),
  body("maxPersons")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Maksimal peserta harus angka positif"),
  body("whatsappContact")
    .isMobilePhone("id-ID")
    .withMessage("Nomor WhatsApp tidak valid"),
  body("facilities")
    .isArray({ min: 1 })
    .withMessage("Minimal 1 fasilitas diperlukan"),
  body("image").optional().isURL().withMessage("URL gambar tidak valid"),
  body("popular").optional().isBoolean().withMessage("Popular harus boolean"),
  handleValidationErrors,
];

// culture
const validateCulture = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Judul harus 3-255 karakter"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Deskripsi minimal 10 karakter"),
  body("category").isIn(cultureCategories).withMessage("Kategori tidak valid"),
  body("image").optional().withMessage("URL gambar tidak valid"),
  body("gallery")
    .optional()
    .custom((gallery) => {
      if (gallery === null) return true;
      if (!Array.isArray(gallery)) {
        throw new Error("Galeri harus berupa array");
      }
      for (const url of gallery) {
        if (typeof url !== "string") {
          throw new Error("Semua item galeri harus berupa URL valid");
        }
      }
      return true;
    }),
  handleValidationErrors,
];

//MSME
const validateMSME = [
  body("brand")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Nama brand harus 3-255 karakter"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Deskripsi maksimal 1000 karakter"),
  body("phone")
    .optional()
    .isMobilePhone("id-ID")
    .withMessage("Nomor telepon tidak valid"),
  body("instagram").optional().isURL().withMessage("URL gambar tidak valid"),
  body("shopee").optional().isURL().withMessage("URL gambar tidak valid"),
  body("whatsapp")
    .optional()
    .isMobilePhone("id-ID")
    .withMessage("Nomor WhatsApp tidak valid"),
];

// Product validation
const validateProduct = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Nama produk harus 3-255 karakter"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Harga harus berupa angka positif"),
  body("image").optional().withMessage("URL gambar tidak valid"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Deskripsi harus 10-1000 karakter"),
  body("material")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Material harus 3-255 karakter"),
  body("durability")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Durabilitas harus 3-255 karakter"),
  body("deliveryTime")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Waktu pengiriman harus 3-255 karakter"),
  body("msme_id")
    .isInt({ min: 1 })
    .withMessage("MSME ID harus berupa angka positif"),
  body("relatedProducts")
    .optional()
    .isArray()
    .withMessage("Related products harus berupa array"),
  body("relatedProducts.*")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Related product ID harus berupa angka positif"),
];

// Article validation
const validateArticle = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage("Judul harus 5-255 karakter"),
  body("excerpt")
    .trim()
    .isLength({ min: 20, max: 500 })
    .withMessage("Excerpt harus 20-500 karakter"),
  body("content")
    .trim()
    .isLength({ min: 100 })
    .withMessage("Konten minimal 100 karakter"),
  body("category").isIn(articleCategories).withMessage("Kategori tidak valid"),
  handleValidationErrors,
];

// ID parameter validation
const validateId = [
  param("id").isInt({ min: 1 }).withMessage("ID harus angka positif"),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page harus angka positif"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit harus 1-100"),
  handleValidationErrors,
];

module.exports = {
  validateUser,
  validateUserUpdate,
  validateLogin,
  validateDestination,
  validateTourPackage,
  validateCulture,
  validateProduct,
  validateArticle,
  validateMSME,
  validateId,
  validatePagination,
  handleValidationErrors,
};
