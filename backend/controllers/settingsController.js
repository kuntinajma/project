const { pool } = require("../config/database");

/**
 * Get all settings grouped by category
 */
const getAllSettings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT category, `key`, value FROM settings ORDER BY category, `key`"
    );

    // Group settings by category
    const settings = {};
    rows.forEach((row) => {
      if (!settings[row.category]) {
        settings[row.category] = {};
      }
      
      // Parse JSON values if the value is a JSON string
      try {
        if (row.value && (row.value.startsWith('[') || row.value.startsWith('{'))) {
          settings[row.category][row.key] = JSON.parse(row.value);
        } else {
          settings[row.category][row.key] = row.value;
        }
      } catch (e) {
        settings[row.category][row.key] = row.value;
      }
    });

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error getting settings:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil pengaturan",
    });
  }
};

/**
 * Get settings by category
 */
const getSettingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const [rows] = await pool.query(
      "SELECT `key`, value FROM settings WHERE category = ?",
      [category]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Pengaturan untuk kategori '${category}' tidak ditemukan`,
      });
    }

    // Convert to object
    const settings = {};
    rows.forEach((row) => {
      // Parse JSON values if the value is a JSON string
      try {
        if (row.value && (row.value.startsWith('[') || row.value.startsWith('{'))) {
          settings[row.key] = JSON.parse(row.value);
        } else {
          settings[row.key] = row.value;
        }
      } catch (e) {
        settings[row.key] = row.value;
      }
    });

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error(`Error getting ${req.params.category} settings:`, error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil pengaturan",
    });
  }
};

/**
 * Update settings by category
 */
const updateSettings = async (req, res) => {
  try {
    const { category } = req.params;
    const settings = req.body;

    if (!settings || Object.keys(settings).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada pengaturan yang diberikan untuk diperbarui",
      });
    }

    // Update each setting in the category
    for (const [key, value] of Object.entries(settings)) {
      // Convert objects/arrays to JSON strings for storage
      const storedValue = typeof value === 'object' ? JSON.stringify(value) : value;
      
      await pool.query(
        `INSERT INTO settings (category, \`key\`, value) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         value = ?, 
         updated_at = CURRENT_TIMESTAMP`,
        [category, key, storedValue, storedValue]
      );
    }

    // Get the updated settings
    const [rows] = await pool.query(
      "SELECT `key`, value FROM settings WHERE category = ?",
      [category]
    );

    // Convert to object
    const updatedSettings = {};
    rows.forEach((row) => {
      // Parse JSON values if the value is a JSON string
      try {
        if (row.value && (row.value.startsWith('[') || row.value.startsWith('{'))) {
          updatedSettings[row.key] = JSON.parse(row.value);
        } else {
          updatedSettings[row.key] = row.value;
        }
      } catch (e) {
        updatedSettings[row.key] = row.value;
      }
    });

    res.json({
      success: true,
      message: `Pengaturan ${category} berhasil diperbarui`,
      data: updatedSettings,
    });
  } catch (error) {
    console.error(`Error updating ${req.params.category} settings:`, error);
    res.status(500).json({
      success: false,
      message: "Server error saat memperbarui pengaturan",
    });
  }
};

/**
 * Get all facilities
 */
const getAllFacilities = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, icon, label, description, is_available FROM facilities ORDER BY id"
    );

    const facilities = rows.map(row => ({
      id: row.id,
      icon: row.icon,
      label: row.label,
      description: row.description,
      available: Boolean(row.is_available)
    }));

    res.json({
      success: true,
      data: facilities,
    });
  } catch (error) {
    console.error("Error getting facilities:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat mengambil fasilitas",
    });
  }
};

/**
 * Create a new facility
 */
const createFacility = async (req, res) => {
  try {
    const { icon, label, description, available } = req.body;

    const [result] = await pool.query(
      "INSERT INTO facilities (icon, label, description, is_available) VALUES (?, ?, ?, ?)",
      [icon, label, description || null, available ? 1 : 0]
    );

    const [newFacility] = await pool.query(
      "SELECT id, icon, label, description, is_available FROM facilities WHERE id = ?",
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: "Fasilitas berhasil dibuat",
      data: {
        id: newFacility[0].id,
        icon: newFacility[0].icon,
        label: newFacility[0].label,
        description: newFacility[0].description,
        available: Boolean(newFacility[0].is_available)
      },
    });
  } catch (error) {
    console.error("Error creating facility:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat membuat fasilitas",
    });
  }
};

/**
 * Update a facility
 */
const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if facility exists
    const [existingFacilities] = await pool.query(
      "SELECT id, icon, label, description, is_available FROM facilities WHERE id = ?",
      [id]
    );

    if (existingFacilities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fasilitas tidak ditemukan",
      });
    }

    const existingFacility = existingFacilities[0];
    
    // Use existing values for any fields not provided in the request
    const { icon = existingFacility.icon, 
            label = existingFacility.label, 
            description = existingFacility.description, 
            available = Boolean(existingFacility.is_available) } = req.body;

    await pool.query(
      `UPDATE facilities SET 
       icon = ?, 
       label = ?, 
       description = ?, 
       is_available = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [icon, label, description || null, available ? 1 : 0, id]
    );

    const [updatedFacility] = await pool.query(
      "SELECT id, icon, label, description, is_available FROM facilities WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Fasilitas berhasil diperbarui",
      data: {
        id: updatedFacility[0].id,
        icon: updatedFacility[0].icon,
        label: updatedFacility[0].label,
        description: updatedFacility[0].description,
        available: Boolean(updatedFacility[0].is_available)
      },
    });
  } catch (error) {
    console.error("Error updating facility:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat memperbarui fasilitas",
    });
  }
};

/**
 * Delete a facility
 */
const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if facility exists
    const [existingFacility] = await pool.query(
      "SELECT id FROM facilities WHERE id = ?",
      [id]
    );

    if (existingFacility.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Fasilitas tidak ditemukan",
      });
    }

    await pool.query("DELETE FROM facilities WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Fasilitas berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting facility:", error);
    res.status(500).json({
      success: false,
      message: "Server error saat menghapus fasilitas",
    });
  }
};

module.exports = {
  getAllSettings,
  getSettingsByCategory,
  updateSettings,
  getAllFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
}; 