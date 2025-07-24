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
    console.log('Authenticating token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Decoded token:', decoded);
    
    // Get user from database
    const [users] = await pool.execute(
      'SELECT id, email, password, name, role, is_active FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.userId]
    );

    if (users.length === 0) {
      console.log('User not found or not active');
      return res.status(401).json({ 
        success: false, 
        message: 'Token tidak valid atau user tidak aktif' 
      });
    }

    console.log('User authenticated:', { id: users[0].id, email: users[0].email, role: users[0].role });
    req.user = users[0];
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Token tidak valid atau sudah expired' 
    });
  }
};

// Authorize based on user role
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('Authorization failed: No user in request');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - authentication required'
      });
    }

    // Flatten the roles array in case it was called with an array argument
    const roles = allowedRoles.flat();
    
    console.log(`Authorizing user role: ${req.user.role}, allowed roles:`, roles);
    if (!roles.includes(req.user.role)) {
      console.log(`Authorization failed: User role ${req.user.role} not in allowed roles:`, roles);
      return res.status(403).json({
        success: false,
        message: 'Forbidden - insufficient permissions'
      });
    }

    console.log('Authorization successful');
    next();
  };
};

module.exports = { authenticateToken, authorize };