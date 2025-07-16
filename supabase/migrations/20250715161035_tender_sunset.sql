-- Laiya Tourism MySQL Database Schema
-- Created for KKN Kebangsaan XIII - Pulau Laiya Project

-- Create database (run this first)
-- CREATE DATABASE laiya_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE laiya_tourism;

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('superadmin', 'admin', 'msme', 'contributor', 'traveler') DEFAULT 'contributor',
  phone VARCHAR(20),
  avatar VARCHAR(255),
  university VARCHAR(255),
  major VARCHAR(255),
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_active (is_active)
);

-- Destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT,
  description LONGTEXT,
  category ENUM('beaches', 'culture', 'nature', 'adventure') NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  featured_image VARCHAR(255),
  gallery JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  view_count INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_featured (is_featured),
  INDEX idx_published (is_published),
  INDEX idx_slug (slug)
);

-- Tour packages table
CREATE TABLE IF NOT EXISTS tour_packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description LONGTEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration VARCHAR(100),
  min_persons INT DEFAULT 1,
  max_persons INT,
  whatsapp_contact VARCHAR(20),
  featured_image VARCHAR(255),
  gallery JSON,
  facilities JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  booking_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (is_active),
  INDEX idx_featured (is_featured),
  INDEX idx_price (price)
);

-- MSME Partners table
CREATE TABLE IF NOT EXISTS msme_partners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  description TEXT,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  instagram VARCHAR(100),
  facebook VARCHAR(100),
  tiktok VARCHAR(100),
  shopee_link VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  msme_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description LONGTEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT DEFAULT 0,
  min_order INT DEFAULT 1,
  material VARCHAR(255),
  durability VARCHAR(255),
  delivery_time VARCHAR(100),
  featured_image VARCHAR(255),
  gallery JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sales_count INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (msme_id) REFERENCES msme_partners(id) ON DELETE CASCADE,
  INDEX idx_msme (msme_id),
  INDEX idx_active (is_active),
  INDEX idx_featured (is_featured),
  INDEX idx_price (price)
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  author_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  category ENUM('tips', 'tourism', 'culture', 'msmes', 'environment') NOT NULL,
  featured_image VARCHAR(255),
  status ENUM('draft', 'pending', 'published', 'rejected') DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description TEXT,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_author (author_id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_featured (is_featured),
  INDEX idx_slug (slug),
  FULLTEXT(title, excerpt, content)
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  full_review LONGTEXT,
  google_review_id VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rating (rating),
  INDEX idx_verified (is_verified),
  INDEX idx_featured (is_featured)
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value LONGTEXT,
  setting_type ENUM('text', 'number', 'boolean', 'json') DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key)
);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Wisata Pulau Laiya', 'text', 'Website name'),
('site_description', 'Temukan surga tersembunyi Pulau Laiya di Sulawesi Selatan', 'text', 'Website description'),
('contact_email', 'info@pulaulaiya.com', 'text', 'Contact email'),
('contact_phone', '+62 812-3456-7890', 'text', 'Contact phone'),
('social_facebook', 'https://facebook.com/pulaulaiya', 'text', 'Facebook URL'),
('social_instagram', 'https://instagram.com/pulaulaiya', 'text', 'Instagram URL'),
('social_twitter', 'https://twitter.com/pulaulaiya', 'text', 'Twitter URL')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);