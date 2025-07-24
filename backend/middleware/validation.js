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
  body("role")
    .isIn(roles)
    .withMessage(`Role harus salah satu dari: ${roles.join(', ')}`),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("Status aktif tidak valid"),
  handleValidationErrors,
];

const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Nama harus 2-255 karakter"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email tidak valid"),
  body("role")
    .optional()
    .isIn(roles)
    .withMessage(`Role harus salah satu dari: ${roles.join(', ')}`),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("Status aktif tidak valid"),
  handleValidationErrors,
];

const validatePasswordChange = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password minimal 6 karakter"),
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
  body("image").optional().isString().withMessage("URL gambar tidak valid"),
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

// MSME
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
  body("instagram").optional().isURL().withMessage("URL Instagram tidak valid"),
  body("shopee").optional().isURL().withMessage("URL Shopee tidak valid"),
  body("whatsapp")
    .optional()
    .isMobilePhone("id-ID")
    .withMessage("Nomor WhatsApp tidak valid"),
  handleValidationErrors,
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
  body("image").optional().isString().withMessage("URL gambar tidak valid"),
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
  handleValidationErrors,
];

// Article validation
const validateArticle = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage("Judul harus 5-255 karakter"),
  body("content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Konten artikel minimal 10 karakter"),
  body("category")
    .trim()
    .isIn(["tips", "tourism", "culture", "msmes", "environment"])
    .withMessage("Kategori tidak valid"),
  body("excerpt")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Ringkasan maksimal 500 karakter"),
  body("featuredImage")
    .optional({ nullable: true })
    .custom((value) => {
      if (value === null || value === '') return true;
      // Simple URL validation
      try {
        if (typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    })
    .withMessage("URL gambar tidak valid"),
  body("tags")
    .optional()
    .custom((value) => {
      if (value === null || (Array.isArray(value) && value.every(item => typeof item === 'string'))) {
        return true;
      }
      return false;
    })
    .withMessage("Tags harus berupa array string atau null"),
  body("status")
    .optional()
    .isIn(["draft", "pending", "published", "rejected"])
    .withMessage("Status tidak valid"),
  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured harus boolean"),
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

// Contact message validation
const validateContactMessage = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nama harus 2-100 karakter"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Email tidak valid"),
  body("phone")
    .optional()
    .isMobilePhone("id-ID")
    .withMessage("Nomor telepon tidak valid"),
  body("subject")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Subject maksimal 200 karakter"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Pesan harus 10-1000 karakter"),
  handleValidationErrors,
];

const validateContactReply = [
  body("admin_reply")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Balasan harus 10-1000 karakter"),
  handleValidationErrors,
];

// Testimonial validation
const validateTestimonial = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Nama harus 2-255 karakter"),
  body("star")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating bintang harus antara 1-5"),
  body("origin")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Asal maksimal 255 karakter"),
  body("message")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Pesan harus 10-1000 karakter"),
  handleValidationErrors,
];

// Facility validation
const validateFacility = [
  body("icon")
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Icon harus 1-10 karakter"),
  body("label")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Label harus 2-100 karakter"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Deskripsi maksimal 255 karakter"),
  body("available")
    .optional()
    .isBoolean()
    .withMessage("Status ketersediaan harus berupa boolean"),
  handleValidationErrors,
];

// Facility update validation (all fields optional)
const validateFacilityUpdate = [
  body("icon")
    .optional()
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage("Icon harus 1-10 karakter"),
  body("label")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Label harus 2-100 karakter"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Deskripsi maksimal 255 karakter"),
  body("available")
    .optional()
    .isBoolean()
    .withMessage("Status ketersediaan harus berupa boolean"),
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
  validatePasswordChange,
  handleValidationErrors,
  validateContactMessage,
  validateContactReply,
  validateTestimonial,
  validateFacility,
  validateFacilityUpdate,
};
