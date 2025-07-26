import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Pulau Laiya</h3>
            <p className="text-gray-300 mb-4">
              Destinasi wisata pulau eksotis dengan budaya lokal yang kaya. 
              Temukan keindahan alam dan kearifan tradisional di Pulau Laiya.
            </p>
            <div className="flex space-x-4">
              <a href="https://wa.me/6287872426078?text=Halo%2C%20saya%20mendapatkan%20kontak%20ini%20dari%20web%20Pulau%20Laiya.%20Saya%20ingin%20bertanya..." className="text-gray-300 hover:text-orange-400 transition-colors">
                WhatsApp
              </a>
              <a href="https://www.instagram.com/pulaulaiya/" className="text-gray-300 hover:text-orange-400 transition-colors">
                Instagram
              </a>
              <a href="https://www.youtube.com/@Laiya.aisland" className="text-gray-300 hover:text-orange-400 transition-colors">
                YouTube
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li><Link to="/destinasi" className="text-gray-300 hover:text-orange-400 transition-colors">Destinasi</Link></li>
              <li><Link to="/paket-wisata" className="text-gray-300 hover:text-orange-400 transition-colors">Paket Wisata</Link></li>
              <li><Link to="/umkm" className="text-gray-300 hover:text-orange-400 transition-colors">UMKM</Link></li>
              <li><Link to="/budaya" className="text-gray-300 hover:text-orange-400 transition-colors">Budaya</Link></li>
              <li><Link to="/artikel" className="text-gray-300 hover:text-orange-400 transition-colors">Artikel</Link></li>
              <li><Link to="/kontak" className="text-gray-300 hover:text-orange-400 transition-colors">Kontak</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <div className="space-y-2 text-gray-300">
              <p>📍 Pulau Laiya, Kabuptaen Pangkep, Sulawesi Selatan</p>
              <p>📞 +62 878-7242-6078</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            <p>Developed by KKN Kebangsaan XIII Posko Pulau Laiya</p>
            ©2025 Pulau Laiya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;