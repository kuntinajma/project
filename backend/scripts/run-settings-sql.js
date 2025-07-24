const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

// Get database configuration from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'laiya_tourism';

// Path to the SQL file
const sqlFilePath = path.join(__dirname, 'create-settings-tables.sql');

// Build the mysql command
const command = `mysql -h${DB_HOST} -u${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} ${DB_NAME} < "${sqlFilePath}"`;

console.log('🔄 Executing SQL script...');

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error executing SQL script:', error);
    return;
  }
  
  if (stderr) {
    console.error('❌ SQL script execution error:', stderr);
    return;
  }
  
  console.log('✅ SQL script executed successfully');
  
  if (stdout) {
    console.log('Output:', stdout);
  }
}); 