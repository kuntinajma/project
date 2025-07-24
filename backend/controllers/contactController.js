const { pool } = require('../config/database');

// Get all contact messages
const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    // Convert pagination parameters to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offsetNum = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (status === 'read') {
      whereClause += ' AND is_read = TRUE AND admin_reply IS NULL';
    } else if (status === 'unread') {
      whereClause += ' AND is_read = FALSE';
    } else if (status === 'replied') {
      whereClause += ' AND admin_reply IS NOT NULL';
    } else if (status === 'unreplied') {
      whereClause += ' AND admin_reply IS NULL';
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
      params
    );

    // Construct the query with direct values instead of parameters for LIMIT and OFFSET
    const query = `SELECT * FROM contact_messages ${whereClause} 
                   ORDER BY created_at DESC 
                   LIMIT ${limitNum} OFFSET ${offsetNum}`;

    // Execute the query with only WHERE clause parameters
    const [messages] = await pool.execute(query, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data pesan'
    });
  }
};

// Get message by ID
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    const [messages] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan'
      });
    }

    // Mark as read if not already read
    if (!messages[0].is_read) {
      await pool.execute(
        'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
        [id]
      );
    }

    res.json({
      success: true,
      data: messages[0]
    });
  } catch (error) {
    console.error('Get message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data pesan'
    });
  }
};

// Create new contact message (from frontend)
const createMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || null, message]
    );

    const [newMessage] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Pesan berhasil dikirim',
      data: newMessage[0]
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengirim pesan'
    });
  }
};

// Reply to message
const replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_reply } = req.body;

    // Check if message exists
    const [messages] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan'
      });
    }

    // Update with reply
    await pool.execute(
      'UPDATE contact_messages SET admin_reply = ?, replied_at = CURRENT_TIMESTAMP, is_read = TRUE WHERE id = ?',
      [admin_reply, id]
    );

    const [updatedMessage] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Balasan berhasil dikirim',
      data: updatedMessage[0]
    });
  } catch (error) {
    console.error('Reply message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membalas pesan'
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM contact_messages WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan'
      });
    }

    res.json({
      success: true,
      message: 'Pesan berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus pesan'
    });
  }
};

// Get unread messages count
const getUnreadCount = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM contact_messages WHERE is_read = FALSE'
    );

    res.json({
      success: true,
      data: {
        count: result[0].count
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil jumlah pesan belum dibaca'
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const [messages] = await pool.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [id]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pesan tidak ditemukan'
      });
    }

    // Mark as read
    await pool.execute(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Pesan ditandai sebagai sudah dibaca'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menandai pesan sebagai sudah dibaca'
    });
  }
};

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  replyMessage,
  deleteMessage,
  getUnreadCount,
  markAsRead
};