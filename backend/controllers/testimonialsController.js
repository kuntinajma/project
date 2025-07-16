const { pool } = require('../config/database');

// Get all testimonials
const getAllTestimonials = async (req, res) => {
  try {
    const [testimonials] = await pool.execute(
      'SELECT * FROM testimonials ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data testimoni'
    });
  }
};

// Create new testimonial
const createTestimonial = async (req, res) => {
  try {
    const { name, star, origin, message } = req.body;

    if (!name || !star || !message) {
      return res.status(400).json({
        success: false,
        message: 'Nama, bintang, dan pesan wajib diisi'
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO testimonials (name, star, origin, message) VALUES (?, ?, ?, ?)',
      [name, star, origin || null, message]
    );

    const [newTestimonial] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Testimoni berhasil dikirim',
      data: newTestimonial[0]
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengirim testimoni'
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, star, origin, message } = req.body;

    const [result] = await pool.execute(
      'UPDATE testimonials SET name = ?, star = ?, origin = ?, message = ? WHERE id = ?',
      [name, star, origin || null, message, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan'
      });
    }

    const [updatedTestimonial] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Testimoni berhasil diperbarui',
      data: updatedTestimonial[0]
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat memperbarui testimoni'
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM testimonials WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimoni tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Testimoni berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus testimoni'
    });
  }
};

module.exports = {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
