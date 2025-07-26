const { pool } = require("../config/database");

const path = require("path");
const fs = require("fs");
const {
  getPublicFileUrl,
  deleteFile,
} = require("../utils/fileHelper"); // Sesuaikan path jika perlu

const DESTINATION_CATEGORIES = require("../constants/destinationCategories");

const destinationCategories = Object.values(DESTINATION_CATEGORIES);

function isUrl(string) {
  try {
    const url = new URL(string);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}
// format raw db data to desired JSON output
function formatDestination(row) {
  return {
    id: String(row.id),
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    category: row.category,
    // Jika image ada: cek apakah sudah URL, jika tidak → buat jadi public URL
    image: row.image
      ? isUrl(row.image)
        ? row.image
        : getPublicFileUrl(row.image)
      : null,
    location:
      row.latitude != null && row.longitude != null
        ? { lat: Number(row.latitude), lng: Number(row.longitude) }
        : null,

    // Gallery: proses setiap item
    gallery: row.gallery
      ? JSON.parse(row.gallery).map((filename) =>
          isUrl(filename) ? filename : getPublicFileUrl(filename)
        )
      : null,
  };
}

// Get all destinations
const getAllDestinations = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    let params = [];

    if (category && destinationCategories.includes(category)) {
      whereClause += " AND category = ?";
      params.push(category);
    }

    if (search) {
      whereClause += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM destinations ${whereClause}`,
      params
    );

    // Get destinations with pagination
    //
    const [rows] = await pool.execute(
      `SELECT * FROM destinations ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(
        limit
      )} OFFSET ${offset}`,
      params
    );

    // Format each row
    const destinations = rows.map(formatDestination);

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
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get destinations error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data destinasi",
    });
  }
};

// Get destination by ID
const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [destinations] = await pool.execute(
      "SELECT * FROM destinations WHERE id = ?",
      [id]
    );

    if (destinations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Destinasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: formatDestination(destinations[0]),
    });
  } catch (error) {
    console.error("Get destination error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil data destinasi",
    });
  }
};

// Create new destination
const createDestination = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description = null,
      category,
      image = null,
      location = null,
      gallery = null,
    } = req.body;

    const latitude = location?.lat ?? null;
    const longitude = location?.lng ?? null;

    const [result] = await pool.execute(
      `INSERT INTO destinations (
        title,
        short_description,
        description,
        category,
        image,
        latitude,
        longitude,
        gallery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        shortDescription,
        description,
        category,
        image,
        latitude,
        longitude,
        gallery ? JSON.stringify(gallery) : null,
      ]
    );

    const [newDestination] = await pool.execute(
      "SELECT * FROM destinations WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Destinasi berhasil dibuat",
      data: formatDestination(newDestination[0]),
    });
  } catch (error) {
    console.error("Create destination error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat membuat destinasi",
    });
  }
};

// Update destination
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      shortDescription,
      description = null,
      category,
      image = null,
      location = null,
      gallery = null,
    } = req.body;

    const latitude = location?.lat ?? null;
    const longitude = location?.lng ?? null;

    // 🔍 Ambil data lama sebelum update
    const [oldRows] = await pool.execute(
      "SELECT image, gallery FROM destinations WHERE id = ?",
      [id]
    );

    if (oldRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Destinasi tidak ditemukan",
      });
    }

    const oldData = oldRows[0];

    // 🗑️ Hapus file lama jika ada dan diganti
    const filesToDelete = [];

    // Tambahkan image lama jika berbeda atau di-null
    if (oldData.image && oldData.image !== image) {
      filesToDelete.push(oldData.image);
    }

    let oldGallery = [];
    if (oldData.gallery) {
      try {
        oldGallery = JSON.parse(oldData.gallery);
      } catch (e) {
        console.warn(`Gagal parse gallery lama untuk destinasi ${id}`);
      }
    }

    // Tambahkan file galeri lama yang tidak ada di gallery baru
    if (Array.isArray(gallery)) {
      oldGallery.forEach((file) => {
        if (!gallery.includes(file)) {
          filesToDelete.push(file);
        }
      });
    } else {
      // Jika gallery baru null/unset, hapus semua galeri lama
      filesToDelete.push(...oldGallery);
    }

    await pool.execute(
      `UPDATE destinations
       SET title = ?, short_description = ?, description = ?, category = ?, image = ?, latitude = ?, longitude = ?, gallery = ?
       WHERE id = ?`,
      [
        title,
        shortDescription,
        description,
        category,
        image,
        latitude,
        longitude,
        gallery ? JSON.stringify(gallery) : null,
        id,
      ]
    );

    // ❗ Hapus file setelah query sukses
    filesToDelete.forEach((filename) => {
      deleteFile(filename); // Gunakan helper kamu
    });

    const [rows] = await pool.execute(
      "SELECT * FROM destinations WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Destinasi tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Destinasi berhasil diupdate",
      data: formatDestination(rows[0]),
    });
  } catch (error) {
    console.error("Update destination error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat update destinasi",
    });
  }
};

// Delete destination
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Ambil data lama sebelum update
    const [oldRows] = await pool.execute(
      "SELECT image, gallery FROM destinations WHERE id = ?",
      [id]
    );

    if (oldRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Destinasi tidak ditemukan",
      });
    }

    const oldData = oldRows[0];

    // 🗑️ Hapus file lama jika ada dan diganti
    const filesToDelete = [];

    // Tambahkan image lama jika berbeda atau di-null
    if (oldData.image) {
      filesToDelete.push(oldData.image);
    }

    let oldGallery = [];
    if (oldData.gallery) {
      try {
        oldGallery = JSON.parse(oldData.gallery);
      } catch (e) {
        console.warn(`Gagal parse gallery lama untuk destinasi ${id}`);
      }
    }

    // Add all gallery files to delete list
    oldGallery.forEach((file) => {
      filesToDelete.push(file);
    });

    // do deleting
    const [result] = await pool.execute(
      "DELETE FROM destinations WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Destinasi tidak ditemukan",
      });
    }

    // ❗ Hapus file setelah query sukses
    filesToDelete.forEach((filename) => {
      deleteFile(filename); // Gunakan helper kamu
    });

    res.json({
      success: true,
      message: "Destinasi berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete destination error:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat menghapus destinasi",
    });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
