const { pool } = require('../config/database');

// format raw db data to desired JSON output
function formatMSME(row) {
  return {
    id: String(row.id),
    brand: row.brand,
    description: row.description,
    phone: row.phone,
    instagram: row.instagram ?? null,
    shopee: row.shopee ?? null,
    whatsapp: row.whatsapp ?? null,
    user_id: String(row.user_id)
  };
}

// Get all MSMEs
const getAllMSMEs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, user_id } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (user_id) {
      whereClause += ' AND user_id = ?';
      params.push(user_id);
    }

    if (search) {
      whereClause += ' AND (brand LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM msmes ${whereClause}`,
      params
    );

    // Get MSMEs with pagination
    const [rows] = await pool.execute(
      `SELECT * FROM msmes ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Format each row
    const msmes = rows.map(formatMSME);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        msmes,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get MSMEs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data MSME'
    });
  }
};

// Get MSME by ID
const getMSMEById = async (req, res) => {
  try {
    const { id } = req.params;

    const [msmes] = await pool.execute(
      'SELECT * FROM msmes WHERE id = ?',
      [id]
    );

    if (msmes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'MSME tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: formatMSME(msmes[0])
    });
  } catch (error) {
    console.error('Get MSME error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data MSME'
    });
  }
};

// Create new MSME
const createMSME = async (req, res) => {
  try {
    const {
      brand,
      description,
      phone,
      instagram = null,
      shopee = null,
      whatsapp = null
    } = req.body;
    
    // Get user_id from authenticated user
    const user_id = req.user.id;

    const [result] = await pool.execute(
      `INSERT INTO msmes (
        brand,
        description,
        phone,
        instagram,
        shopee,
        whatsapp,
        user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        brand,
        description,
        phone,
        instagram,
        shopee,
        whatsapp,
        user_id
      ]
    );

    const [newMSME] = await pool.execute(
      'SELECT * FROM msmes WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'MSME berhasil dibuat',
      data: formatMSME(newMSME[0])
    });
  } catch (error) {
    console.error('Create MSME error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat MSME'
    });
  }
};

// Update MSME
const updateMSME = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user_id from authenticated user
    const user_id = req.user.id;

    const {
      brand,
      description,
      phone,
      instagram = null,
      shopee = null,
      whatsapp = null
    } = req.body;

    // Check if MSME belongs to authenticated user
    const [existingMSME] = await pool.execute(
      'SELECT * FROM msmes WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existingMSME.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'MSME tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    await pool.execute(
      `UPDATE msmes
       SET brand = ?, description = ?, phone = ?, instagram = ?, shopee = ?, whatsapp = ?
       WHERE id = ? AND user_id = ?`,
      [
        brand,
        description,
        phone,
        instagram,
        shopee,
        whatsapp,
        id,
        user_id
      ]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM msmes WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'MSME tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'MSME berhasil diupdate',
      data: formatMSME(rows[0])
    });
  } catch (error) {
    console.error('Update MSME error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update MSME'
    });
  }
};

// Delete MSME
const deleteMSME = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user_id from authenticated user
    const user_id = req.user.id;

    const [result] = await pool.execute(
      'DELETE FROM msmes WHERE id = ? AND user_id = ?', 
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'MSME tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    res.json({
      success: true,
      message: 'MSME berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete MSME error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus MSME'
    });
  }
};

module.exports = {
  getAllMSMEs,
  getMSMEById,
  createMSME,
  updateMSME,
  deleteMSME
};