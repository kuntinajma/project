const { pool } = require("../config/database");

function formatTourPackage(row) {
  return {
    id: String(row.id),
    name: row.name,
    description: row.description,
    price: row.price,
    duration: row.duration,
    minPersons: row.min_persons,
    maxPersons: row.max_persons ?? null,
    whatsappContact: row.whatsapp_contact,
    whatsappBookingUrl: row.whatsapp_booking_url ?? null,
    image: row.image ?? row.featured_image ?? row.image_url ?? null, // Handle multiple possible field names
    facilities: row.facilities ? JSON.parse(row.facilities) : [],
    popular: !!row.popular,
  };
}

// Get all tour packages
const getAllPackages = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    let params = [];

    if (search) {
      whereClause += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM tour_packages ${whereClause}`,
      params
    );

    // Get packages with pagination
    const [rows] = await pool.execute(
      `SELECT * FROM tour_packages ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(
        limit
      )} OFFSET ${offset}`,
      params
    );

    const packages = rows.map(formatTourPackage);

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
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get packages error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data paket wisata",
    });
  }
};

// Get package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [packages] = await pool.execute(
      "SELECT * FROM tour_packages WHERE id = ?",
      [id]
    );

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Paket wisata tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: formatTourPackage(packages[0]),
    });
  } catch (error) {
    console.error("Get package error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data paket wisata",
    });
  }
};

// Create new package
const createPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      minPersons,
      maxPersons,
      whatsappContact,
      whatsappBookingUrl = null, // ADD THIS FIELD
      facilities,
      image = null,
      popular = false,
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO tour_packages 
        (name, description, price, duration, min_persons, max_persons, whatsapp_contact, whatsapp_booking_url, facilities, image, popular)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        duration,
        minPersons,
        maxPersons ?? null,
        whatsappContact,
        whatsappBookingUrl,
        JSON.stringify(facilities),
        image,
        popular,
      ]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM tour_packages WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Paket wisata berhasil dibuat",
      data: formatTourPackage(rows[0]),
    });
  } catch (error) {
    console.error("Create package error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat membuat paket wisata",
    });
  }
};

// Update package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      duration,
      minPersons,
      maxPersons,
      whatsappContact,
      whatsappBookingUrl = null, // ADD THIS FIELD
      facilities,
      image = null,
      popular = false,
    } = req.body;

    await pool.execute(
      `UPDATE tour_packages 
       SET name = ?, description = ?, price = ?, duration = ?, min_persons = ?, max_persons = ?, whatsapp_contact = ?, whatsapp_booking_url = ?, facilities = ?, image = ?, popular = ?
       WHERE id = ?`,
      [
        name,
        description,
        price,
        duration,
        minPersons,
        maxPersons ?? null,
        whatsappContact,
        whatsappBookingUrl,
        JSON.stringify(facilities),
        image,
        popular,
        id,
      ]
    );

    const [rows] = await pool.execute(
      "SELECT * FROM tour_packages WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Paket wisata tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Paket wisata berhasil diupdate",
      data: formatTourPackage(rows[0]),
    });
  } catch (error) {
    console.error("Update package error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat update paket wisata",
    });
  }
};

// Delete package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      "DELETE FROM tour_packages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Paket wisata tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Paket wisata berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete package error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat menghapus paket wisata",
    });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};