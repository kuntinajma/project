-- ARTICLES
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt TEXT NULL,
  category VARCHAR(255) NOT NULL,
  featured_image VARCHAR(255) NULL,
  status ENUM('draft', 'pending', 'published', 'rejected') DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  tags TEXT NULL, -- JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SETTINGS
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(category, `key`)
);

-- FACILITIES
CREATE TABLE IF NOT EXISTS facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(10) NOT NULL,
  label VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  is_available BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- INSERT DEFAULT SETTINGS
INSERT IGNORE INTO settings (category, `key`, value) VALUES
  ('general', 'island_name', 'Pulau Laiya'),
  ('general', 'village_name', 'Desa Mattiro Labangeng'),
  ('general', 'description', 'Pulau Laiya adalah destinasi wisata eksotis dengan budaya lokal yang kaya di Desa Mattiro Labangeng, Sulawesi Selatan.'),
  ('general', 'welcome_message', 'Selamat datang di Pulau Laiya, permata tersembunyi Sulawesi Selatan dengan keindahan alam dan budaya yang memukau.'),
  ('contact', 'address', 'Pulau Laiya, Desa Mattiro Labangeng, Kecamatan Liukang Tupabbiring, Kabupaten Pangkep, Sulawesi Selatan'),
  ('contact', 'phone', '+62 812-3456-7890'),
  ('contact', 'whatsapp', '+62 812-3456-7890'),
  ('contact', 'email', 'info@pulaulaiya.com'),
  ('contact', 'maps_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...'),
  ('contact', 'latitude', '-5.1234'),
  ('contact', 'longitude', '119.5678'),
  ('media', 'hero_video_url', 'https://www.youtube.com/watch?v=Gh0K71uxucM'),
  ('media', 'main_logo', ''),
  ('media', 'hero_background', ''),
  ('media', 'gallery', '[]'),
  ('social', 'tiktok', 'https://tiktok.com/@pulaulaiya'),
  ('social', 'instagram', 'https://instagram.com/pulaulaiya'),
  ('social', 'youtube', 'https://youtube.com/@pulaulaiya'),
  ('social', 'twitter', 'https://twitter.com/pulaulaiya');

-- INSERT DEFAULT FACILITIES
INSERT IGNORE INTO facilities (icon, label, description, is_available) VALUES
  ('🚿', 'Kamar Mandi', 'Fasilitas kamar mandi yang bersih', 1),
  ('📶', 'Wi-Fi', 'Akses internet nirkabel gratis', 1),
  ('⚡', 'Listrik', 'Pasokan listrik 24 jam', 1),
  ('🏪', 'Toko', 'Toko dan pasar lokal', 1),
  ('🏥', 'Medis', 'Fasilitas medis dasar', 0),
  ('🍽️', 'Restoran', 'Masakan lokal dan internasional', 1);

-- DESTINATIONS
CREATE TABLE IF NOT EXISTS destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description VARCHAR(255) NOT NULL,
  description TEXT NULL,
  category VARCHAR(255) NOT NULL,
  image VARCHAR(255) NULL,
  latitude  DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL,
  gallery TEXT NULL, -- JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TOUR PACKAGES
CREATE TABLE IF NOT EXISTS tour_packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  price FLOAT NULL,
  duration VARCHAR(255) NULL,
  min_persons INT,
  max_persons INT,
  whatsapp_contact VARCHAR(20) NULL,
  whatsapp_booking_url VARCHAR(500) NULL,
  facilities TEXT NULL, -- JSON array
  image VARCHAR(255) NULL,
  popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CULTURES
CREATE TABLE IF NOT EXISTS cultures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NULL,
  image VARCHAR(255) NULL,
  category VARCHAR(255),
  gallery TEXT NULL, -- JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);