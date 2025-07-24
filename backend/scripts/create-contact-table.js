const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function createContactMessagesTable() {
  try {
    console.log('Creating contact_messages table...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-contact-messages-table.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ contact_messages table created successfully');
  } catch (error) {
    console.error('Error creating contact_messages table:', error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the function
createContactMessagesTable(); 