const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔄 Initializing MySQL database...');

    // Connect to MySQL server (without database)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'laiya_tourism';
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE ${dbName}`);
    
    console.log(`✅ Database '${dbName}' created/verified`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
      }
    }
    
    console.log('✅ Database schema created successfully');

    // Insert sample data
    await insertSampleData(connection);
    
    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function insertSampleData(connection) {
  console.log('🌱 Inserting sample data...');

  // Hash password for demo accounts
  const saltRounds = 12;
  const demoPassword = await bcrypt.hash('demo123', saltRounds);

  // Insert sample users
  const users = [
    ['Super Administrator', 'superadmin@laiya.com', demoPassword, "superadmin",true],
    ['Admin Wisata', 'admin@laiya.com', demoPassword, "admin", true],
    ['UMKM Kerajinan Laiya', 'umkm@laiya.com', demoPassword, "msme", true],
    ['Penulis Artikel', 'writer@laiya.com', demoPassword, "contributor", true]
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
      'Pantai Laiya',
      'Pantai berpasir putih alami dengan air laut jernih',
      'Pantai berpasir putih yang masih alami dengan air laut yang jernih, sempurna untuk berenang dan snorkeling. Pantai ini menawarkan pemandangan matahari terbit yang menakjubkan dan dikelilingi oleh pohon kelapa.',
      'beaches',
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
      -5.1234,
      119.5678,
      JSON.stringify([
        'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=800'
      ])
    ],
    [
      'Taman Karang',
      'Surga bawah laut dengan kehidupan laut yang beragam',
      'Surga bawah laut dengan kehidupan laut yang beragam dan formasi karang yang berwarna-warni. Sempurna untuk para penggemar diving dan snorkeling.',
      'nature',
      'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=800',
      -5.1300,
      119.5700,
      JSON.stringify([
        'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=800'
      ])
    ],
    [
      'Desa Tradisional',
      'Budaya lokal autentik dan rumah-rumah tradisional',
      'Rasakan budaya lokal yang autentik di Desa Mattiro Labangeng, tempat rumah-rumah tradisional dan adat istiadat masih dilestarikan.',
      'culture',
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      -5.1200,
      119.5650,
      JSON.stringify([
        'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800'
      ])
    ]
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
      'Petualangan Island Hopping',
      'Jelajahi beberapa pulau di sekitar Laiya dengan aktivitas snorkeling dan pantai.',
      750000,
      '8 jam',
      4,
      12,
      '+6281234567890',
      JSON.stringify(['Transportasi kapal', 'Peralatan snorkeling', 'Makan siang', 'Pemandu lokal']),
      'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800',
      true
    ],
    [
      'Imersi Budaya',
      'Rasakan budaya dan tradisi lokal di Desa Mattiro Labangeng.',
      500000,
      '6 jam',
      2,
      8,
      '+6281234567890',
      JSON.stringify(['Tur desa', 'Makanan tradisional', 'Pertunjukan budaya', 'Workshop kerajinan']),
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      false
    ]
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
      'Tari Saman',
      'Tarian tradisional yang dipentaskan saat festival dan perayaan.',
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      'dance',
      JSON.stringify([
        'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800'
      ])
    ],
    [
      'Ikan Bakar Laiya',
      'Ikan segar yang dibakar dengan bumbu tradisional dan nasi kelapa.',
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
      'culinary',
      JSON.stringify([
        'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800'
      ])
    ]
  ];

  for (const culture of cultures) {
    await connection.execute(
      `INSERT IGNORE INTO cultures (title, description, image, category, gallery) 
       VALUES (?, ?, ?, ?, ?)`,
      culture
    );
  }

  // Get UMKM user ID
  const [umkmUsers] = await connection.execute('SELECT id FROM users WHERE email = "umkm@laiya.com" LIMIT 1');
  if (umkmUsers.length > 0) {
    const umkmUserId = umkmUsers[0].id;

    // Insert MSME
    await connection.execute(
      `INSERT IGNORE INTO msmes (brand, description, phone, instagram, shopee, whatsapp, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'UD Laiya',
        'usaha dagang keren',
        '09876544326',
        'https://instagram.com/laiya/',
        'https://shopee.co.id/seller/laiya',
        '09877631132',
        umkmUserId
      ]
    );

    // Get MSME ID
    const [msmes] = await connection.execute('SELECT id FROM msmes WHERE user_id = ? LIMIT 1', [umkmUserId]);
    if (msmes.length > 0) {
      const msmeId = msmes[0].id;

      // Insert sample products
      const products = [
        [
          'Kerajinan Tempurung Kelapa',
          125000,
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
          'Barang kerajinan indah yang dibuat dari tempurung kelapa.',
          'Tempurung kelapa, serat alami',
          '5+ tahun dengan perawatan yang tepat',
          '3-5 hari kerja',
          msmeId,
          JSON.stringify(['2', '3'])
        ],
        [
          'Tas Anyaman Pandan',
          85000,
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
          'Tas cantik dari anyaman pandan berkualitas tinggi.',
          'Daun pandan, benang katun',
          '3+ tahun dengan perawatan yang tepat',
          '2-4 hari kerja',
          msmeId,
          JSON.stringify(['1', '3'])
        ],
        [
          'Hiasan Dinding Bambu',
          95000,
          'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
          'Hiasan dinding artistik dari bambu lokal.',
          'Bambu, cat alami',
          '4+ tahun dengan perawatan yang tepat',
          '4-6 hari kerja',
          msmeId,
          JSON.stringify(['1', '2'])
        ]
      ];

      for (const product of products) {
        await connection.execute(
          `INSERT IGNORE INTO products (name, price, image, description, material, durability, delivery_time, msme_id, related_products) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          product
        );
      }
    }
  }

  console.log('✅ Sample data inserted successfully');
}

// Run initialization if called directly
if (require.main === module) {
  require('dotenv').config();
  initializeDatabase()
    .then(() => {
      console.log('\n🎉 Database ready for use!');
      console.log('\n📋 Demo login accounts:');
      console.log('Superadmin: superadmin@laiya.com / demo123');
      console.log('Admin: admin@laiya.com / demo123');
      console.log('UMKM: umkm@laiya.com / demo123');
      console.log('Writer: writer@laiya.com / demo123');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;