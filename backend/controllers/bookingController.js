const { pool } = require('../config/database');

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Convert pagination parameters to numbers
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offsetNum = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (status && status !== 'all') {
      whereClause += ' AND b.status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (b.customer_name LIKE ? OR b.customer_email LIKE ? OR b.customer_phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM bookings b ${whereClause}`,
      params
    );

    // Get bookings with package info
    const [bookings] = await pool.execute(
      `SELECT b.*, tp.name as package_name, tp.price as package_price 
       FROM bookings b 
       LEFT JOIN tour_packages tp ON b.package_id = tp.id 
       ${whereClause} 
       ORDER BY b.created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offsetNum]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data booking'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const [bookings] = await pool.execute(
      `SELECT b.*, tp.name as package_name, tp.price as package_price 
       FROM bookings b 
       LEFT JOIN tour_packages tp ON b.package_id = tp.id 
       WHERE b.id = ?`,
      [id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: bookings[0]
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data booking'
    });
  }
};

// Create new booking (from frontend)
const createBooking = async (req, res) => {
  try {
    const {
      package_id,
      customer_name,
      customer_email,
      customer_phone,
      participants,
      booking_date,
      special_requests
    } = req.body;

    // Get package price
    const [packages] = await pool.execute(
      'SELECT price FROM tour_packages WHERE id = ? AND is_active = TRUE',
      [package_id]
    );

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Paket wisata tidak ditemukan atau tidak aktif'
      });
    }

    const total_price = packages[0].price * participants;

    const [result] = await pool.execute(
      `INSERT INTO bookings (package_id, customer_name, customer_email, customer_phone, participants, booking_date, total_price, special_requests)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [package_id, customer_name, customer_email, customer_phone, participants, booking_date, total_price, special_requests]
    );

    const [newBooking] = await pool.execute(
      `SELECT b.*, tp.name as package_name 
       FROM bookings b 
       LEFT JOIN tour_packages tp ON b.package_id = tp.id 
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Booking berhasil dibuat',
      data: newBooking[0]
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat booking'
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status, notes } = req.body;

    await pool.execute(
      'UPDATE bookings SET status = ?, payment_status = ?, notes = ? WHERE id = ?',
      [status, payment_status, notes, id]
    );

    const [updatedBooking] = await pool.execute(
      `SELECT b.*, tp.name as package_name 
       FROM bookings b 
       LEFT JOIN tour_packages tp ON b.package_id = tp.id 
       WHERE b.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Status booking berhasil diupdate',
      data: updatedBooking[0]
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update booking'
    });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM bookings WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Booking berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus booking'
    });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking
};