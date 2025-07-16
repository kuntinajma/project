const { pool } = require('../config/database');

// Get all destinations
const getAllDestinations = async (req, res) => {
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
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM destinations ${whereClause}`,
      params
    );

    // Get destinations with pagination
    const [destinations] = await pool.execute(
      `SELECT * FROM destinations ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        destinations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data destinasi'
    });
  }
};

// Get destination by ID
const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [destinations] = await pool.execute(
      'SELECT * FROM destinations WHERE id = ?',
      [id]
    );

    if (destinations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: destinations[0]
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data destinasi'
    });
  }
};

// Create new destination
const createDestination = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      short_description,
      location,
      latitude,
      longitude,
      image_url,
      gallery,
      facilities,
      opening_hours,
      ticket_price,
      category,
      is_featured,
      is_active
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO destinations (name, slug, description, short_description, location, latitude, longitude, image_url, gallery, facilities, opening_hours, ticket_price, category, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_description, location, latitude, longitude, image_url, JSON.stringify(gallery || []), JSON.stringify(facilities || []), opening_hours, ticket_price || 0, category, is_featured || false, is_active !== false]
    );

    const [newDestination] = await pool.execute(
      'SELECT * FROM destinations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Destinasi berhasil dibuat',
      data: newDestination[0]
    });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat destinasi'
    });
  }
};

// Update destination
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      short_description,
      location,
      latitude,
      longitude,
      image_url,
      gallery,
      facilities,
      opening_hours,
      ticket_price,
      category,
      is_featured,
      is_active
    } = req.body;

    await pool.execute(
      `UPDATE destinations SET name = ?, slug = ?, description = ?, short_description = ?, location = ?, latitude = ?, longitude = ?, image_url = ?, gallery = ?, facilities = ?, opening_hours = ?, ticket_price = ?, category = ?, is_featured = ?, is_active = ?
       WHERE id = ?`,
      [name, slug, description, short_description, location, latitude, longitude, image_url, JSON.stringify(gallery || []), JSON.stringify(facilities || []), opening_hours, ticket_price || 0, category, is_featured || false, is_active !== false, id]
    );

    const [updatedDestination] = await pool.execute(
      'SELECT * FROM destinations WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Destinasi berhasil diupdate',
      data: updatedDestination[0]
    });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update destinasi'
    });
  }
};

// Delete destination
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM destinations WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Destinasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus destinasi'
    });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
};