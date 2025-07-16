-- Laiya Tourism Database Schema
-- Created for KKN Kebangsaan XIII Project

-- Create database
CREATE DATABASE IF NOT EXISTS laiya_tourism CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE laiya_tourism;

-- Users table with role-based access
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin', 'msme', 'contributor') NOT NULL DEFAULT 'contributor',
    phone VARCHAR(20),
    avatar VARCHAR(500),
    university VARCHAR(255),
    major VARCHAR(255),
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active)
);

-- Destinations table
CREATE TABLE destinations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    description LONGTEXT NOT NULL,
    featured_image VARCHAR(500) NOT NULL,
    category ENUM('beaches', 'culture', 'nature', 'adventure') NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_published (is_published),
    INDEX idx_featured (is_featured),
    INDEX idx_slug (slug),
    FULLTEXT idx_search (title, short_description, description)
);

-- Destination gallery
CREATE TABLE destination_gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    destination_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    caption VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    INDEX idx_destination (destination_id),
    INDEX idx_sort (sort_order)
);

-- Tour packages table
CREATE TABLE tour_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description LONGTEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    min_persons INT NOT NULL DEFAULT 1,
    max_persons INT,
    featured_image VARCHAR(500) NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    whatsapp_contact VARCHAR(20) NOT NULL,
    booking_count INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_active (is_active),
    INDEX idx_popular (is_popular),
    INDEX idx_price (price),
    INDEX idx_slug (slug),
    FULLTEXT idx_search (name, description)
);

-- Tour package facilities
CREATE TABLE tour_package_facilities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_id INT NOT NULL,
    facility_name VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    
    FOREIGN KEY (package_id) REFERENCES tour_packages(id) ON DELETE CASCADE,
    INDEX idx_package (package_id)
);

-- MSME partners table
CREATE TABLE msme_partners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    description TEXT,
    address TEXT,
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    tiktok VARCHAR(255),
    shopee_url VARCHAR(500),
    tokopedia_url VARCHAR(500),
    logo VARCHAR(500),
    banner VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_products INT DEFAULT 0,
    total_sales DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_verified (is_verified),
    INDEX idx_active (is_active),
    FULLTEXT idx_search (business_name, description)
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    msme_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    discount_price DECIMAL(12, 2),
    sku VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    min_order INT DEFAULT 1,
    weight DECIMAL(8, 2),
    material VARCHAR(255),
    durability VARCHAR(255),
    delivery_time VARCHAR(100),
    featured_image VARCHAR(500) NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    sales_count INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (msme_id) REFERENCES msme_partners(id) ON DELETE CASCADE,
    INDEX idx_msme (msme_id),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price),
    INDEX idx_slug (slug),
    FULLTEXT idx_search (name, description, material)
);

-- Product gallery
CREATE TABLE product_gallery (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product (product_id),
    INDEX idx_sort (sort_order)
);

-- Articles table with categories and search optimization
CREATE TABLE articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    author_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    featured_image VARCHAR(500) NOT NULL,
    category ENUM('tips', 'tourism', 'culture', 'msmes', 'environment') NOT NULL,
    status ENUM('draft', 'pending', 'published', 'rejected') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    reading_time INT, -- in minutes
    meta_title VARCHAR(255),
    meta_description TEXT,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_author (author_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_published (published_at),
    INDEX idx_slug (slug),
    FULLTEXT idx_search (title, excerpt, content)
);

-- Article tags for better categorization
CREATE TABLE article_tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug)
);

-- Article tag relationships
CREATE TABLE article_tag_relations (
    article_id INT NOT NULL,
    tag_id INT NOT NULL,
    
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES article_tags(id) ON DELETE CASCADE
);

-- Testimonials from Google Maps reviews
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    google_review_id VARCHAR(255) UNIQUE,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_avatar VARCHAR(500),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    review_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    google_profile_url VARCHAR(500),
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_rating (rating),
    INDEX idx_featured (is_featured),
    INDEX idx_approved (is_approved),
    INDEX idx_date (review_date),
    FULLTEXT idx_search (reviewer_name, review_text)
);

-- Site settings for homepage, header, footer content
CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value LONGTEXT,
    setting_type ENUM('text', 'textarea', 'html', 'image', 'json') DEFAULT 'text',
    category ENUM('homepage', 'header', 'footer', 'general', 'seo') DEFAULT 'general',
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_key (setting_key),
    INDEX idx_category (category),
    INDEX idx_active (is_active)
);

-- Transportation information
CREATE TABLE transportation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('boat', 'ferry', 'speedboat') NOT NULL,
    phone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20),
    departure_times JSON, -- Store multiple departure times
    dock_location VARCHAR(255) NOT NULL,
    capacity INT,
    price_per_person DECIMAL(10, 2),
    duration VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_active (is_active)
);

-- Island amenities
CREATE TABLE amenities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100),
    description TEXT,
    category VARCHAR(100),
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_available (is_available),
    INDEX idx_sort (sort_order)
);

-- Activity logs for audit trail
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_table (table_name),
    INDEX idx_date (created_at)
);

-- Insert default superadmin user
INSERT INTO users (name, email, password, role, is_active, is_verified) VALUES 
('Super Admin', 'superadmin@laiya.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'superadmin', TRUE, TRUE);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_title', 'Website Wisata Pulau Laiya', 'text', 'general', 'Website title'),
('site_description', 'Permata Tersembunyi Sulawesi Selatan', 'text', 'general', 'Website description'),
('hero_title', 'Selamat Datang di Pulau Laiya', 'text', 'homepage', 'Hero section title'),
('hero_subtitle', 'Permata Tersembunyi Sulawesi Selatan', 'text', 'homepage', 'Hero section subtitle'),
('hero_description', 'Temukan pantai-pantai alami, terumbu karang yang hidup, dan budaya Indonesia yang autentik di surga tropis ini.', 'textarea', 'homepage', 'Hero section description'),
('contact_phone', '+62 812-3456-7890', 'text', 'footer', 'Contact phone number'),
('contact_email', 'info@pulaulaiya.com', 'text', 'footer', 'Contact email'),
('social_facebook', '#', 'text', 'footer', 'Facebook URL'),
('social_instagram', '#', 'text', 'footer', 'Instagram URL'),
('social_twitter', '#', 'text', 'footer', 'Twitter URL');