const { pool } = require('../config/database');

// Get all culture
const getAllCulture = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      whereClause += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM culture ${whereClause}`,
      params
    );

    // Get culture with pagination
    const [culture] = await pool.execute(
      `SELECT * FROM culture ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        culture,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get culture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data budaya'
    });
  }
};

// Get culture by ID
const getCultureById = async (req, res) => {
  try {
    const { id } = req.params;

    const [culture] = await pool.execute(
      'SELECT * FROM culture WHERE id = ?',
      [id]
    );

    if (culture.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Budaya tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: culture[0]
    });
  } catch (error) {
    console.error('Get culture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data budaya'
    });
  }
};

// Create new culture
const createCulture = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      short_description,
      category,
      image_url,
      gallery,
      video_url,
      history,
      significance,
      is_featured,
      is_active
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO culture (title, slug, description, short_description, category, image_url, gallery, video_url, history, significance, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, description, short_description, category, image_url, JSON.stringify(gallery || []), video_url, history, significance, is_featured || false, is_active !== false]
    );

    const [newCulture] = await pool.execute(
      'SELECT * FROM culture WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Budaya berhasil dibuat',
      data: newCulture[0]
    });
  } catch (error) {
    console.error('Create culture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat budaya'
    });
  }
};

// Update culture
const updateCulture = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      description,
      short_description,
      category,
      image_url,
      gallery,
      video_url,
      history,
      significance,
      is_featured,
      is_active
    } = req.body;

    await pool.execute(
      `UPDATE culture SET title = ?, slug = ?, description = ?, short_description = ?, category = ?, image_url = ?, gallery = ?, video_url = ?, history = ?, significance = ?, is_featured = ?, is_active = ?
       WHERE id = ?`,
      [title, slug, description, short_description, category, image_url, JSON.stringify(gallery || []), video_url, history, significance, is_featured || false, is_active !== false, id]
    );

    const [updatedCulture] = await pool.execute(
      'SELECT * FROM culture WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Budaya berhasil diupdate',
      data: updatedCulture[0]
    });
  } catch (error) {
    console.error('Update culture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update budaya'
    });
  }
};

// Delete culture
const deleteCulture = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM culture WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Budaya tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Budaya berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete culture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus budaya'
    });
  }
};

module.exports = {
  getAllCulture,
  getCultureById,
  createCulture,
  updateCulture,
  deleteCulture
};