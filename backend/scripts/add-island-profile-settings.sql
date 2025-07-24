-- Add new settings for island profile
INSERT INTO settings (category, `key`, value) VALUES
-- Island profile highlighted text
('island_profile', 'community_values', 'Pulau ini adalah rumah bagi Desa Mattiro Labangengo, tempat budaya Bugis tradisional berkembang. Nilai-nilai komunitas seperti saling menghormati, konservasi lingkungan, dan pelestarian budaya telah membentuk pulau ini menjadi destinasi wisata yang berkelanjutan.'),
('island_profile', 'history_description', 'Dengan sejarah yang membentang berabad-abad, pulau ini telah menjadi komunitas nelayan vital yang menyambut pengunjung untuk merasakan cara hidup mereka, dari teknik penangkapan ikan tradisional hingga pengalaman kuliner yang autentik.'),

-- Island profile stats
('island_profile', 'location', 'Sulawesi Selatan'),
('island_profile', 'population', '~500 Penduduk'),
('island_profile', 'best_time', 'Sepanjang Tahun')

ON DUPLICATE KEY UPDATE value = VALUES(value); 