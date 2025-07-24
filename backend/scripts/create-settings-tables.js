const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function createSettingsTables() {
  try {
    console.log('🔄 Creating settings and facilities tables...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-settings-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content by semicolons to get individual statements
    const sqlStatements = sqlContent
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    // Execute each SQL statement
    for (const statement of sqlStatements) {
      await pool.query(statement);
    }
    
    console.log('✅ Settings and facilities tables created successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up settings and facilities:', error);
    return false;
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  createSettingsTables()
    .then((success) => {
      console.log('Script completed' + (success ? ' successfully' : ' with errors'));
      process.exit(success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Script failed:', err);
      process.exit(1);
    });
}

module.exports = { createSettingsTables }; 