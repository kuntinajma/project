const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function createTestimonialsTable() {
  try {
    console.log('Creating testimonials table...');
    
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'create-testimonials-table.sql'),
      'utf8'
    );
    
    await pool.query(sqlScript);
    
    console.log('Testimonials table created successfully!');
    
    // Insert sample data
    await pool.query(`
      INSERT INTO testimonials (name, star, origin, message) 
      VALUES 
        ('Sarah Johnson', 5, 'Jakarta, Indonesia', 'Amazing experience! The island is a paradise with crystal clear waters and friendly locals. The tour guide was very knowledgeable and made our trip memorable.'),
        ('Ahmad Rahman', 5, 'Makassar, Indonesia', 'Perfect family vacation spot with beautiful beaches and amazing snorkeling. The cultural tour was very educational and fun for the kids.'),
        ('Maria Santos', 4, 'Surabaya, Indonesia', 'Great destination for nature lovers. The coral reefs are stunning and the local food is delicious. Would definitely come back!'),
        ('David Kim', 5, 'Seoul, South Korea', 'Incredible hidden gem! The traditional village experience was authentic and the people were so welcoming. Highly recommended for cultural enthusiasts.'),
        ('Lisa Wong', 3, 'Singapore', 'Nice place but the weather was not great during our visit. The accommodation could be improved. However, the natural beauty is undeniable.')
    `);
    
    console.log('Sample testimonials data inserted successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating testimonials table:', error);
    process.exit(1);
  }
}

createTestimonialsTable(); 