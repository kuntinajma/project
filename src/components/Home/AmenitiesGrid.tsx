import React from 'react';
import { amenities } from '../../data/mockData';

const AmenitiesGrid: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fasilitas Pulau
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk menginap yang nyaman di Pulau Laiya
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {amenities.map((amenity) => (
            <div
              key={amenity.id}
              className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-3">
                {amenity.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {amenity.label}
              </h3>
              <p className="text-sm text-gray-600">
                {amenity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesGrid;