const path = require("path");

// 1. Inisialisasi database, schema, dan sample data utama
const initMysql = require("./init-mysql");
// 2. Settings & facilities
const { createSettingsTables } = require("./create-settings-tables");
const { executeSqlFile } = require("./execute-settings-sql");
// 3. Island profile settings
const addIslandProfileSettings = require("./add-island-profile-settings");
// 4. Tabel tambahan
const createTestimonialsTable = require("./create-testimonials-table");
const createContactMessagesTable = require("./create-contact-table");
const { createTransportationTable } = require("./create-transportation-table");

async function setupAll() {
  try {
    console.log("==============================");
    console.log("  SETUP DATABASE PULAU LAIYA  ");
    console.log("==============================");
    // 1. Init DB, schema, sample data
    await initMysql();
    // 2. Settings & facilities
    await createSettingsTables();
    await executeSqlFile();
    // 3. Island profile
    await addIslandProfileSettings();
    // 4. Tabel tambahan
    await createTestimonialsTable();
    await createContactMessagesTable();
    await createTransportationTable();
    console.log("==============================");
    console.log("✅ Semua proses inisialisasi database selesai!");
    console.log("==============================");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error saat setup database:", err);
    process.exit(1);
  }
}

if (require.main === module) {
  setupAll();
}

module.exports = setupAll;
