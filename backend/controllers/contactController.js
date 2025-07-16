const { pool } = require('../config/database');

// Get all contact messages
const getAllMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, is_read, search } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (is_read !== undefined) {
      whereClause += ' AND is_read = ?';
      params.push(is_read === 'true');
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM contact_messages ${whereClause}`,
      params
    );

    // Get messages with pagination
    const [messages] = await pool.execute(
      `SELECT * FROM contact_messages ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
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

    // Mark as read
    await pool.execute(
      'UPDATE contact_messages SET is_read = TRUE WHERE id = ?',
      [id]
    );

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
      [name, email, phone, subject, message]
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

module.exports = {
  getAllMessages,
  getMessageById,
  createMessage,
  replyMessage,
  deleteMessage
};