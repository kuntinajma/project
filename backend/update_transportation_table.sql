 -- Check if transportation table exists, if not create it
CREATE TABLE IF NOT EXISTS transportation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  departure_time VARCHAR(255) NOT NULL,
  dock_location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add new columns one by one with error handling for each
-- MySQL doesn't support IF NOT EXISTS for ADD COLUMN

-- Add type column if it doesn't exist
ALTER TABLE transportation 
  ADD COLUMN type ENUM('speedboat', 'boat', 'ferry') NOT NULL DEFAULT 'boat';

-- Add whatsapp column if it doesn't exist
ALTER TABLE transportation 
  ADD COLUMN whatsapp VARCHAR(50) NULL;

-- Add capacity column if it doesn't exist
ALTER TABLE transportation 
  ADD COLUMN capacity INT NULL;

-- Add price_per_person column if it doesn't exist
ALTER TABLE transportation 
  ADD COLUMN price_per_person DECIMAL(12,2) NULL;

-- Add duration column if it doesn't exist
ALTER TABLE transportation 
  ADD COLUMN duration VARCHAR(100) NOT NULL DEFAULT '45 minutes';

-- Add status column if it doesn't exist
ALTER TABLE transportation 
  ADD COLUMN status ENUM('active', 'inactive') NOT NULL DEFAULT 'active';

-- Add notes column if it doesn't exist
ALTER TABLE transportation 
  ADD COLUMN notes TEXT NULL;

-- Update existing records to have valid type values
UPDATE transportation SET type = 'boat' WHERE type IS NULL;