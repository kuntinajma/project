const { pool } = require('../config/database');

// format raw db data to desired JSON output
async function formatProduct(row) {
  // Get MSME info for sellerInfo
  const [msmeRows] = await pool.execute(
    'SELECT brand, whatsapp, shopee, instagram FROM msmes WHERE id = ?',
    [row.msme_id]
  );

  const sellerInfo = msmeRows.length > 0 ? {
    brand: msmeRows[0].brand,
    whatsapp: msmeRows[0].whatsapp,
    shopee: msmeRows[0].shopee,
    instagram: msmeRows[0].instagram
  } : null;

  return {
    id: String(row.id),
    name: row.name,
    price: Number(row.price),
    image: row.image ?? null,
    description: row.description,
    material: row.material,
    durability: row.durability,
    deliveryTime: row.delivery_time,
    msme_id: String(row.msme_id),
    sellerInfo,
    relatedProducts: row.related_products ? JSON.parse(row.related_products) : []
  };
}

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, msme_id, min_price, max_price } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE 1=1';
    let params = [];

    if (msme_id) {
      whereClause += ' AND msme_id = ?';
      params.push(msme_id);
    }

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ? OR material LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (min_price) {
      whereClause += ' AND price >= ?';
      params.push(min_price);
    }

    if (max_price) {
      whereClause += ' AND price <= ?';
      params.push(max_price);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM products ${whereClause}`,
      params
    );

    // Get products with pagination
    const [rows] = await pool.execute(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    // Format each row
    const products = await Promise.all(rows.map(formatProduct));

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data produk'
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    const product = await formatProduct(products[0]);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat mengambil data produk'
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      image = null,
      description,
      material,
      durability,
      deliveryTime,
      msme_id,
      relatedProducts = []
    } = req.body;

    // Get authenticated user_id
    const user_id = req.user.id;

    // Verify that the MSME belongs to the authenticated user
    const [msmeCheck] = await pool.execute(
      'SELECT id FROM msmes WHERE id = ? AND user_id = ?',
      [msme_id, user_id]
    );

    if (msmeCheck.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke MSME ini'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO products (
        name,
        price,
        image,
        description,
        material,
        durability,
        delivery_time,
        msme_id,
        related_products
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        price,
        image,
        description,
        material,
        durability,
        deliveryTime,
        msme_id,
        relatedProducts.length > 0 ? JSON.stringify(relatedProducts) : null
      ]
    );

    const [newProduct] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    const product = await formatProduct(newProduct[0]);

    res.status(201).json({
      success: true,
      message: 'Produk berhasil dibuat',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat membuat produk'
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const {
      name,
      price,
      image = null,
      description,
      material,
      durability,
      deliveryTime,
      msme_id,
      relatedProducts = []
    } = req.body;

    // Verify that the product belongs to a MSME owned by the authenticated user
    const [productCheck] = await pool.execute(
      `SELECT p.id FROM products p 
       JOIN msmes m ON p.msme_id = m.id 
       WHERE p.id = ? AND m.user_id = ?`,
      [id, user_id]
    );

    if (productCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    // Verify that the new MSME belongs to the authenticated user
    const [msmeCheck] = await pool.execute(
      'SELECT id FROM msmes WHERE id = ? AND user_id = ?',
      [msme_id, user_id]
    );

    if (msmeCheck.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke MSME ini'
      });
    }

    await pool.execute(
      `UPDATE products
       SET name = ?, price = ?, image = ?, description = ?, material = ?, durability = ?, delivery_time = ?, msme_id = ?, related_products = ?
       WHERE id = ?`,
      [
        name,
        price,
        image,
        description,
        material,
        durability,
        deliveryTime,
        msme_id,
        relatedProducts.length > 0 ? JSON.stringify(relatedProducts) : null,
        id
      ]
    );

    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    const product = await formatProduct(rows[0]);

    res.json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat update produk'
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Verify that the product belongs to a MSME owned by the authenticated user
    const [result] = await pool.execute(
      `DELETE p FROM products p 
       JOIN msmes m ON p.msme_id = m.id 
       WHERE p.id = ? AND m.user_id = ?`,
      [id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan atau Anda tidak memiliki akses'
      });
    }

    res.json({
      success: true,
      message: 'Produk berhasil dihapus'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saat menghapus produk'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};