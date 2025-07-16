import React, { useState } from 'react';
import { ArrowLeft, MapPin, Camera, Star } from 'lucide-react';
import { destinations } from '../data/mockData';
import { Destination } from '../types';
import DestinationCard from '../components/Destinations/DestinationCard';
import DestinationFilter from '../components/Destinations/DestinationFilter';

interface DestinationsPageProps {
  onNavigate: (page: string) => void;
}

const DestinationsPage: React.FC<DestinationsPageProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const filteredDestinations = destinations.filter(dest => 
    activeFilter === 'all' || dest.category === activeFilter
  );

  const handleViewDetails = (destination: Destination) => {
    setSelectedDestination(destination);
  };

  const handleBackToList = () => {
    setSelectedDestination(null);
  };

  if (selectedDestination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Destinations</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                {selectedDestination.gallery.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedDestination.title} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {selectedDestination.title}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {selectedDestination.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm text-gray-600">4.8 (124 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedDestination.description}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="text-orange-600" size={20} />
                  <span className="text-gray-700">
                    {selectedDestination.location.lat.toFixed(4)}, {selectedDestination.location.lng.toFixed(4)}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-600">Interactive Map Coming Soon</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                  <Camera size={20} />
                  <span>View Gallery</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  <MapPin size={20} />
                  <span>Get Directions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Laiya Island
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From pristine beaches to cultural treasures, explore the diverse attractions 
            that make Laiya Island a unique destination in South Sulawesi.
          </p>
        </div>

        <DestinationFilter 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No destinations found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;