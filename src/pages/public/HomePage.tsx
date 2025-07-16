import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState({
    destinations: 0,
    packages: 0,
    umkm: 0,
    culture: 0
  });

  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured destinations
      const destResponse = await axios.get('http://localhost:5000/api/destinations?limit=3');
      if (destResponse.data.success) {
        setFeaturedDestinations(destResponse.data.data.destinations.filter((d: any) => d.is_featured));
        setStats(prev => ({ ...prev, destinations: destResponse.data.data.pagination.totalItems }));
      }

      // Fetch featured packages
      const packResponse = await axios.get('http://localhost:5000/api/packages?limit=3');
      if (packResponse.data.success) {
        setFeaturedPackages(packResponse.data.data.packages.filter((p: any) => p.is_featured));
        setStats(prev => ({ ...prev, packages: packResponse.data.data.pagination.totalItems }));
      }

      // Fetch UMKM count
      const umkmResponse = await axios.get('http://localhost:5000/api/umkm?limit=1');
      if (umkmResponse.data.success) {
        setStats(prev => ({ ...prev, umkm: umkmResponse.data.data.pagination.totalItems }));
      }

      // Fetch culture count
      const cultureResponse = await axios.get('http://localhost:5000/api/culture?limit=1');
      if (cultureResponse.data.success) {
        setStats(prev => ({ ...prev, culture: cultureResponse.data.data.pagination.totalItems }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang di <span className="text-yellow-400">Pulau Laiya</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Destinasi wisata pulau eksotis dengan budaya lokal yang kaya di Desa Mattiro Labangeng, Sulawesi Selatan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/destinasi"
                className="bg-yellow-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Jelajahi Destinasi
              </Link>
              <Link
                to="/paket-wisata"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-800 transition-colors"
              >
                Lihat Paket Wisata
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.destinations}</div>
              <div className="text-gray-600">Destinasi Wisata</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.packages}</div>
              <div className="text-gray-600">Paket Wisata</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{stats.umkm}</div>
              <div className="text-gray-600">UMKM Lokal</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{stats.culture}</div>
              <div className="text-gray-600">Budaya Tradisional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Destinasi Unggulan
            </h2>
            <p className="text-xl text-gray-600">
              Temukan keindahan alam dan budaya Pulau Laiya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredDestinations.map((destination: any) => (
              <div key={destination.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={destination.image_url || 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg'}
                  alt={destination.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {destination.short_description}
                  </p>
                  <Link
                    to="/destinasi"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/destinasi"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Destinasi
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paket Wisata Populer
            </h2>
            <p className="text-xl text-gray-600">
              Nikmati pengalaman wisata yang tak terlupakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPackages.map((pkg: any) => (
              <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={pkg.image_url || 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg'}
                  alt={pkg.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {pkg.short_description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        Rp {pkg.price?.toLocaleString('id-ID')}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">/ orang</span>
                    </div>
                    <Link
                      to="/paket-wisata"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/paket-wisata"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Lihat Semua Paket
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Menjelajahi Pulau Laiya?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hubungi kami untuk informasi lebih lanjut dan booking paket wisata
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/kontak"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Hubungi Kami
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;