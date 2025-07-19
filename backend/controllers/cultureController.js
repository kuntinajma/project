const { pool } = require('../config/database');
const CULTURE_CATEGORIES = require("../constants/cultureCategories");


const cultureCategories = Object.values(CULTURE_CATEGORIES);

function formatCulture(row) {
	return {
		id: String(row.id),
		title: row.title,
		description: row.description,
		image: row.image ?? null,
		category: row.category,
		gallery: row.gallery ? JSON.parse(row.gallery) : []
	};
}

// Get all culture
const getAllCulture = async (req, res) => {
	try {
		const { page = 1, limit = 10, category, search } = req.query;
		const offset = (page - 1) * limit;

		let whereClause = 'WHERE 1=1';
		let params = [];

		if (category && cultureCategories.includes(category)) {
			whereClause += ' AND category = ?';
			params.push(category);
		}

		if (search) {
			whereClause += ' AND (title LIKE ? OR description LIKE ?)';
			params.push(`%${search}%`, `%${search}%`);
		}

		// Get total count
		const [countResult] = await pool.execute(
			`SELECT COUNT(*) as total FROM cultures ${whereClause}`,
			params
		);

		// Get culture with pagination
		const [rows] = await pool.execute(
			`SELECT * FROM cultures ${whereClause} ORDER BY created_at DESC LIMIT ${parseInt(limit)} OFFSET ${offset}`,
			params
		);

		const cultures = rows.map(formatCulture);
		const total = countResult[0].total;
		const totalPages = Math.ceil(total / limit);

		res.json({
			success: true,
			data: {
				cultures,
				pagination: {
					currentPage: parseInt(page),
					totalPages,
					totalItems: total,
					itemsPerPage: parseInt(limit)
				}
			}
		});
	} catch (error) {
		console.error('Get culture error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error saat mengambil data budaya'
		});
	}
};

// Get culture by ID
const getCultureById = async (req, res) => {
	try {
		const { id } = req.params;

		const [culture] = await pool.execute(
			'SELECT * FROM cultures WHERE id = ?',
			[id]
		);

		if (culture.length === 0) {
			return res.status(404).json({
				success: false,
				message: 'Budaya tidak ditemukan'
			});
		}

		res.json({
			success: true,
			data: formatCulture(culture[0])
		});
	} catch (error) {
		console.error('Get culture error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error saat mengambil data budaya'
		});
	}
};

// Create new culture
const createCulture = async (req, res) => {
	try {
		const {
			title,
			description,
			image = null,
			category,
			gallery = []
		} = req.body;

		const [result] = await pool.execute(
			`INSERT INTO cultures (title, description, image, category, gallery)
       VALUES (?, ?, ?, ?, ?)`,
			[title, description, image, category, JSON.stringify(gallery)]
		);

		const [rows] = await pool.execute(
			'SELECT * FROM cultures WHERE id = ?',
			[result.insertId]
		);

		res.status(201).json({
			success: true,
			message: 'Budaya berhasil dibuat',
			data: formatCulture(rows[0])
		});
	} catch (error) {
		console.error('Create culture error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error saat membuat budaya'
		});
	}
};

// Update culture
const updateCulture = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			title,
			description,
			image = null,
			category,
			gallery = []
		} = req.body;

		await pool.execute(
			`UPDATE cultures SET title = ?, description = ?, image = ?, category = ?, gallery = ?
       WHERE id = ?`,
			[title, description, image, category, JSON.stringify(gallery), id]
		);

		const [rows] = await pool.execute('SELECT * FROM cultures WHERE id = ?', [id]);

		if (rows.length === 0) {
			return res.status(404).json({ success: false, message: 'Budaya tidak ditemukan' });
		}

		res.json({
			success: true,
			message: 'Budaya berhasil diupdate',
			data: formatCulture(rows[0])
		});
	} catch (error) {
		console.error('Update culture error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error saat update budaya'
		});
	}
};

// Delete culture
const deleteCulture = async (req, res) => {
	try {
		const { id } = req.params;

		const [result] = await pool.execute('DELETE FROM cultures WHERE id = ?', [id]);

		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: 'Budaya tidak ditemukan'
			});
		}

		res.json({
			success: true,
			message: 'Budaya berhasil dihapus'
		});
	} catch (error) {
		console.error('Delete culture error:', error);
		res.status(500).json({
			success: false,
			message: 'Server error saat menghapus budaya'
		});
	}
};

module.exports = {
	getAllCulture,
	getCultureById,
	createCulture,
	updateCulture,
	deleteCulture
};
