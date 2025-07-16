import React from 'react';
import { MapPin, Eye } from 'lucide-react';
import { Destination } from '../../types';

interface DestinationCardProps {
  destination: Destination;
  onViewDetails: (destination: Destination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onViewDetails }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beaches': return 'bg-blue-500';
      case 'culture': return 'bg-purple-500';
      case 'nature': return 'bg-green-500';
      case 'adventure': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={destination.image}
          alt={destination.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(destination.category)}`}>
            {destination.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <MapPin size={16} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              {destination.location.lat.toFixed(4)}, {destination.location.lng.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {destination.title}
        </h3>
        <p className="text-gray-600 mb-4">
          {destination.shortDescription}
        </p>
        
        <button
          onClick={() => onViewDetails(destination)}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
        >
          <Eye size={16} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;