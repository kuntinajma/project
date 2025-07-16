import React from 'react';
import { MapPin, Calendar, Camera, ShoppingBag, BookOpen, Phone } from 'lucide-react';

interface QuickLinksProps {
  onNavigate: (page: string) => void;
}

const QuickLinks: React.FC<QuickLinksProps> = ({ onNavigate }) => {
  const quickLinks = [
    {
      id: 'destinations',
      title: 'Destinasi',
      description: 'Jelajahi pantai indah dan atraksi menarik',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'packages',
      title: 'Paket Wisata',
      description: 'Paket perjalanan lengkap untuk kunjungan Anda',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'culture',
      title: 'Budaya',
      description: 'Temukan tradisi dan adat istiadat lokal',
      icon: Camera,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'msme',
      title: 'Produk Lokal',
      description: 'Dukung bisnis lokal dan kerajinan',
      icon: ShoppingBag,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'articles',
      title: 'Artikel Wisata',
      description: 'Tips dan panduan untuk perjalanan Anda',
      icon: BookOpen,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      id: 'contact',
      title: 'Hubungi Kami',
      description: 'Hubungi untuk pertanyaan dan dukungan',
      icon: Phone,
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Akses Cepat
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk merencanakan liburan pulau yang sempurna
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${link.color} p-6`}>
                  <Icon size={32} className="text-white mx-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-gray-600">
                    {link.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;