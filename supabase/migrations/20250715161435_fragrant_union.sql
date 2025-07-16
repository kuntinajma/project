-- Database Schema for Pulau Laiya - Desa Wisata
-- Compatible with Dewaweb CPanel MySQL

-- Create database (run this manually in CPanel)
-- CREATE DATABASE pulau_laiya CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Admin users table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('super_admin', 'admin') DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  location VARCHAR(200),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url VARCHAR(500),
  gallery JSON,
  facilities JSON,
  opening_hours VARCHAR(100),
  ticket_price DECIMAL(10, 2) DEFAULT 0,
  category ENUM('pantai', 'budaya', 'alam', 'adventure') DEFAULT 'alam',
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tour packages table
CREATE TABLE IF NOT EXISTS tour_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(12, 2) NOT NULL,
  duration VARCHAR(50),
  max_participants INT DEFAULT 10,
  min_participants INT DEFAULT 2,
  includes JSON,
  excludes JSON,
  itinerary JSON,
  image_url VARCHAR(500),
  gallery JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- UMKM (Local Business) table
CREATE TABLE IF NOT EXISTS umkm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  business_name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  owner_name VARCHAR(100) NOT NULL,
  description TEXT,
  category ENUM('kerajinan', 'kuliner', 'fashion', 'souvenir', 'lainnya') DEFAULT 'kerajinan',
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  address TEXT,
  image_url VARCHAR(500),
  gallery JSON,
  products JSON,
  social_media JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Culture table
CREATE TABLE IF NOT EXISTS culture (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  category ENUM('tarian', 'musik', 'kuliner', 'adat', 'festival', 'kerajinan') DEFAULT 'adat',
  image_url VARCHAR(500),
  gallery JSON,
  video_url VARCHAR(500),
  history TEXT,
  significance TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  package_id INT,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  participants INT NOT NULL,
  booking_date DATE NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  special_requests TEXT,
  status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (package_id) REFERENCES tour_packages(id) ON DELETE SET NULL
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  admin_reply TEXT,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO admins (username, email, password, full_name, role) VALUES 
('admin', 'admin@pulaulaiya.com', '$2a$12$LQv3c1yqBWVHxkd0LQ4YCOdHrADFeKmVDbL6sPAeYjSO.eNOyDSch', 'Administrator', 'super_admin');

-- Insert default site settings
INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Pulau Laiya - Desa Wisata', 'text', 'Nama website'),
('site_description', 'Destinasi wisata pulau eksotis dengan budaya lokal yang kaya', 'text', 'Deskripsi website'),
('contact_phone', '+62 812-3456-7890', 'text', 'Nomor telepon kontak'),
('contact_email', 'info@pulaulaiya.com', 'text', 'Email kontak'),
('contact_address', 'Pulau Laiya, Sulawesi Selatan, Indonesia', 'text', 'Alamat lengkap'),
('whatsapp_number', '+6281234567890', 'text', 'Nomor WhatsApp untuk booking');

-- Sample data for destinations
INSERT IGNORE INTO destinations (name, slug, description, short_description, location, latitude, longitude, image_url, category, is_featured) VALUES
('Pantai Pasir Putih Laiya', 'pantai-pasir-putih-laiya', 'Pantai dengan pasir putih yang lembut dan air laut yang jernih. Tempat yang sempurna untuk bersantai dan menikmati matahari terbenam yang menakjubkan.', 'Pantai eksotis dengan pasir putih dan air jernih', 'Pulau Laiya, Sulawesi Selatan', -5.1234, 119.5678, 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg', 'pantai', TRUE),
('Desa Adat Mattiro Labangeng', 'desa-adat-mattiro-labangeng', 'Desa tradisional yang masih mempertahankan budaya dan adat istiadat Bugis. Pengunjung dapat melihat rumah-rumah tradisional dan berinteraksi dengan masyarakat lokal.', 'Desa tradisional dengan budaya Bugis yang autentik', 'Desa Mattiro Labangeng', -5.1200, 119.5650, 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg', 'budaya', TRUE),
('Taman Laut Karang Laiya', 'taman-laut-karang-laiya', 'Spot snorkeling dan diving terbaik dengan terumbu karang yang masih alami dan beragam biota laut. Cocok untuk pecinta underwater photography.', 'Surga bawah laut dengan terumbu karang yang indah', 'Perairan Pulau Laiya', -5.1300, 119.5700, 'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg', 'alam', FALSE);

-- Sample data for tour packages
INSERT IGNORE INTO tour_packages (name, slug, description, short_description, price, duration, max_participants, includes, is_featured) VALUES
('Paket Island Hopping Laiya', 'paket-island-hopping-laiya', 'Jelajahi keindahan Pulau Laiya dan pulau-pulau kecil di sekitarnya. Nikmati snorkeling, berenang, dan makan siang di pantai.', 'Eksplorasi pulau-pulau eksotis dengan aktivitas snorkeling', 750000, '1 Hari (8 jam)', 15, '["Transportasi kapal", "Peralatan snorkeling", "Makan siang", "Pemandu wisata", "Dokumentasi"]', TRUE),
('Paket Wisata Budaya Desa', 'paket-wisata-budaya-desa', 'Rasakan pengalaman budaya autentik di Desa Mattiro Labangeng. Belajar tentang tradisi, kerajinan lokal, dan kuliner khas.', 'Pengalaman budaya mendalam dengan masyarakat lokal', 500000, '6 jam', 20, '["Tur desa", "Workshop kerajinan", "Makan tradisional", "Pertunjukan budaya", "Pemandu lokal"]', TRUE);

-- Sample data for UMKM
INSERT IGNORE INTO umkm (business_name, slug, owner_name, description, category, phone, whatsapp, products, is_featured) VALUES
('Kerajinan Anyaman Laiya', 'kerajinan-anyaman-laiya', 'Ibu Siti Aminah', 'Usaha kerajinan anyaman dari pandan dan bambu yang dibuat dengan teknik tradisional turun temurun.', 'kerajinan', '081234567890', '6281234567890', '["Tas anyaman pandan", "Topi tradisional", "Tempat nasi bambu", "Souvenir anyaman"]', TRUE),
('Kuliner Ikan Bakar Pak Usman', 'kuliner-ikan-bakar-pak-usman', 'Pak Usman', 'Warung ikan bakar dengan cita rasa khas Sulawesi. Menggunakan ikan segar hasil tangkapan nelayan lokal.', 'kuliner', '081234567891', '6281234567891', '["Ikan bakar khas Sulawesi", "Sup ikan segar", "Nasi kelapa", "Sambal dabu-dabu"]', TRUE);

-- Sample data for culture
INSERT IGNORE INTO culture (title, slug, description, short_description, category, is_featured) VALUES
('Tari Saman Laiya', 'tari-saman-laiya', 'Tarian tradisional yang dipentaskan dalam acara-acara adat dan penyambutan tamu. Tarian ini menggambarkan kebersamaan dan kekompakan masyarakat.', 'Tarian tradisional yang menggambarkan kebersamaan', 'tarian', TRUE),
('Kuliner Khas Coto Laiya', 'kuliner-khas-coto-laiya', 'Makanan tradisional berupa sup daging dengan kuah santan dan rempah-rempah khas. Disajikan dengan ketupat dan sambal.', 'Sup daging tradisional dengan kuah santan dan rempah', 'kuliner', TRUE);