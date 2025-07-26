const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DB_NAME = process.env.DB_NAME || "laiya_tourism";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";

async function createContactMessagesTable() {
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

    console.log("Creating contact_messages table...");
    const sqlFilePath = path.join(
      __dirname,
      "create-contact-messages-table.sql"
    );
    const sql = fs.readFileSync(sqlFilePath, "utf8");
    await connection.query(sql);
    console.log("✅ contact_messages table created successfully");
  } catch (error) {
    console.error("Error creating contact_messages table:", error);

    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

if (require.main === module) {
  createContactMessagesTable()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createContactMessagesTable;
