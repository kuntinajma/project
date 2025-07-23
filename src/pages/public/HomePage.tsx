import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const HomePage: React.FC = () => {
  const [stats, setStats] = useState({
    destinations: 0,
    packages: 0,
    umkm: 0,
    culture: 0,
  });

  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [featuredPackages, setFeaturedPackages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch featured destinations
      const destResponse = await axios.get(
        "http://localhost:3005/api/destinations?limit=3"
      );
      if (destResponse.data.success) {
        setFeaturedDestinations(
          destResponse.data.data.destinations.filter((d: any) => d.is_featured)
        );
        setStats((prev) => ({
          ...prev,
          destinations: destResponse.data.data.pagination.totalItems,
        }));
      }

      // Fetch featured packages
      const packResponse = await axios.get(
        "http://localhost:3005/api/packages?limit=3"
      );
      if (packResponse.data.success) {
        setFeaturedPackages(
          packResponse.data.data.packages.filter((p: any) => p.is_featured)
        );
        setStats((prev) => ({
          ...prev,
          packages: packResponse.data.data.pagination.totalItems,
        }));
      }

      // Fetch UMKM count
      const umkmResponse = await axios.get(
        "http://localhost:3005/api/umkm?limit=1"
      );
      if (umkmResponse.data.success) {
        setStats((prev) => ({
          ...prev,
          umkm: umkmResponse.data.data.pagination.totalItems,
        }));
      }

      // Fetch culture count
      const cultureResponse = await axios.get(
        "http://localhost:3005/api/culture?limit=1"
      );
      if (cultureResponse.data.success) {
        setStats((prev) => ({
          ...prev,
          culture: cultureResponse.data.data.pagination.totalItems,
        }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">
              Selamat Datang di{" "}
              <span className="text-yellow-400">Pulau Laiya</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl md:text-2xl">
              Destinasi wisata pulau eksotis dengan budaya lokal yang kaya di
              Desa Mattiro Labangeng, Sulawesi Selatan
            </p>
            <div className="flex flex-col gap-4 justify-center sm:flex-row">
              <Link
                to="/destinasi"
                className="px-8 py-3 font-semibold text-gray-900 bg-yellow-500 rounded-lg transition-colors hover:bg-yellow-400"
              >
                Jelajahi Destinasi
              </Link>
              <Link
                to="/paket-wisata"
                className="px-8 py-3 font-semibold text-white rounded-lg border-2 border-white transition-colors hover:bg-white hover:text-blue-800"
              >
                Lihat Paket Wisata
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-600">
                {stats.destinations}
              </div>
              <div className="text-gray-600">Destinasi Wisata</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-green-600">
                {stats.packages}
              </div>
              <div className="text-gray-600">Paket Wisata</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-purple-600">
                {stats.umkm}
              </div>
              <div className="text-gray-600">UMKM Lokal</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">
                {stats.culture}
              </div>
              <div className="text-gray-600">Budaya Tradisional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Destinasi Unggulan
            </h2>
            <p className="text-xl text-gray-600">
              Temukan keindahan alam dan budaya Pulau Laiya
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredDestinations.map((destination: any) => (
              <div
                key={destination.id}
                className="overflow-hidden bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl"
              >
                <img
                  src={
                    destination.image_url ||
                    "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg"
                  }
                  alt={destination.name}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {destination.name}
                  </h3>
                  <p className="mb-4 text-gray-600">
                    {destination.short_description}
                  </p>
                  <Link
                    to="/destinasi"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/destinasi"
              className="px-8 py-3 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
              Lihat Semua Destinasi
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Paket Wisata Populer
            </h2>
            <p className="text-xl text-gray-600">
              Nikmati pengalaman wisata yang tak terlupakan
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {featuredPackages.map((pkg: any) => (
              <div
                key={pkg.id}
                className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-lg transition-shadow hover:shadow-xl"
              >
                <img
                  src={
                    pkg.image_url ||
                    "https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg"
                  }
                  alt={pkg.name}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {pkg.name}
                  </h3>
                  <p className="mb-4 text-gray-600">{pkg.short_description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        Rp {pkg.price?.toLocaleString("id-ID")}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        / orang
                      </span>
                    </div>
                    <Link
                      to="/paket-wisata"
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/paket-wisata"
              className="px-8 py-3 text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
            >
              Lihat Semua Paket
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white bg-blue-600">
        <div className="px-4 mx-auto max-w-7xl text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Siap Menjelajahi Pulau Laiya?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Hubungi kami untuk informasi lebih lanjut dan booking paket wisata
          </p>
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Link
              to="/kontak"
              className="px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg transition-colors hover:bg-gray-100"
            >
              Hubungi Kami
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 font-semibold text-white bg-green-500 rounded-lg transition-colors hover:bg-green-600"
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
