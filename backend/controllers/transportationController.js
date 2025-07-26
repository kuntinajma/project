const { pool } = require("../config/database");

// Format raw db data to desired JSON output
function formatTransportation(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    phone: row.phone,
    whatsapp: row.whatsapp || null,
    departureTime: row.departure_time,
    dockLocation: row.dock_location,
    capacity: row.capacity,
    pricePerPerson: row.price_per_person,
    duration: row.duration,
    status: row.status,
    notes: row.notes || null,
  };
}

// Get all transportation
const getAllTransportation = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    let params = [];

    // Check if type column exists before adding it to the query
    try {
      // First check if the column exists
      const [columns] = await pool.execute(
        "SHOW COLUMNS FROM transportation LIKE 'type'"
      );
      
      if (columns.length > 0 && type && type !== 'all') {
        whereClause += " AND type = ?";
        params.push(type);
      }
    } catch (error) {
      console.log("Type column might not exist yet:", error.message);
    }

    if (search) {
      whereClause += " AND (name LIKE ? OR dock_location LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM transportation ${whereClause}`,
      params
    );

    // Get transportation with pagination
    const [rows] = await pool.execute(
      `SELECT * FROM transportation ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(
        limit
      )} OFFSET ${offset}`,
      params
    );

    // Format each row
    const transportations = rows.map(formatTransportation);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        transportations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get transportation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data transportasi",
    });
  }
};

// Get transportation by ID
const getTransportationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      "SELECT * FROM transportation WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transportasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: formatTransportation(rows[0]),
    });
  } catch (error) {
    console.error("Get transportation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data transportasi",
    });
  }
};

// Create new transportation
const createTransportation = async (req, res) => {
  try {
    const {
      name,
      type,
      phone,
      whatsapp,
      departureTime,
      dockLocation,
      capacity,
      pricePerPerson,
      duration,
      status = 'active',
      notes
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO transportation (
        name,
        type,
        phone,
        whatsapp,
        departure_time,
        dock_location,
        capacity,
        price_per_person,
        duration,
        status,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type,
        phone,
        whatsapp || null,
        departureTime,
        dockLocation,
        capacity || null,
        pricePerPerson || null,
        duration,
        status,
        notes || null
      ]
    );

    const [newTransportation] = await pool.execute(
      "SELECT * FROM transportation WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Transportasi berhasil dibuat",
      data: formatTransportation(newTransportation[0]),
    });
  } catch (error) {
    console.error("Create transportation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat membuat transportasi",
    });
  }
};

// Update transportation
const updateTransportation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      phone,
      whatsapp,
      departureTime,
      dockLocation,
      capacity,
      pricePerPerson,
      duration,
      status,
      notes
    } = req.body;

    // Check if transportation exists
    const [existingRows] = await pool.execute(
      "SELECT * FROM transportation WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transportasi tidak ditemukan",
      });
    }

    await pool.execute(
      `UPDATE transportation
       SET name = ?, type = ?, phone = ?, whatsapp = ?, 
           departure_time = ?, dock_location = ?, capacity = ?, 
           price_per_person = ?, duration = ?, status = ?, notes = ?
       WHERE id = ?`,
      [
        name,
        type,
        phone,
        whatsapp || null,
        departureTime,
        dockLocation,
        capacity || null,
        pricePerPerson || null,
        duration,
        status,
        notes || null,
        id,
      ]
    );

    const [updatedRows] = await pool.execute(
      "SELECT * FROM transportation WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Transportasi berhasil diupdate",
      data: formatTransportation(updatedRows[0]),
    });
  } catch (error) {
    console.error("Update transportation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat update transportasi",
    });
  }
};

// Delete transportation
const deleteTransportation = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if transportation exists
    const [existingRows] = await pool.execute(
      "SELECT * FROM transportation WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transportasi tidak ditemukan",
      });
    }

    // Delete the transportation
    const [result] = await pool.execute(
      "DELETE FROM transportation WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Transportasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Transportasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete transportation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat menghapus transportasi",
    });
  }
};

// Toggle transportation status
const toggleTransportationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid. Gunakan 'active' atau 'inactive'",
      });
    }

    // Check if transportation exists
    const [existingRows] = await pool.execute(
      "SELECT * FROM transportation WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transportasi tidak ditemukan",
      });
    }

    await pool.execute(
      "UPDATE transportation SET status = ? WHERE id = ?",
      [status, id]
    );

    const [updatedRows] = await pool.execute(
      "SELECT * FROM transportation WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: `Status transportasi berhasil diubah menjadi ${status}`,
      data: formatTransportation(updatedRows[0]),
    });
  } catch (error) {
    console.error("Toggle transportation status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengubah status transportasi",
    });
  }
};

module.exports = {
  getAllTransportation,
  getTransportationById,
  createTransportation,
  updateTransportation,
  deleteTransportation,
  toggleTransportationStatus,
};