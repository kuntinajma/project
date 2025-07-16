const { pool } = require('../config/database');

// Get all UMKM
const getAllUMKM = async (req, res) => {
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
      whereClause += ' AND (business_name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM umkm ${whereClause}`,
      params
    );

    // Get UMKM with pagination
    const [umkm] = await pool.execute(
      `SELECT * FROM umkm ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        umkm,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get UMKM error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data UMKM'
    });
  }
};

// Get UMKM by ID
const getUMKMById = async (req, res) => {
  try {
    const { id } = req.params;

    const [umkm] = await pool.execute(
      'SELECT * FROM umkm WHERE id = ?',
      [id]
    );

    if (umkm.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: umkm[0]
    });
  } catch (error) {
    console.error('Get UMKM error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data UMKM'
    });
  }
};

// Create new UMKM
const createUMKM = async (req, res) => {
  try {
    const {
      business_name,
      slug,
      owner_name,
      description,
      category,
      phone,
      whatsapp,
      address,
      image_url,
      gallery,
      products,
      social_media,
      is_featured,
      is_active
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO umkm (business_name, slug, owner_name, description, category, phone, whatsapp, address, image_url, gallery, products, social_media, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [business_name, slug, owner_name, description, category, phone, whatsapp, address, image_url, JSON.stringify(gallery || []), JSON.stringify(products || []), JSON.stringify(social_media || {}), is_featured || false, is_active !== false]
    );

    const [newUMKM] = await pool.execute(
      'SELECT * FROM umkm WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'UMKM berhasil dibuat',
      data: newUMKM[0]
    });
  } catch (error) {
    console.error('Create UMKM error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat UMKM'
    });
  }
};

// Update UMKM
const updateUMKM = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      business_name,
      slug,
      owner_name,
      description,
      category,
      phone,
      whatsapp,
      address,
      image_url,
      gallery,
      products,
      social_media,
      is_featured,
      is_active
    } = req.body;

    await pool.execute(
      `UPDATE umkm SET business_name = ?, slug = ?, owner_name = ?, description = ?, category = ?, phone = ?, whatsapp = ?, address = ?, image_url = ?, gallery = ?, products = ?, social_media = ?, is_featured = ?, is_active = ?
       WHERE id = ?`,
      [business_name, slug, owner_name, description, category, phone, whatsapp, address, image_url, JSON.stringify(gallery || []), JSON.stringify(products || []), JSON.stringify(social_media || {}), is_featured || false, is_active !== false, id]
    );

    const [updatedUMKM] = await pool.execute(
      'SELECT * FROM umkm WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'UMKM berhasil diupdate',
      data: updatedUMKM[0]
    });
  } catch (error) {
    console.error('Update UMKM error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update UMKM'
    });
  }
};

// Delete UMKM
const deleteUMKM = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM umkm WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'UMKM tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'UMKM berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete UMKM error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus UMKM'
    });
  }
};

module.exports = {
  getAllUMKM,
  getUMKMById,
  createUMKM,
  updateUMKM,
  deleteUMKM
};