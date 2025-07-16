import React from 'react';
import { MapPin, Users, Clock } from 'lucide-react';

const IslandProfile: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Temukan Pulau Laiya & Desa Mattiro Labangeng
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="text-lg">
                Pulau Laiya adalah surga tropis yang masih alami yang terletak di perairan biru Sulawesi Selatan. 
                Permata tersembunyi ini menawarkan pengunjung pengalaman pulau Indonesia yang autentik dengan 
                pantai-pantai yang belum tersentuh, terumbu karang yang hidup, dan warisan budaya yang kaya.
              </p>
              <p>
                Pulau ini adalah rumah bagi Desa Mattiro Labangeng, tempat budaya Bugis tradisional berkembang. 
                Nilai-nilai komunitas seperti saling menghormati, konservasi lingkungan, dan pelestarian budaya 
                telah membentuk pulau ini menjadi destinasi wisata yang berkelanjutan.
              </p>
              <p>
                Dengan sejarah yang membentang berabad-abad, pulau ini telah menjadi komunitas nelayan vital yang 
                menyambut pengunjung untuk merasakan cara hidup mereka, dari teknik penangkapan ikan tradisional 
                hingga pengalaman kuliner yang autentik.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">Lokasi</h3>
                <p className="text-sm text-gray-600">Sulawesi Selatan</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                  <Users className="text-green-600" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">Populasi</h3>
                <p className="text-sm text-gray-600">~500 Penduduk</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                  <Clock className="text-orange-600" size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">Waktu Terbaik</h3>
                <p className="text-sm text-gray-600">Sepanjang Tahun</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Desa Mattiro Labangeng"
              className="rounded-lg shadow-xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-sm font-semibold text-gray-900">Kehidupan Desa Tradisional</p>
              <p className="text-xs text-gray-600">Mattiro Labangeng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IslandProfile;