const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Get all users (superadmin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );

    // Get users with pagination
    const [users] = await pool.execute(
      `SELECT id, name, email, role, phone, avatar, university, major, 
              is_active, is_verified, created_at, last_login
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data users'
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.execute(
      `SELECT id, name, email, role, phone, avatar, university, major, bio,
              is_active, is_verified, created_at, last_login
       FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data user'
    });
  }
};

// Create new user (superadmin/admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, university, major, bio } = req.body;

    // Check if email already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password, role, phone, university, major, bio, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, role, phone, university, major, bio, true]
    );

    // Get created user
    const [users] = await pool.execute(
      `SELECT id, name, email, role, phone, university, major, bio,
              is_active, is_verified, created_at
       FROM users WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'User berhasil dibuat',
      data: users[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat user'
    });
  }
};

// Update user (superadmin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, university, major, bio, is_active, is_verified } = req.body;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Check if email is already used by another user
    if (email) {
      const [emailCheck] = await pool.execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, id]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email sudah digunakan user lain'
        });
      }
    }

    // Update user
    await pool.execute(
      `UPDATE users 
       SET name = ?, email = ?, role = ?, phone = ?, university = ?, 
           major = ?, bio = ?, is_active = ?, is_verified = ?
       WHERE id = ?`,
      [name, email, role, phone, university, major, bio, is_active, is_verified, id]
    );

    // Get updated user
    const [users] = await pool.execute(
      `SELECT id, name, email, role, phone, university, major, bio,
              is_active, is_verified, created_at, last_login
       FROM users WHERE id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'User berhasil diupdate',
      data: users[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update user'
    });
  }
};

// Delete user (superadmin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT id, role FROM users WHERE id = ?',
      [id]
    );

    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Prevent deleting superadmin
    if (existingUsers[0].role === 'superadmin') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menghapus superadmin'
      });
    }

    // Delete user
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'User berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus user'
    });
  }
};

// Toggle user status (superadmin only)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const [users] = await pool.execute(
      'SELECT id, is_active, role FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    // Prevent deactivating superadmin
    if (users[0].role === 'superadmin') {
      return res.status(400).json({
        success: false,
        message: 'Tidak dapat menonaktifkan superadmin'
      });
    }

    const newStatus = !users[0].is_active;

    // Update status
    await pool.execute(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [newStatus, id]
    );

    res.json({
      success: true,
      message: `User berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
      data: { is_active: newStatus }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengubah status user'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus
};