const express = require('express');
const router = express.Router();
const fileController = require("../controllers/fileController");

// Upload a file
router.post('/upload', fileController.store);

// Delete a file by filename
router.delete('/upload/:filename', fileController.destroy);

// (Optional) Serve file directly
router.get('/upload/:filename', (req, res) => {
	const path = require('path');
	const { getUploadPath } = require('../utils/fileHelper');
	const fs = require('fs');

	const filePath = path.join(getUploadPath(), req.params.filename);
	if (!fs.existsSync(filePath)) {
		return res.status(404).json({ success: false, message: 'File not found' });
	}

	return res.sendFile(filePath);
});

// (Optional) Get full public URL of a file
router.post('/upload/get-url', (req, res) => {
	const { getPublicFileUrl } = require('../utils/fileHelper');
	const { filename } = req.body;

	if (!filename) {
		return res.status(400).json({ success: false, message: 'Filename is required' });
	}

	return res.json({ success: true, url: getPublicFileUrl(filename) });
});

module.exports = router;

