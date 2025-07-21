const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { getUploadPath, getPublicFileUrl } = require('../utils/fileHelper');
require('dotenv').config();

// Generate random file name
const generateRandomFileName = (originalName) => {
	const ext = path.extname(originalName);
	const randomName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
	return randomName;
};

// Multer config
const upload = multer({
	storage: multer.diskStorage({
		destination: (req, file, cb) => {
			const uploadPath = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads');
			if (!fs.existsSync(uploadPath)) {
				fs.mkdirSync(uploadPath, { recursive: true });
			}
			cb(null, uploadPath);
		},
		filename: (req, file, cb) => {
			cb(null, generateRandomFileName(file.originalname));
		}
	}),
	limits: {
		fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
	}
}).array('files', 5); // adjust field name if needed

// Store file
//
const store = async (req, res) => {
	upload(req, res, function(err) {
		if (err) {
			console.error('Upload error:', err);
			return res.status(400).json({ success: false, message: 'Upload failed', error: err.message });
		}

		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ success: false, message: 'No files uploaded' });
		}

		const files = req.files.map(file => ({
			url: getPublicFileUrl(file.filename),
			filename: file.filename,
			originalName: file.originalname,
			size: file.size,
			path: file.path
		}));

		return res.status(200).json({
			success: true,
			message: 'Files uploaded successfully',
			files: files
		});
	});
};

// Delete file
const destroy = async (req, res) => {
	try {
		const { filename } = req.params;
		if (!filename) {
			return res.status(400).json({ success: false, message: 'Filename is required' });
		}

		const filePath = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads', filename);

		if (!fs.existsSync(filePath)) {
			return res.status(404).json({ success: false, message: 'File not found' });
		}

		fs.unlinkSync(filePath);

		return res.status(200).json({
			success: true,
			message: 'File deleted successfully',
			filename
		});
	} catch (error) {
		console.error('Error while deleting file:', error);
		return res.status(500).json({ success: false, message: 'Error while deleting file' });
	}
};

module.exports = {
	store,
	destroy
};

