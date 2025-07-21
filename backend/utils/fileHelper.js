const path = require("path");
const fs = require("fs");

const getUploadPath = () =>
  path.join(process.cwd(), process.env.UPLOAD_PATH || "uploads");
const getPublicBaseUrl = () => process.env.APP_URL || "http://localhost:5000";

/**
 * Get full public URL of a file.
 * @param {string} filename
 * @returns {string}
 */
const getPublicFileUrl = (filename) => {
  const baseUrl = getPublicBaseUrl().replace(/\/$/, ""); // Remove trailing slash
  const uploadFolder = (process.env.UPLOAD_PATH || "uploads").replace(
    /^\.?\/*/,
    ""
  ); // Remove leading ./
  return `${baseUrl}/${uploadFolder}/${filename}`;
};

/**
 * Delete a file by filename.
 * @param {string} filename
 * @returns {boolean}
 */
const deleteFile = (filename) => {
  const filePath = path.join(getUploadPath(), filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }
  return false;
};

module.exports = {
  getUploadPath,
  getPublicFileUrl,
  deleteFile,
};
