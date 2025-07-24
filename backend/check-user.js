const { pool } = require('./config/database');

async function checkUser() {
  try {
    console.log('Checking superadmin user...');
    const [rows] = await pool.query('SELECT id, email, name, role, is_active FROM users WHERE role = "superadmin"');
    console.log(rows);
    
    // Check if is_active is false and update if needed
    if (rows.length > 0 && rows[0].is_active === 0) {
      console.log('Updating superadmin user to be active...');
      await pool.query('UPDATE users SET is_active = TRUE WHERE id = ?', [rows[0].id]);
      console.log('User updated successfully');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

checkUser(); 