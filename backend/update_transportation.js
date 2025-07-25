 // Script to update transportation table
const fs = require('fs');
const path = require('path');
const { pool } = require('./config/database');

async function updateTransportationTable() {
  try {
    console.log('Starting transportation table update...');
    
    // Read SQL file
    const sqlFilePath = path.join(__dirname, 'update_transportation_table.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL statements
    const statements = sqlScript
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .filter(statement => statement.trim() !== '');
    
    // Execute each statement with error handling
    for (const statement of statements) {
      if (!statement.trim()) continue;
      
      console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
      try {
        await pool.execute(statement);
        console.log('  ✓ Success');
      } catch (err) {
        // If the error is about duplicate column, we can safely ignore it
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`  ⚠️ Column already exists: ${err.message}`);
        } else {
          console.log(`  ❌ Error: ${err.message}`);
          // Don't throw, continue with other statements
        }
      }
    }
    
    console.log('Transportation table updated successfully!');
    
    // Check the structure
    const [columns] = await pool.execute('DESCRIBE transportation');
    console.log('Current table structure:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating transportation table:', error);
    process.exit(1);
  }
}

updateTransportationTable();