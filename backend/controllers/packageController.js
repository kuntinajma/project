const { pool } = require('../config/database');

// Get all tour packages
const getAllPackages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM tour_packages ${whereClause}`,
      params
    );

    // Get packages with pagination
    const [packages] = await pool.execute(
      `SELECT * FROM tour_packages ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        packages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data paket wisata'
    });
  }
};

// Get package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [packages] = await pool.execute(
      'SELECT * FROM tour_packages WHERE id = ?',
      [id]
    );

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: packages[0]
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data paket wisata'
    });
  }
};

// Create new package
const createPackage = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      short_description,
      price,
      duration,
      max_participants,
      min_participants,
      includes,
      excludes,
      itinerary,
      image_url,
      gallery,
      is_featured,
      is_active
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO tour_packages (name, slug, description, short_description, price, duration, max_participants, min_participants, includes, excludes, itinerary, image_url, gallery, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_description, price, duration, max_participants || 10, min_participants || 2, JSON.stringify(includes || []), JSON.stringify(excludes || []), JSON.stringify(itinerary || []), image_url, JSON.stringify(gallery || []), is_featured || false, is_active !== false]
    );

    const [newPackage] = await pool.execute(
      'SELECT * FROM tour_packages WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Paket wisata berhasil dibuat',
      data: newPackage[0]
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat paket wisata'
    });
  }
};

// Update package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      short_description,
      price,
      duration,
      max_participants,
      min_participants,
      includes,
      excludes,
      itinerary,
      image_url,
      gallery,
      is_featured,
      is_active
    } = req.body;

    await pool.execute(
      `UPDATE tour_packages SET name = ?, slug = ?, description = ?, short_description = ?, price = ?, duration = ?, max_participants = ?, min_participants = ?, includes = ?, excludes = ?, itinerary = ?, image_url = ?, gallery = ?, is_featured = ?, is_active = ?
       WHERE id = ?`,
      [name, slug, description, short_description, price, duration, max_participants || 10, min_participants || 2, JSON.stringify(includes || []), JSON.stringify(excludes || []), JSON.stringify(itinerary || []), image_url, JSON.stringify(gallery || []), is_featured || false, is_active !== false, id]
    );

    const [updatedPackage] = await pool.execute(
      'SELECT * FROM tour_packages WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Paket wisata berhasil diupdate',
      data: updatedPackage[0]
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update paket wisata'
    });
  }
};

// Delete package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM tour_packages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Paket wisata berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus paket wisata'
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};