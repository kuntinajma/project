const { body, param, query, validationResult } = require('express-validator');
const USER_ROLE = require("../constants/roles");
const DESTINATION_CATEGORIES = require("../constants/destinationCategories");
const ARTICLE_CATEGORIES = require('../constants/articleCategories');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

const roles = Object.values(USER_ROLE);
const destinationCategories = Object.values(DESTINATION_CATEGORIES);
const articleCategories = Object.values(ARTICLE_CATEGORIES);

// User validation rules
const validateUser = [
  body('name').trim().isLength({ min: 2, max: 255 }).withMessage('Nama harus 2-255 karakter'),
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').optional().isIn(roles).withMessage('Role tidak valid'),
  handleValidationErrors
];

const validateUserUpdate = [
  body('name').optional().trim().isLength({ min: 2, max: 255 }).withMessage('Nama harus 2-255 karakter'),
  body('role').optional().isIn(roles).withMessage('Role tidak valid'),
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Email tidak valid'),
  body('password').notEmpty().withMessage('Password diperlukan'),
  handleValidationErrors
];

// Destination validation
const validateDestination = [
  body('title').trim().isLength({ min: 3, max: 255 }).withMessage('Judul harus 3-255 karakter'),
  body('short_description').trim().isLength({ min: 10, max: 500 }).withMessage('Deskripsi singkat harus 10-500 karakter'),
  body('description').trim().isLength({ min: 50 }).withMessage('Deskripsi minimal 50 karakter'),
  body('category').isIn(destinationCategories).withMessage('Kategori tidak valid'),
  body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Latitude tidak valid'),
  body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Longitude tidak valid'),
  handleValidationErrors
];

// Tour package validation
const validateTourPackage = [
  body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Nama paket harus 3-255 karakter'),
  body('description').trim().isLength({ min: 50 }).withMessage('Deskripsi minimal 50 karakter'),
  body('price').isFloat({ min: 0 }).withMessage('Harga harus angka positif'),
  body('duration').trim().notEmpty().withMessage('Durasi diperlukan'),
  body('min_persons').isInt({ min: 1 }).withMessage('Minimal peserta harus angka positif'),
  body('max_persons').optional().isInt({ min: 1 }).withMessage('Maksimal peserta harus angka positif'),
  body('whatsapp_contact').isMobilePhone('id-ID').withMessage('Nomor WhatsApp tidak valid'),
  body('facilities').isArray({ min: 1 }).withMessage('Minimal 1 fasilitas diperlukan'),
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name').trim().isLength({ min: 3, max: 255 }).withMessage('Nama produk harus 3-255 karakter'),
  body('description').trim().isLength({ min: 20 }).withMessage('Deskripsi minimal 20 karakter'),
  body('price').isFloat({ min: 0 }).withMessage('Harga harus angka positif'),
  body('stock_quantity').optional().isInt({ min: 0 }).withMessage('Stok harus angka non-negatif'),
  body('min_order').optional().isInt({ min: 1 }).withMessage('Minimal order harus angka positif'),
  body('material').optional().trim().isLength({ max: 255 }).withMessage('Material maksimal 255 karakter'),
  body('delivery_time').optional().trim().isLength({ max: 100 }).withMessage('Waktu pengiriman maksimal 100 karakter'),
  handleValidationErrors
];

// Article validation
const validateArticle = [
  body('title').trim().isLength({ min: 5, max: 255 }).withMessage('Judul harus 5-255 karakter'),
  body('excerpt').trim().isLength({ min: 20, max: 500 }).withMessage('Excerpt harus 20-500 karakter'),
  body('content').trim().isLength({ min: 100 }).withMessage('Konten minimal 100 karakter'),
  body('category').isIn(articleCategories).withMessage('Kategori tidak valid'),
  handleValidationErrors
];

// MSME validation
const validateMSME = [
  body('business_name').trim().isLength({ min: 3, max: 255 }).withMessage('Nama bisnis harus 3-255 karakter'),
  body('business_type').optional().trim().isLength({ max: 100 }).withMessage('Tipe bisnis maksimal 100 karakter'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Deskripsi maksimal 1000 karakter'),
  body('phone').optional().isMobilePhone('id-ID').withMessage('Nomor telepon tidak valid'),
  body('whatsapp').optional().isMobilePhone('id-ID').withMessage('Nomor WhatsApp tidak valid'),
  body('email').optional().isEmail().withMessage('Email tidak valid'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id').isInt({ min: 1 }).withMessage('ID harus angka positif'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page harus angka positif'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit harus 1-100'),
  handleValidationErrors
];

module.exports = {
  validateUser,
  validateUserUpdate,
  validateLogin,
  validateDestination,
  validateTourPackage,
  validateProduct,
  validateArticle,
  validateMSME,
  validateId,
  validatePagination,
  handleValidationErrors
};