const { pool } = require("../config/database");
const bcrypt = require("bcryptjs");

async function createSampleData() {
  try {
    console.log("🌱 Creating sample data...");

    // Create sample users
    const saltRounds = 12;
    const defaultPassword = await bcrypt.hash("demo123", saltRounds);

    const users = [
      {
        name: "Super Administrator",
        email: "superadmin@laiya.com",
        password: defaultPassword,
        role: "superadmin",
        is_verified: true,
      },
      {
        name: "Admin Wisata",
        email: "admin@laiya.com",
        password: defaultPassword,
        role: "admin",
        is_verified: true,
      },
      {
        name: "UMKM Kerajinan Laiya",
        email: "umkm@laiya.com",
        password: defaultPassword,
        role: "msme",
        phone: "+6281234567890",
        is_verified: true,
      },
      {
        name: "Penulis Artikel",
        email: "penulis@laiya.com",
        password: defaultPassword,
        role: "contributor",
        university: "Universitas Hasanuddin",
        major: "Pariwisata",
        is_verified: true,
      },
    ];

    for (const user of users) {
      await pool.execute(
        `INSERT INTO users (name, email, password, role, phone, university, major, is_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.name,
          user.email,
          user.password,
          user.role,
          user.phone || null,
          user.university || null,
          user.major || null,
          user.is_verified,
        ]
      );
    }

    // Create sample destinations
    const destinations = [
      {
        title: "Pantai Laiya",
        slug: "pantai-laiya",
        short_description:
          "Pantai berpasir putih yang masih alami dengan air laut yang jernih",
        description:
          "Pantai berpasir putih yang masih alami dengan air laut yang jernih, sempurna untuk berenang dan snorkeling. Pantai ini menawarkan pemandangan matahari terbit yang menakjubkan dan dikelilingi oleh pohon kelapa.",
        category: "beaches",
        latitude: -5.1234,
        longitude: 119.5678,
        featured_image:
          "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg",
        is_featured: true,
        is_published: true,
      },
      {
        title: "Taman Karang",
        slug: "taman-karang",
        short_description:
          "Surga bawah laut dengan kehidupan laut yang beragam",
        description:
          "Surga bawah laut dengan kehidupan laut yang beragam dan formasi karang yang berwarna-warni. Sempurna untuk para penggemar diving dan snorkeling.",
        category: "nature",
        latitude: -5.13,
        longitude: 119.57,
        featured_image:
          "https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg",
        is_featured: false,
        is_published: true,
      },
    ];

    for (const dest of destinations) {
      await pool.execute(
        `INSERT INTO destinations (title, slug, short_description, description, category, 
         latitude, longitude, featured_image, is_featured, is_published) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dest.title,
          dest.slug,
          dest.short_description,
          dest.description,
          dest.category,
          dest.latitude,
          dest.longitude,
          dest.featured_image,
          dest.is_featured,
          dest.is_published,
        ]
      );
    }

    // Create sample tour packages
    const tourPackages = [
      {
        name: "Petualangan Island Hopping",
        slug: "petualangan-island-hopping",
        description:
          "Jelajahi beberapa pulau di sekitar Laiya dengan aktivitas snorkeling dan pantai.",
        price: 750000,
        duration: "8 jam",
        min_persons: 4,
        max_persons: 12,
        whatsapp_contact: "+6281234567890",
        featured_image:
          "https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg",
        is_featured: true,
        is_active: true,
      },
      {
        name: "Imersi Budaya",
        slug: "imersi-budaya",
        description:
          "Rasakan budaya dan tradisi lokal di Desa Mattiro Labangeng.",
        price: 500000,
        duration: "6 jam",
        min_persons: 2,
        max_persons: 8,
        whatsapp_contact: "+6281234567890",
        featured_image:
          "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
        is_featured: false,
        is_active: true,
      },
    ];

    for (const pkg of tourPackages) {
      await pool.execute(
        `INSERT INTO tour_packages (name, slug, description, price, duration, min_persons, 
         max_persons, whatsapp_contact, featured_image, is_featured, is_active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pkg.name,
          pkg.slug,
          pkg.description,
          pkg.price,
          pkg.duration,
          pkg.min_persons,
          pkg.max_persons,
          pkg.whatsapp_contact,
          pkg.featured_image,
          pkg.is_featured,
          pkg.is_active,
        ]
      );
    }

    // Get MSME user ID
    const [msmeUser] = await pool.execute(
      'SELECT id FROM users WHERE role = "msme" LIMIT 1'
    );
    const msmeUserId = msmeUser[0].id;

    // Create sample MSMEs using correct table structure
    const msmeData = [
      {
        brand: "UD Laiya",
        description:
          "Usaha dagang kerajinan tangan dan produk lokal Pulau Laiya dengan kualitas terpercaya",
        phone: "09876544326",
        instagram: "https://instagram.com/laiya/",
        shopee: "https://shopee.co.id/seller/laiya",
        whatsapp: "09877631132",
        user_id: msmeUserId,
      },
      {
        brand: "Kerajinan Tangan Laiya",
        description:
          "Kerajinan tangan unik dari bahan lokal pulau Laiya dengan kualitas premium",
        phone: "+62 812-3456-7890",
        instagram: "kerajinan_laiya",
        shopee: "https://shopee.co.id/kerajinan-laiya",
        whatsapp: "+62 812-3456-7890",
        user_id: msmeUserId,
      },
      {
        brand: "Kuliner Seafood Laiya",
        description:
          "Produk makanan laut dan kuliner khas Pulau Laiya yang segar dan berkualitas",
        phone: "+62 813-4567-8901",
        instagram: "seafood_laiya",
        shopee: "https://shopee.co.id/seafood-laiya",
        whatsapp: "+62 813-4567-8901",
        user_id: msmeUserId,
      },
    ];

    // Insert MSMEs
    const msmeIds = [];
    for (const msme of msmeData) {
      const [result] = await pool.execute(
        `INSERT INTO msmes (brand, description, phone, instagram, shopee, whatsapp, user_id) 
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

    // Create sample products for each MSME
    const productsData = [
      // Products for UD Laiya (msmeIds[0])
      {
        name: "Kerajinan Tempurung Kelapa",
        price: 125000,
        image:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        description:
          "Barang kerajinan indah yang dibuat dari tempurung kelapa.",
        material: "Tempurung kelapa, serat alami",
        durability: "5+ tahun dengan perawatan yang tepat",
        deliveryTime: "3-5 hari kerja",
        msme_id: msmeIds[0],
        relatedProducts: JSON.stringify(["2", "3"]),
      },
      {
        name: "Tas Anyaman Pandan",
        price: 85000,
        image:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Tas cantik dari anyaman pandan berkualitas tinggi.",
        material: "Daun pandan, benang katun",
        durability: "3+ tahun dengan perawatan yang tepat",
        deliveryTime: "2-4 hari kerja",
        msme_id: msmeIds[0],
        relatedProducts: JSON.stringify(["1", "3"]),
      },
      {
        name: "Hiasan Dinding Bambu",
        price: 95000,
        image:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
        description: "Hiasan dinding artistik dari bambu lokal.",
        material: "Bambu, cat alami",
        durability: "4+ tahun dengan perawatan yang tepat",
        deliveryTime: "4-6 hari kerja",
        msme_id: msmeIds[0],
        relatedProducts: JSON.stringify(["1", "2"]),
      },
      // Products for Kerajinan Tangan Laiya (msmeIds[1])
      {
        name: "Tas Rotan Laiya",
        price: 150000,
        image: "tas-rotan-1.jpg",
        description: "Tas rotan handmade berkualitas tinggi",
        material: "Rotan alami",
        durability: "Awet hingga 5 tahun",
        deliveryTime: "3-5 hari",
        msme_id: msmeIds[1],
        relatedProducts: JSON.stringify([]),
      },
      {
        name: "Tempat Pensil Bambu",
        price: 25000,
        image: "tempat-pensil-1.jpg",
        description: "Tempat pensil dari bambu dengan ukiran tradisional",
        material: "Bambu lokal",
        durability: "Tahan lama",
        deliveryTime: "1-2 hari",
        msme_id: msmeIds[1],
        relatedProducts: JSON.stringify([]),
      },
      {
        name: "Lampu Hias Kelapa",
        price: 75000,
        image: "lampu-kelapa-1.jpg",
        description: "Lampu hias unik dari tempurung kelapa",
        material: "Tempurung kelapa",
        durability: "Awet dan unik",
        deliveryTime: "2-3 hari",
        msme_id: msmeIds[1],
        relatedProducts: JSON.stringify([]),
      },
      // Products for Kuliner Seafood Laiya (msmeIds[2])
      {
        name: "Kerupuk Ikan Laiya",
        price: 35000,
        image: "kerupuk-ikan-1.jpg",
        description: "Kerupuk ikan segar khas Pulau Laiya",
        material: "Ikan segar lokal",
        durability: "Best before 6 bulan",
        deliveryTime: "1 hari",
        msme_id: msmeIds[2],
        relatedProducts: JSON.stringify([]),
      },
      {
        name: "Sambal Terasi Laiya",
        price: 20000,
        image: "sambal-terasi-1.jpg",
        description: "Sambal terasi pedas dengan udang segar",
        material: "Udang lokal, cabai",
        durability: "Best before 3 bulan",
        deliveryTime: "Same day",
        msme_id: msmeIds[2],
        relatedProducts: JSON.stringify([]),
      },
      {
        name: "Dendeng Ikan Tongkol",
        price: 80000,
        image: "dendeng-tongkol-1.jpg",
        description: "Dendeng ikan tongkol asap tradisional",
        material: "Ikan tongkol segar",
        durability: "Best before 1 bulan",
        deliveryTime: "2-3 hari",
        msme_id: msmeIds[2],
        relatedProducts: JSON.stringify([]),
      },
    ];

    // Insert products
    for (const product of productsData) {
      await pool.execute(
        `INSERT INTO products (name, price, image, description, material, durability, delivery_time, msme_id, related_products) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.price,
          product.image,
          product.description,
          product.material,
          product.durability,
          product.deliveryTime,
          product.msme_id,
          product.relatedProducts,
        ]
      );
    }

    // Get contributor user ID
    const [contributorUser] = await pool.execute(
      'SELECT id FROM users WHERE role = "contributor" LIMIT 1'
    );
    const contributorUserId = contributorUser[0].id;

    // Create sample articles
    const articles = [
      {
        author_id: contributorUserId,
        title: "Waktu Terbaik Mengunjungi Pulau Laiya",
        slug: "waktu-terbaik-mengunjungi-pulau-laiya",
        excerpt:
          "Temukan waktu yang tepat untuk mengunjungi Pulau Laiya untuk cuaca dan pengalaman terbaik.",
        content:
          "Pulau Laiya indah sepanjang tahun, tetapi waktu terbaik untuk berkunjung adalah antara bulan April hingga Oktober ketika cuaca cerah dan laut tenang. Pada periode ini, Anda dapat menikmati aktivitas snorkeling, diving, dan berjemur di pantai dengan optimal.",
        category: "tips",
        featured_image:
          "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg",
        status: "published",
        is_featured: true,
      },
    ];

    for (const article of articles) {
      await pool.execute(
        `INSERT INTO articles (author_id, title, slug, excerpt, content, category, 
         featured_image, status, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.author_id,
          article.title,
          article.slug,
          article.excerpt,
          article.content,
          article.category,
          article.featured_image,
          article.status,
          article.is_featured,
        ]
      );
    }

    // Create sample testimonials
    const testimonials = [
      {
        name: "Sarah Johnson",
        email: "sarah@example.com",
        rating: 5,
        review: "Pengalaman yang luar biasa! Pulau ini adalah surga...",
        full_review:
          "Pengalaman yang luar biasa! Pulau ini adalah surga dengan air jernih dan penduduk lokal yang ramah. Pemandu wisata sangat berpengetahuan dan membuat perjalanan kami berkesan.",
        google_review_id: "google_123456",
        is_verified: true,
        is_featured: true,
      },
      {
        name: "Ahmad Rahman",
        email: "ahmad@example.com",
        rating: 5,
        review: "Tempat liburan keluarga yang sempurna...",
        full_review:
          "Tempat liburan keluarga yang sempurna dengan pantai yang indah dan snorkeling yang menakjubkan. Tur budaya sangat edukatif dan menyenangkan untuk anak-anak.",
        google_review_id: "google_789012",
        is_verified: true,
        is_featured: false,
      },
    ];

    for (const testimonial of testimonials) {
      await pool.execute(
        `INSERT INTO testimonials (name, email, rating, review, full_review, 
         google_review_id, is_verified, is_featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          testimonial.name,
          testimonial.email,
          testimonial.rating,
          testimonial.review,
          testimonial.full_review,
          testimonial.google_review_id,
          testimonial.is_verified,
          testimonial.is_featured,
        ]
      );
    }

    console.log("✅ Sample data created successfully!");
    console.log("\n📊 Data Summary:");
    console.log(`• ${users.length} Users created`);
    console.log(`• ${msmeData.length} MSMEs created`);
    console.log(`• ${productsData.length} Products created`);
    console.log(
      `• Sample destinations, packages, cultures, articles & testimonials created`
    );
    console.log("\n📋 Login credentials:");
    console.log("Superadmin: superadmin@laiya.com / demo123");
    console.log("Admin: admin@laiya.com / demo123");
    console.log("UMKM: umkm@laiya.com / demo123");
    console.log("Contributor: penulis@laiya.com / demo123");
    console.log("\n🏪 Sample MSMEs:");
    console.log(
      "• UD Laiya (3 products: Kerajinan Tempurung, Tas Pandan, Hiasan Bambu)"
    );
    console.log(
      "• Kerajinan Tangan Laiya (3 products: Tas Rotan, Tempat Pensil, Lampu Hias)"
    );
    console.log(
      "• Kuliner Seafood Laiya (3 products: Kerupuk Ikan, Sambal Terasi, Dendeng)"
    );
  } catch (error) {
    console.error("❌ Error creating sample data:", error);
  } finally {
    process.exit();
  }
}

// Run if called directly
if (require.main === module) {
  createSampleData();
}

module.exports = createSampleData;
