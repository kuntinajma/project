const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token akses diperlukan' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get admin from database
    const [admins] = await pool.execute(
      'SELECT id, username, email, full_name, role, is_active FROM admins WHERE id = ? AND is_active = TRUE',
      [decoded.adminId]
    );

    if (admins.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token tidak valid atau admin tidak aktif' 
      });
    }

    req.admin = admins[0];
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token tidak valid atau sudah expired' 
    });
  }
};

module.exports = { authenticateToken };