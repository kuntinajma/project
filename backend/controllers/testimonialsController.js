const { pool } = require('../config/database');

// Get all testimonials with pagination
const getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    // Convert pagination parameters to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offsetNum = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR origin LIKE ? OR message LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM testimonials ${whereClause}`,
      params
    );

    // Construct the query with direct values instead of parameters for LIMIT and OFFSET
    const query = `SELECT * FROM testimonials ${whereClause} 
                   ORDER BY created_at DESC 
                   LIMIT ${limitNum} OFFSET ${offsetNum}`;

    // Execute the query with only WHERE clause parameters
    const [testimonials] = await pool.execute(query, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        testimonials,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data testimonial'
    });
  }
};

// Get testimonial by ID
const getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const [testimonials] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    if (testimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: testimonials[0]
    });
  } catch (error) {
    console.error('Get testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data testimonial'
    });
  }
};

// Create new testimonial
const createTestimonial = async (req, res) => {
  try {
    const { name, star, origin, message } = req.body;

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
      message: 'Testimonial berhasil dibuat',
      data: newTestimonial[0]
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat testimonial'
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, star, origin, message } = req.body;

    // Check if testimonial exists
    const [existingTestimonials] = await pool.execute(
      'SELECT id FROM testimonials WHERE id = ?',
      [id]
    );

    if (existingTestimonials.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial tidak ditemukan'
      });
    }

    // Update testimonial
    await pool.execute(
      'UPDATE testimonials SET name = ?, star = ?, origin = ?, message = ? WHERE id = ?',
      [name, star, origin || null, message, id]
    );

    const [updatedTestimonial] = await pool.execute(
      'SELECT * FROM testimonials WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Testimonial berhasil diupdate',
      data: updatedTestimonial[0]
    });
  } catch (error) {
    console.error('Update testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengupdate testimonial'
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
        message: 'Testimonial tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Testimonial berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus testimonial'
    });
  }
};

// Get featured testimonials (for homepage)
const getFeaturedTestimonials = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const limitNum = parseInt(limit, 10);

    const [testimonials] = await pool.execute(
      `SELECT * FROM testimonials ORDER BY star DESC, created_at DESC LIMIT ${limitNum}`
    );

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Get featured testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data testimonial unggulan'
    });
  }
};

module.exports = {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials
};
