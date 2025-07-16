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
    await connection.execute(`USE ${dbName}`);
    
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

// this is not following the db schema. fix later
async function insertSampleData(connection) {
  console.log('🌱 Inserting sample data...');

  // Hash password for demo accounts
  const saltRounds = 12;
  const demoPassword = await bcrypt.hash('demo123', saltRounds);

  // Insert sample users
  const users = [
    ['Super Administrator', 'superadmin@laiya.com', demoPassword, 'superadmin', null, null, null, true],
    ['Admin Wisata', 'admin@laiya.com', demoPassword, 'admin', null, null, null, true],
    ['UMKM Kerajinan Laiya', 'umkm@laiya.com', demoPassword, 'msme', '+6281234567890', null, null, true],
    ['Penulis Artikel', 'writer@laiya.com', demoPassword, 'contributor', null, 'Universitas Hasanuddin', 'Pariwisata', true]
  ];

  for (const user of users) {
    await connection.execute(
      `INSERT IGNORE INTO users (name, email, password, role, phone, university, major, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      user
    );
  }

  // Insert sample destinations
  const destinations = [
    [
      'Pantai Laiya', 'pantai-laiya',
      'Pantai berpasir putih yang masih alami dengan air laut yang jernih',
      'Pantai berpasir putih yang masih alami dengan air laut yang jernih, sempurna untuk berenang dan snorkeling. Pantai ini menawarkan pemandangan matahari terbit yang menakjubkan dan dikelilingi oleh pohon kelapa.',
      'beaches', -5.1234, 119.5678,
      'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
      true, true
    ],
    [
      'Taman Karang', 'taman-karang',
      'Surga bawah laut dengan kehidupan laut yang beragam',
      'Surga bawah laut dengan kehidupan laut yang beragam dan formasi karang yang berwarna-warni. Sempurna untuk para penggemar diving dan snorkeling.',
      'nature', -5.1300, 119.5700,
      'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg',
      false, true
    ],
    [
      'Desa Mattiro Labangeng', 'desa-mattiro-labangeng',
      'Budaya lokal autentik dan rumah-rumah tradisional',
      'Rasakan budaya lokal yang autentik di Desa Mattiro Labangeng, tempat rumah-rumah tradisional dan adat istiadat masih dilestarikan.',
      'culture', -5.1200, 119.5650,
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg',
      false, true
    ]
  ];

  for (const dest of destinations) {
    await connection.execute(
      `INSERT IGNORE INTO destinations (title, slug, short_description, description, category, latitude, longitude, featured_image, is_featured, is_published) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      dest
    );
  }

  // Insert sample tour packages
  const packages = [
    [
      'Petualangan Island Hopping', 'petualangan-island-hopping',
      'Jelajahi beberapa pulau di sekitar Laiya dengan aktivitas snorkeling dan pantai.',
      750000, '8 jam', 4, 12, '+6281234567890',
      'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg',
      '["Transportasi kapal", "Peralatan snorkeling", "Makan siang", "Pemandu lokal"]',
      true, true
    ],
    [
      'Imersi Budaya', 'imersi-budaya',
      'Rasakan budaya dan tradisi lokal di Desa Mattiro Labangeng.',
      500000, '6 jam', 2, 8, '+6281234567890',
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg',
      '["Tur desa", "Makanan tradisional", "Pertunjukan budaya", "Workshop kerajinan"]',
      false, true
    ]
  ];

  for (const pkg of packages) {
    await connection.execute(
      `INSERT IGNORE INTO tour_packages (name, slug, description, price, duration, min_persons, max_persons, whatsapp_contact, featured_image, facilities, is_featured, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      pkg
    );
  }

  // Get MSME user ID
  const [msmeUsers] = await connection.execute('SELECT id FROM users WHERE role = "msme" LIMIT 1');
  if (msmeUsers.length > 0) {
    const msmeUserId = msmeUsers[0].id;

    // Insert MSME partner
    await connection.execute(
      `INSERT IGNORE INTO msme_partners (user_id, business_name, business_type, description, phone, whatsapp, email, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [msmeUserId, 'Kerajinan Laiya', 'Kerajinan Tangan', 
       'Memproduksi kerajinan tangan dari bahan lokal Pulau Laiya',
       '+6281234567890', '+6281234567890', 'umkm@laiya.com', 'approved']
    );

    // Get MSME partner ID
    const [partners] = await connection.execute('SELECT id FROM msme_partners WHERE user_id = ?', [msmeUserId]);
    if (partners.length > 0) {
      const partnerId = partners[0].id;

      // Insert sample product
      await connection.execute(
        `INSERT IGNORE INTO products (msme_id, name, slug, description, price, stock_quantity, min_order, material, delivery_time, featured_image, is_featured, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [partnerId, 'Kerajinan Tempurung Kelapa', 'kerajinan-tempurung-kelapa',
         'Barang kerajinan indah yang dibuat dari tempurung kelapa dengan teknik tradisional.',
         125000, 15, 1, 'Tempurung kelapa, serat alami', '3-5 hari kerja',
         'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
         true, true]
      );
    }
  }

  // Get contributor user ID and insert sample article
  const [contributors] = await connection.execute('SELECT id FROM users WHERE role = "contributor" LIMIT 1');
  if (contributors.length > 0) {
    const contributorId = contributors[0].id;

    await connection.execute(
      `INSERT IGNORE INTO articles (author_id, title, slug, excerpt, content, category, featured_image, status, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [contributorId, 'Waktu Terbaik Mengunjungi Pulau Laiya', 'waktu-terbaik-mengunjungi-pulau-laiya',
       'Temukan waktu yang tepat untuk mengunjungi Pulau Laiya untuk cuaca dan pengalaman terbaik.',
       'Pulau Laiya indah sepanjang tahun, tetapi waktu terbaik untuk berkunjung adalah antara bulan April hingga Oktober ketika cuaca cerah dan laut tenang. Pada periode ini, Anda dapat menikmati aktivitas snorkeling, diving, dan berjemur di pantai dengan optimal.',
       'tips', 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
       'published', true]
    );
  }

  // Insert sample testimonials
  const testimonials = [
    ['Sarah Johnson', 'sarah@example.com', 5, 'Pengalaman yang luar biasa! Pulau ini adalah surga...', 
     'Pengalaman yang luar biasa! Pulau ini adalah surga dengan air jernih dan penduduk lokal yang ramah. Pemandu wisata sangat berpengetahuan dan membuat perjalanan kami berkesan.',
     'google_123456', true, true],
    ['Ahmad Rahman', 'ahmad@example.com', 5, 'Tempat liburan keluarga yang sempurna...',
     'Tempat liburan keluarga yang sempurna dengan pantai yang indah dan snorkeling yang menakjubkan. Tur budaya sangat edukatif dan menyenangkan untuk anak-anak.',
     'google_789012', true, false]
  ];

  for (const testimonial of testimonials) {
    await connection.execute(
      `INSERT IGNORE INTO testimonials (name, email, rating, review, full_review, google_review_id, is_verified, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      testimonial
    );
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