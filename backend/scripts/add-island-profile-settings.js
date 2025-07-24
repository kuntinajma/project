const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function addIslandProfileSettings() {
  try {
    console.log('Adding island profile settings...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'add-island-profile-settings.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Island profile settings added successfully!');
  } catch (error) {
    console.error('❌ Error adding island profile settings:', error);
  } finally {
    process.exit();
  }
}

// Run if called directly
if (require.main === module) {
  addIslandProfileSettings();
}

module.exports = addIslandProfileSettings; 