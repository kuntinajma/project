const { pool } = require("../config/database");

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
    user_id: String(row.user_id),
  };
}

// Get all MSMEs
const getAllMSMEs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, user_id } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build query using string concatenation instead of parameter binding for LIMIT/OFFSET
    let whereClause = "WHERE 1=1";
    let params = [];

    if (user_id) {
      whereClause += " AND user_id = ?";
      params.push(parseInt(user_id));
    }

    if (search) {
      whereClause += " AND (brand LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM msmes ${whereClause}`,
      params
    );

    // Get MSMEs with pagination - use string concatenation for LIMIT/OFFSET
    const [rows] = await pool.execute(
      `SELECT * FROM msmes ${whereClause} ORDER BY created_at DESC LIMIT ${limitNum} OFFSET ${offset}`,
      params
    );

    // Format each row
    const msmes = rows.map(formatMSME);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        msmes,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
        },
      },
    });
  } catch (error) {
    console.error("Get MSMEs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data MSME",
    });
  }
};

// Get MSME by ID
const getMSMEById = async (req, res) => {
  try {
    const { id } = req.params;

    const [msmes] = await pool.execute("SELECT * FROM msmes WHERE id = ?", [
      id,
    ]);

    if (msmes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "MSME tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: formatMSME(msmes[0]),
    });
  } catch (error) {
    console.error("Get MSME error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data MSME",
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
      whatsapp = null,
      user_id,
    } = req.body;

    // Validasi: user_id harus ada
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id wajib diisi",
      });
    }

    // Validasi: user_id harus role msme
    const [users] = await pool.execute("SELECT * FROM users WHERE id = ?", [
      user_id,
    ]);
    if (!users.length || users[0].role !== "msme") {
      return res.status(400).json({
        success: false,
        message: "User harus berperan sebagai msme",
      });
    }

    // Validasi: user_id belum punya UMKM
    const [msmes] = await pool.execute(
      "SELECT * FROM msmes WHERE user_id = ?",
      [user_id]
    );
    if (msmes.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User ini sudah memiliki UMKM",
      });
    }

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
      [brand, description, phone, instagram, shopee, whatsapp, user_id]
    );

    const [newMSME] = await pool.execute("SELECT * FROM msmes WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      success: true,
      message: "MSME berhasil dibuat",
      data: formatMSME(newMSME[0]),
    });
  } catch (error) {
    console.error("Create MSME error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat membuat MSME",
    });
  }
};

// Update MSME
const updateMSME = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      brand,
      description,
      phone,
      instagram = null,
      shopee = null,
      whatsapp = null,
    } = req.body;

    const [existingMSME] = await pool.execute(
      "SELECT * FROM msmes WHERE id = ?",
      [id]
    );

    if (existingMSME.length === 0) {
      return res.status(404).json({
        success: false,
        message: "MSME tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    await pool.execute(
      `UPDATE msmes
       SET brand = ?, description = ?, phone = ?, instagram = ?, shopee = ?, whatsapp = ?
       WHERE id = ?`,
      [brand, description, phone, instagram, shopee, whatsapp, id]
    );

    const [rows] = await pool.execute("SELECT * FROM msmes WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "MSME tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "MSME berhasil diupdate",
      data: formatMSME(rows[0]),
    });
  } catch (error) {
    console.error("Update MSME error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat update MSME",
    });
  }
};

// Delete MSME
const deleteMSME = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute("DELETE FROM msmes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "MSME tidak ditemukan atau Anda tidak memiliki akses",
      });
    }

    res.json({
      success: true,
      message: "MSME berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete MSME error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat menghapus MSME",
    });
  }
};

module.exports = {
  getAllMSMEs,
  getMSMEById,
  createMSME,
  updateMSME,
  deleteMSME,
};
