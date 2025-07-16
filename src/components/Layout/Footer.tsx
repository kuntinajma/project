import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Pulau Laiya</h3>
            <p className="text-gray-300 mb-4">
              Temukan surga tersembunyi Pulau Laiya di Sulawesi Selatan. Rasakan pantai-pantai alami, 
              budaya yang kaya, dan keramahan yang hangat di permata tropis ini.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Destinasi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Paket Wisata</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Budaya</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">UMKM</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Artikel</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Info Kontak</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-orange-400" />
                <span className="text-gray-300 text-sm">Laiya Island, South Sulawesi</span>
                <span className="text-gray-300 text-sm">Pulau Laiya, Sulawesi Selatan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-orange-400" />
                <span className="text-gray-300 text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-orange-400" />
                <span className="text-gray-300 text-sm">info@pulaulaiya.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Wisata Pulau Laiya. Hak cipta dilindungi. | 
            <span className="text-orange-400"> Tim KKN Kebangsaan XIII</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;