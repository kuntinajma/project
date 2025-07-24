-- Transportation table
CREATE TABLE IF NOT EXISTS transportation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  departure_time VARCHAR(100) NULL,
  dock_location VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample transportation data
INSERT INTO transportation (name, phone, departure_time, dock_location) VALUES
('Laiya Express', '+6281234567890', '08:00, 14:00', 'Pelabuhan Bulukumba'),
('Island Hopper', '+6281234567891', '09:00, 15:00', 'Pelabuhan Bulukumba'),
('Ocean Rider', '+6281234567892', '10:00, 16:00', 'Pelabuhan Bulukumba')
ON DUPLICATE KEY UPDATE 
  name = VALUES(name), 
  phone = VALUES(phone), 
  departure_time = VALUES(departure_time), 
  dock_location = VALUES(dock_location); 