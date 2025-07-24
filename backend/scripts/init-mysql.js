const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

async function initializeDatabase() {
  let connection;

  try {
    console.log("🔄 Initializing MySQL database...");

    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
    });

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || "laiya_tourism";
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connection.query(`USE ${dbName}`);

    console.log(`✅ Database '${dbName}' created/verified`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, "../database/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split schema into individual statements
    const statements = schema
      .split(";")
      .filter((stmt) => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }

    console.log("✅ Database schema created successfully");

    // Insert sample data
    await insertSampleData(connection);

    console.log("✅ Database initialization completed successfully!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function insertSampleData(connection) {
  console.log("🌱 Inserting sample data...");

  // Hash password for demo accounts
  const saltRounds = 12;
  const demoPassword = await bcrypt.hash("demo123", saltRounds);

  // Insert sample users
  const users = [
    [
      "Super Administrator",
      "superadmin@laiya.com",
      demoPassword,
      "superadmin",
      true,
    ],
    ["Admin Wisata", "admin@laiya.com", demoPassword, "admin", true],
    ["UMKM Kerajinan Laiya", "umkm@laiya.com", demoPassword, "msme", true],
    ["Penulis Artikel", "writer@laiya.com", demoPassword, "contributor", true],
  ];

  for (const user of users) {
    await connection.execute(
      `INSERT IGNORE INTO users (name, email, password, role, is_active) 
       VALUES (?, ?, ?, ?, ?)`,
      user
    );
  }

  // Insert sample destinations
  const destinations = [
    [
      "Pantai Laiya",
      "Pantai berpasir putih alami dengan air laut jernih",
      "Pantai berpasir putih yang masih alami dengan air laut yang jernih, sempurna untuk berenang dan snorkeling. Pantai ini menawarkan pemandangan matahari terbit yang menakjubkan dan dikelilingi oleh pohon kelapa.",
      "beaches",
      "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
      -5.1234,
      119.5678,
      JSON.stringify([
        "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800",
      ]),
    ],
    [
      "Taman Karang",
      "Surga bawah laut dengan kehidupan laut yang beragam",
      "Surga bawah laut dengan kehidupan laut yang beragam dan formasi karang yang berwarna-warni. Sempurna untuk para penggemar diving dan snorkeling.",
      "nature",
      "https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=800",
      -5.13,
      119.57,
      JSON.stringify([
        "https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=800",
      ]),
    ],
    [
      "Desa Tradisional",
      "Budaya lokal autentik dan rumah-rumah tradisional",
      "Rasakan budaya lokal yang autentik di Desa Mattiro Labangeng, tempat rumah-rumah tradisional dan adat istiadat masih dilestarikan.",
      "culture",
      "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800",
      -5.12,
      119.565,
      JSON.stringify([
        "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800",
      ]),
    ],
  ];

  for (const dest of destinations) {
    await connection.execute(
      `INSERT IGNORE INTO destinations (title, short_description, description, category, image, latitude, longitude, gallery) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      dest
    );
  }

  // Insert sample tour packages
  const packages = [
    [
      "Petualangan Island Hopping",
      "Jelajahi beberapa pulau di sekitar Laiya dengan aktivitas snorkeling dan pantai.",
      750000,
      "8 jam",
      4,
      12,
      "+6281234567890",
      JSON.stringify([
        "Transportasi kapal",
        "Peralatan snorkeling",
        "Makan siang",
        "Pemandu lokal",
      ]),
      "https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800",
      true,
    ],
    [
      "Imersi Budaya",
      "Rasakan budaya dan tradisi lokal di Desa Mattiro Labangeng.",
      500000,
      "6 jam",
      2,
      8,
      "+6281234567890",
      JSON.stringify([
        "Tur desa",
        "Makanan tradisional",
        "Pertunjukan budaya",
        "Workshop kerajinan",
      ]),
      "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800",
      false,
    ],
  ];

  for (const pkg of packages) {
    await connection.execute(
      `INSERT IGNORE INTO tour_packages (name, description, price, duration, min_persons, max_persons, whatsapp_contact, facilities, image, popular) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      pkg
    );
  }

  // Insert sample cultures
  const cultures = [
    [
      "Tari Saman",
      "Tarian tradisional yang dipentaskan saat festival dan perayaan.",
      "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800",
      "dance",
      JSON.stringify([
        "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800",
      ]),
    ],
    [
      "Ikan Bakar Laiya",
      "Ikan segar yang dibakar dengan bumbu tradisional dan nasi kelapa.",
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      "culinary",
      JSON.stringify([
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
      ]),
    ],
  ];

  for (const culture of cultures) {
    await connection.execute(
      `INSERT IGNORE INTO cultures (title, description, image, category, gallery) 
       VALUES (?, ?, ?, ?, ?)`,
      culture
    );
  }

  // Get UMKM user ID
  const [umkmUsers] = await connection.execute(
    'SELECT id FROM users WHERE email = "umkm@laiya.com" LIMIT 1'
  );
  if (umkmUsers.length > 0) {
    const umkmUserId = umkmUsers[0].id;

    // Insert multiple sample MSMEs
    const msmeData = [
      {
        brand: "UD Laiya",
        description:
          "Usaha dagang kerajinan tangan dan produk lokal Pulau Laiya dengan kualitas terpercaya",
        phone: "09876544326",
        instagram: "https://instagram.com/laiya/",
        shopee: "https://shopee.co.id/seller/laiya",
        whatsapp: "09877631132",
        user_id: umkmUserId,
      },
      {
        brand: "Kerajinan Tangan Laiya",
        description:
          "Kerajinan tangan unik dari bahan lokal pulau Laiya dengan kualitas premium",
        phone: "+62 812-3456-7890",
        instagram: "kerajinan_laiya",
        shopee: "https://shopee.co.id/kerajinan-laiya",
        whatsapp: "+62 812-3456-7890",
        user_id: umkmUserId,
      },
      {
        brand: "Kuliner Seafood Laiya",
        description:
          "Produk makanan laut dan kuliner khas Pulau Laiya yang segar dan berkualitas",
        phone: "+62 813-4567-8901",
        instagram: "seafood_laiya",
        shopee: "https://shopee.co.id/seafood-laiya",
        whatsapp: "+62 813-4567-8901",
        user_id: umkmUserId,
      },
    ];

    // Insert MSMEs and collect their IDs
    const msmeIds = [];
    for (const msme of msmeData) {
      const [result] = await connection.execute(
        `INSERT IGNORE INTO msmes (brand, description, phone, instagram, shopee, whatsapp, user_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          msme.brand,
          msme.description,
          msme.phone,
          msme.instagram,
          msme.shopee,
          msme.whatsapp,
          msme.user_id,
        ]
      );
      msmeIds.push(result.insertId);
    }

    // Insert comprehensive sample products for all MSMEs
    const productsData = [
      // Products for UD Laiya (msmeIds[0])
      [
        "Kerajinan Tempurung Kelapa",
        125000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Barang kerajinan indah yang dibuat dari tempurung kelapa.",
        "Tempurung kelapa, serat alami",
        "5+ tahun dengan perawatan yang tepat",
        "3-5 hari kerja",
        msmeIds[0],
        JSON.stringify(["2", "3"]),
      ],
      [
        "Tas Anyaman Pandan",
        85000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Tas cantik dari anyaman pandan berkualitas tinggi.",
        "Daun pandan, benang katun",
        "3+ tahun dengan perawatan yang tepat",
        "2-4 hari kerja",
        msmeIds[0],
        JSON.stringify(["1", "3"]),
      ],
      [
        "Hiasan Dinding Bambu",
        95000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Hiasan dinding artistik dari bambu lokal.",
        "Bambu, cat alami",
        "4+ tahun dengan perawatan yang tepat",
        "4-6 hari kerja",
        msmeIds[0],
        JSON.stringify(["1", "2"]),
      ],
      // Products for Kerajinan Tangan Laiya (msmeIds[1])
      [
        "Tas Rotan Laiya",
        150000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Tas rotan handmade berkualitas tinggi",
        "Rotan alami",
        "Awet hingga 5 tahun",
        "3-5 hari",
        msmeIds[1],
        JSON.stringify([]),
      ],
      [
        "Tempat Pensil Bambu",
        25000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Tempat pensil dari bambu dengan ukiran tradisional",
        "Bambu lokal",
        "Tahan lama",
        "1-2 hari",
        msmeIds[1],
        JSON.stringify([]),
      ],
      [
        "Lampu Hias Kelapa",
        75000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Lampu hias unik dari tempurung kelapa",
        "Tempurung kelapa",
        "Awet dan unik",
        "2-3 hari",
        msmeIds[1],
        JSON.stringify([]),
      ],
      // Products for Kuliner Seafood Laiya (msmeIds[2])
      [
        "Kerupuk Ikan Laiya",
        35000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Kerupuk ikan segar khas Pulau Laiya",
        "Ikan segar lokal",
        "Best before 6 bulan",
        "1 hari",
        msmeIds[2],
        JSON.stringify([]),
      ],
      [
        "Sambal Terasi Laiya",
        20000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Sambal terasi pedas dengan udang segar",
        "Udang lokal, cabai",
        "Best before 3 bulan",
        "Same day",
        msmeIds[2],
        JSON.stringify([]),
      ],
      [
        "Dendeng Ikan Tongkol",
        80000,
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        "Dendeng ikan tongkol asap tradisional",
        "Ikan tongkol segar",
        "Best before 1 bulan",
        "2-3 hari",
        msmeIds[2],
        JSON.stringify([]),
      ],
    ];

    // Insert all products
    for (const product of productsData) {
      await connection.execute(
        `INSERT IGNORE INTO products (name, price, image, description, material, durability, delivery_time, msme_id, related_products) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        product
      );
    }
  }

  // Get contributor user ID for articles
  const [contributorUsers] = await connection.execute(
    'SELECT id FROM users WHERE email = "writer@laiya.com" LIMIT 1'
  );
  if (contributorUsers.length > 0) {
    const contributorUserId = contributorUsers[0].id;

    // Insert sample articles
    const articles = [
      [
        contributorUserId,
        "Waktu Terbaik Mengunjungi Pulau Laiya",
        "waktu-terbaik-mengunjungi-pulau-laiya",
        "Pulau Laiya indah sepanjang tahun, tetapi waktu terbaik untuk berkunjung adalah antara bulan April hingga Oktober ketika cuaca cerah dan laut tenang. Pada periode ini, Anda dapat menikmati aktivitas snorkeling, diving, dan berjemur di pantai dengan optimal. Musim kemarau memberikan visibilitas bawah laut yang sempurna dan ombak yang tenang.",
        "Temukan waktu yang tepat untuk mengunjungi Pulau Laiya untuk cuaca dan pengalaman terbaik.",
        "tips",
        "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800",
        "published",
        true,
        JSON.stringify(["wisata", "tips", "cuaca", "laiya"]),
        new Date(),
      ],
      [
        contributorUserId,
        "Keindahan Bawah Laut Pulau Laiya",
        "keindahan-bawah-laut-pulau-laiya",
        "Pulau Laiya menawarkan kehidupan bawah laut yang menakjubkan dengan beragam spesies ikan tropis dan terumbu karang yang masih alami. Spot diving dan snorkeling di sekitar pulau memberikan pengalaman yang tak terlupakan. Air laut yang jernih dengan visibilitas hingga 15-20 meter memungkinkan pengunjung melihat keindahan alam bawah laut dengan sempurna.",
        "Jelajahi kehidupan bawah laut yang menakjubkan di perairan Pulau Laiya.",
        "tourism",
        "https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=800",
        "published",
        true,
        JSON.stringify([
          "diving",
          "snorkeling",
          "bawah laut",
          "terumbu karang",
        ]),
        new Date(),
      ],
      [
        contributorUserId,
        "Budaya dan Tradisi Desa Mattiro Labangeng",
        "budaya-tradisi-desa-mattiro-labangeng",
        "Desa Mattiro Labangeng memiliki kekayaan budaya dan tradisi yang masih dilestarikan hingga saat ini. Rumah-rumah tradisional dengan arsitektur khas, upacara adat, dan kesenian lokal menjadi daya tarik tersendiri. Pengunjung dapat menyaksikan pertunjukan tari tradisional, belajar membuat kerajinan tangan, dan merasakan kehidupan masyarakat lokal yang ramah.",
        "Mengenal lebih dekat budaya dan tradisi autentik masyarakat Desa Mattiro Labangeng.",
        "culture",
        "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800",
        "published",
        false,
        JSON.stringify(["budaya", "tradisi", "desa", "kerajinan"]),
        new Date(),
      ],
    ];

    for (const article of articles) {
      await connection.execute(
        `INSERT IGNORE INTO articles (author_id, title, slug, content, excerpt, category, featured_image, status, is_featured, tags, published_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        article
      );
    }
  }

  console.log("✅ Sample data inserted successfully");
}

// Run initialization if called directly
if (require.main === module) {
  require("dotenv").config();
  initializeDatabase()
    .then(() => {
      console.log("\n🎉 Database ready for use!");
      console.log("\n📋 Demo login accounts:");
      console.log("Superadmin: superadmin@laiya.com / demo123");
      console.log("Admin: admin@laiya.com / demo123");
      console.log("UMKM: umkm@laiya.com / demo123");
      console.log("Writer: writer@laiya.com / demo123");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to initialize database:", error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;
