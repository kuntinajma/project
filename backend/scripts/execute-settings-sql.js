const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'laiya_tourism',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function executeSqlFile() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to database');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create-settings-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content by semicolons to get individual statements
    // and filter out empty statements
    const sqlStatements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement !== '');
    
    console.log(`🔄 Executing ${sqlStatements.length} SQL statements...`);
    
    // Execute each SQL statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      console.log(`🔄 Executing statement ${i + 1}/${sqlStatements.length}...`);
      
      try {
        await connection.query(statement);
      } catch (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        console.error('Statement:', statement);
        // Continue with the next statement
      }
    }
    
    console.log('✅ SQL script executed successfully');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (connection) {
      console.log('🔄 Closing database connection...');
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  executeSqlFile()
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Script failed:', err);
      process.exit(1);
    });
}

module.exports = { executeSqlFile }; 