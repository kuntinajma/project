const { pool } = require('../config/database');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for each entity
    const [destinationsCount] = await pool.execute('SELECT COUNT(*) as count FROM destinations WHERE is_active = TRUE');
    const [packagesCount] = await pool.execute('SELECT COUNT(*) as count FROM tour_packages WHERE is_active = TRUE');
    const [umkmCount] = await pool.execute('SELECT COUNT(*) as count FROM umkm WHERE is_active = TRUE');
    const [cultureCount] = await pool.execute('SELECT COUNT(*) as count FROM culture WHERE is_active = TRUE');
    const [bookingsCount] = await pool.execute('SELECT COUNT(*) as count FROM bookings');
    const [messagesCount] = await pool.execute('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = FALSE');

    // Get recent bookings
    const [recentBookings] = await pool.execute(
      `SELECT b.id, b.customer_name, b.participants, b.booking_date, b.status, tp.name as package_name
       FROM bookings b 
       LEFT JOIN tour_packages tp ON b.package_id = tp.id 
       ORDER BY b.created_at DESC 
       LIMIT 5`
    );

    // Get recent messages
    const [recentMessages] = await pool.execute(
      'SELECT id, name, email, subject, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'
    );

    // Get booking statistics by status
    const [bookingStats] = await pool.execute(
      'SELECT status, COUNT(*) as count FROM bookings GROUP BY status'
    );

    // Get monthly booking trends (last 6 months)
    const [monthlyBookings] = await pool.execute(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') as month,
         COUNT(*) as count,
         SUM(total_price) as revenue
       FROM bookings 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month DESC`
    );

    const stats = {
      totals: {
        destinations: destinationsCount[0].count,
        packages: packagesCount[0].count,
        umkm: umkmCount[0].count,
        culture: cultureCount[0].count,
        bookings: bookingsCount[0].count,
        unreadMessages: messagesCount[0].count
      },
      recentBookings,
      recentMessages,
      bookingStats,
      monthlyBookings
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil statistik dashboard'
    });
  }
};

module.exports = {
  getDashboardStats
};