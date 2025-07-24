-- Settings table for website configuration
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  `key` VARCHAR(100) NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(category, `key`)
);

-- Facilities table for island amenities
CREATE TABLE IF NOT EXISTS facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(10) NOT NULL,
  label VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
-- General settings
INSERT INTO settings (category, `key`, value) VALUES
('general', 'island_name', 'Pulau Laiya'),
('general', 'village_name', 'Desa Mattiro Labangeng'),
('general', 'description', 'Pulau Laiya adalah destinasi wisata eksotis dengan budaya lokal yang kaya di Desa Mattiro Labangeng, Sulawesi Selatan.'),
('general', 'welcome_message', 'Selamat datang di Pulau Laiya, permata tersembunyi Sulawesi Selatan dengan keindahan alam dan budaya yang memukau.')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Contact settings
INSERT INTO settings (category, `key`, value) VALUES
('contact', 'address', 'Pulau Laiya, Desa Mattiro Labangeng, Kecamatan Liukang Tupabbiring, Kabupaten Pangkep, Sulawesi Selatan'),
('contact', 'phone', '+62 812-3456-7890'),
('contact', 'whatsapp', '+62 812-3456-7890'),
('contact', 'email', 'info@pulaulaiya.com'),
('contact', 'maps_embed_url', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d...'),
('contact', 'latitude', '-5.1234'),
('contact', 'longitude', '119.5678')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Media settings
INSERT INTO settings (category, `key`, value) VALUES
('media', 'hero_video_url', 'https://www.youtube.com/watch?v=Gh0K71uxucM'),
('media', 'main_logo', ''),
('media', 'hero_background', ''),
('media', 'gallery', '[]')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Social media settings
INSERT INTO settings (category, `key`, value) VALUES
('social', 'tiktok', 'https://tiktok.com/@pulaulaiya'),
('social', 'instagram', 'https://instagram.com/pulaulaiya'),
('social', 'youtube', 'https://youtube.com/@pulaulaiya'),
('social', 'twitter', 'https://twitter.com/pulaulaiya')
ON DUPLICATE KEY UPDATE value = VALUES(value);

-- Insert default facilities
INSERT INTO facilities (icon, label, description, is_available) VALUES
('🚿', 'Kamar Mandi', 'Fasilitas kamar mandi yang bersih', TRUE),
('📶', 'Wi-Fi', 'Akses internet nirkabel gratis', TRUE),
('⚡', 'Listrik', 'Pasokan listrik 24 jam', TRUE),
('🏪', 'Toko', 'Toko dan pasar lokal', TRUE),
('🏥', 'Medis', 'Fasilitas medis dasar', FALSE),
('🍽️', 'Restoran', 'Masakan lokal dan internasional', TRUE)
ON DUPLICATE KEY UPDATE icon = VALUES(icon), label = VALUES(label), description = VALUES(description), is_available = VALUES(is_available); 