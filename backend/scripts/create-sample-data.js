const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function createSampleData() {
  try {
    console.log('🌱 Creating sample data...');

    // Create sample users
    const saltRounds = 12;
    const defaultPassword = await bcrypt.hash('demo123', saltRounds);

    const users = [
      {
        name: 'Super Administrator',
        email: 'superadmin@laiya.com',
        password: defaultPassword,
        role: 'superadmin',
        is_verified: true
      },
      {
        name: 'Admin Wisata',
        email: 'admin@laiya.com',
        password: defaultPassword,
        role: 'admin',
        is_verified: true
      },
      {
        name: 'UMKM Kerajinan Laiya',
        email: 'umkm@laiya.com',
        password: defaultPassword,
        role: 'msme',
        phone: '+6281234567890',
        is_verified: true
      },
      {
        name: 'Penulis Artikel',
        email: 'penulis@laiya.com',
        password: defaultPassword,
        role: 'contributor',
        university: 'Universitas Hasanuddin',
        major: 'Pariwisata',
        is_verified: true
      }
    ];

    for (const user of users) {
      await pool.execute(
        `INSERT INTO users (name, email, password, role, phone, university, major, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.name, user.email, user.password, user.role, user.phone || null, 
         user.university || null, user.major || null, user.is_verified]
      );
    }

    // Create sample destinations
    const destinations = [
      {
        title: 'Pantai Laiya',
        slug: 'pantai-laiya',
        short_description: 'Pantai berpasir putih yang masih alami dengan air laut yang jernih',
        description: 'Pantai berpasir putih yang masih alami dengan air laut yang jernih, sempurna untuk berenang dan snorkeling. Pantai ini menawarkan pemandangan matahari terbit yang menakjubkan dan dikelilingi oleh pohon kelapa.',
        category: 'beaches',
        latitude: -5.1234,
        longitude: 119.5678,
        featured_image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
        is_featured: true,
        is_published: true
      },
      {
        title: 'Taman Karang',
        slug: 'taman-karang',
        short_description: 'Surga bawah laut dengan kehidupan laut yang beragam',
        description: 'Surga bawah laut dengan kehidupan laut yang beragam dan formasi karang yang berwarna-warni. Sempurna untuk para penggemar diving dan snorkeling.',
        category: 'nature',
        latitude: -5.1300,
        longitude: 119.5700,
        featured_image: 'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg',
        is_featured: false,
        is_published: true
      }
    ];

    for (const dest of destinations) {
      await pool.execute(
        `INSERT INTO destinations (title, slug, short_description, description, category, 
         latitude, longitude, featured_image, is_featured, is_published) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [dest.title, dest.slug, dest.short_description, dest.description, dest.category,
         dest.latitude, dest.longitude, dest.featured_image, dest.is_featured, dest.is_published]
      );
    }

    // Create sample tour packages
    const tourPackages = [
      {
        name: 'Petualangan Island Hopping',
        slug: 'petualangan-island-hopping',
        description: 'Jelajahi beberapa pulau di sekitar Laiya dengan aktivitas snorkeling dan pantai.',
        price: 750000,
        duration: '8 jam',
        min_persons: 4,
        max_persons: 12,
        whatsapp_contact: '+6281234567890',
        featured_image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg',
        is_featured: true,
        is_active: true
      },
      {
        name: 'Imersi Budaya',
        slug: 'imersi-budaya',
        description: 'Rasakan budaya dan tradisi lokal di Desa Mattiro Labangeng.',
        price: 500000,
        duration: '6 jam',
        min_persons: 2,
        max_persons: 8,
        whatsapp_contact: '+6281234567890',
        featured_image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg',
        is_featured: false,
        is_active: true
      }
    ];

    for (const pkg of tourPackages) {
      await pool.execute(
        `INSERT INTO tour_packages (name, slug, description, price, duration, min_persons, 
         max_persons, whatsapp_contact, featured_image, is_featured, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pkg.name, pkg.slug, pkg.description, pkg.price, pkg.duration, pkg.min_persons,
         pkg.max_persons, pkg.whatsapp_contact, pkg.featured_image, pkg.is_featured, pkg.is_active]
      );
    }

    // Get MSME user ID
    const [msmeUser] = await pool.execute('SELECT id FROM users WHERE role = "msme" LIMIT 1');
    const msmeUserId = msmeUser[0].id;

    // Create MSME partner
    await pool.execute(
      `INSERT INTO msme_partners (user_id, business_name, business_type, description, 
       phone, whatsapp, email, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [msmeUserId, 'Kerajinan Laiya', 'Kerajinan Tangan', 
       'Memproduksi kerajinan tangan dari bahan lokal Pulau Laiya',
       '+6281234567890', '+6281234567890', 'umkm@laiya.com', 'approved']
    );

    // Get MSME partner ID
    const [msmePartner] = await pool.execute('SELECT id FROM msme_partners WHERE user_id = ?', [msmeUserId]);
    const msmePartnerId = msmePartner[0].id;

    // Create sample products
    const products = [
      {
        msme_id: msmePartnerId,
        name: 'Kerajinan Tempurung Kelapa',
        slug: 'kerajinan-tempurung-kelapa',
        description: 'Barang kerajinan indah yang dibuat dari tempurung kelapa dengan teknik tradisional.',
        price: 125000,
        stock_quantity: 15,
        min_order: 1,
        material: 'Tempurung kelapa, serat alami',
        delivery_time: '3-5 hari kerja',
        featured_image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        is_featured: true,
        is_active: true
      }
    ];

    for (const product of products) {
      await pool.execute(
        `INSERT INTO products (msme_id, name, slug, description, price, stock_quantity, 
         min_order, material, delivery_time, featured_image, is_featured, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [product.msme_id, product.name, product.slug, product.description, product.price,
         product.stock_quantity, product.min_order, product.material, product.delivery_time,
         product.featured_image, product.is_featured, product.is_active]
      );
    }

    // Get contributor user ID
    const [contributorUser] = await pool.execute('SELECT id FROM users WHERE role = "contributor" LIMIT 1');
    const contributorUserId = contributorUser[0].id;

    // Create sample articles
    const articles = [
      {
        author_id: contributorUserId,
        title: 'Waktu Terbaik Mengunjungi Pulau Laiya',
        slug: 'waktu-terbaik-mengunjungi-pulau-laiya',
        excerpt: 'Temukan waktu yang tepat untuk mengunjungi Pulau Laiya untuk cuaca dan pengalaman terbaik.',
        content: 'Pulau Laiya indah sepanjang tahun, tetapi waktu terbaik untuk berkunjung adalah antara bulan April hingga Oktober ketika cuaca cerah dan laut tenang. Pada periode ini, Anda dapat menikmati aktivitas snorkeling, diving, dan berjemur di pantai dengan optimal.',
        category: 'tips',
        featured_image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
        status: 'published',
        is_featured: true
      }
    ];

    for (const article of articles) {
      await pool.execute(
        `INSERT INTO articles (author_id, title, slug, excerpt, content, category, 
         featured_image, status, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [article.author_id, article.title, article.slug, article.excerpt, article.content,
         article.category, article.featured_image, article.status, article.is_featured]
      );
    }

    // Create sample testimonials
    const testimonials = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        rating: 5,
        review: 'Pengalaman yang luar biasa! Pulau ini adalah surga...',
        full_review: 'Pengalaman yang luar biasa! Pulau ini adalah surga dengan air jernih dan penduduk lokal yang ramah. Pemandu wisata sangat berpengetahuan dan membuat perjalanan kami berkesan.',
        google_review_id: 'google_123456',
        is_verified: true,
        is_featured: true
      },
      {
        name: 'Ahmad Rahman',
        email: 'ahmad@example.com',
        rating: 5,
        review: 'Tempat liburan keluarga yang sempurna...',
        full_review: 'Tempat liburan keluarga yang sempurna dengan pantai yang indah dan snorkeling yang menakjubkan. Tur budaya sangat edukatif dan menyenangkan untuk anak-anak.',
        google_review_id: 'google_789012',
        is_verified: true,
        is_featured: false
      }
    ];

    for (const testimonial of testimonials) {
      await pool.execute(
        `INSERT INTO testimonials (name, email, rating, review, full_review, 
         google_review_id, is_verified, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [testimonial.name, testimonial.email, testimonial.rating, testimonial.review,
         testimonial.full_review, testimonial.google_review_id, testimonial.is_verified,
         testimonial.is_featured]
      );
    }

    console.log('✅ Sample data created successfully!');
    console.log('\n📋 Login credentials:');
    console.log('Superadmin: superadmin@laiya.com / demo123');
    console.log('Admin: admin@laiya.com / demo123');
    console.log('UMKM: umkm@laiya.com / demo123');
    console.log('Contributor: penulis@laiya.com / demo123');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    process.exit();
  }
}

// Run if called directly
if (require.main === module) {
  createSampleData();
}

module.exports = createSampleData;