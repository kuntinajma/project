const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Generate JWT token
const generateToken = (adminId, role) => {
  return jwt.sign(
    { adminId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Admin login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username dan password diperlukan'
      });
    }

    // Get admin from database
    const [admins] = await pool.execute(
      'SELECT id, username, email, password, full_name, role, is_active FROM admins WHERE username = ? OR email = ?',
      [username, username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    const admin = admins[0];

    // Check if admin is active
    if (!admin.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Akun tidak aktif. Hubungi administrator.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }

    // Generate token
    const token = generateToken(admin.id, admin.role);

    // Remove password from response
    delete admin.password;

    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        admin,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat login'
    });
  }
};

// Get current admin profile
const getProfile = async (req, res) => {
  try {
    const [admins] = await pool.execute(
      'SELECT id, username, email, full_name, role, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    res.json({
      success: true,
      data: admins[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil profile'
    });
  }
};

module.exports = {
  login,
  getProfile
};