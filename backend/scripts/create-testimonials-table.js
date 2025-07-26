const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME || "laiya_tourism";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

async function createTestimonialsTable() {
  let connection;
  try {
    // Connect to MySQL server (tanpa database dulu)
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
    });
    // Buat database jika belum ada
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`USE \`${DB_NAME}\``);

    console.log("Creating testimonials table...");
    const sqlScript = fs.readFileSync(
      path.join(__dirname, "create-testimonials-table.sql"),
      "utf8"
    );
    await connection.query(sqlScript);
    console.log("Testimonials table created successfully!");
    // Insert sample data
    await connection.query(`
      INSERT INTO testimonials (name, star, origin, message) 
      VALUES 
        ('Sarah Johnson', 5, 'Jakarta, Indonesia', 'Amazing experience! The island is a paradise with crystal clear waters and friendly locals. The tour guide was very knowledgeable and made our trip memorable.'),
        ('Ahmad Rahman', 5, 'Makassar, Indonesia', 'Perfect family vacation spot with beautiful beaches and amazing snorkeling. The cultural tour was very educational and fun for the kids.'),
        ('Maria Santos', 4, 'Surabaya, Indonesia', 'Great destination for nature lovers. The coral reefs are stunning and the local food is delicious. Would definitely come back!'),
        ('David Kim', 5, 'Seoul, South Korea', 'Incredible hidden gem! The traditional village experience was authentic and the people were so welcoming. Highly recommended for cultural enthusiasts.'),
        ('Lisa Wong', 3, 'Singapore', 'Nice place but the weather was not great during our visit. The accommodation could be improved. However, the natural beauty is undeniable.')
    `);
    console.log("Sample testimonials data inserted successfully!");
  } catch (error) {
    console.error("Error creating testimonials table:", error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  createTestimonialsTable()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createTestimonialsTable;
