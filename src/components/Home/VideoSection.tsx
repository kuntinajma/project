import React from 'react';
import { Play } from 'lucide-react';

const VideoSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section - Left Side */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Selamat Datang di <span className="text-orange-600">Pulau Laiya</span>
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Permata Tersembunyi Sulawesi Selatan
              </p>
              <p className="text-gray-700 leading-relaxed">
                Temukan pantai-pantai alami, terumbu karang yang hidup, dan budaya Indonesia yang autentik 
                di surga tropis ini. Rasakan kehangatan Desa Mattiro Labangeng 
                dan ciptakan kenangan tak terlupakan di perairan yang jernih.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold">
                Jelajahi Destinasi
              </button>
              <a 
                href="https://www.youtube.com/watch?v=Gh0K71uxucM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors font-semibold text-center"
              >
                Tonton Video
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">50+</div>
                <div className="text-sm text-gray-600">Atraksi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1000+</div>
                <div className="text-sm text-gray-600">Pengunjung Senang</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">24/7</div>
                <div className="text-sm text-gray-600">Dukungan</div>
              </div>
            </div>
          </div>

          {/* Video Container - Right Side */}
          <div className="w-full">
            <div className="relative w-full rounded-lg overflow-hidden shadow-xl" style={{ aspectRatio: '16/9' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/Gh0K71uxucM?controls=1&modestbranding=1&rel=0&autoplay=0"
                title="Video Wisata Pulau Laiya - HasbiTubeHD"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
