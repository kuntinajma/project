import React from 'react';
import { Filter } from 'lucide-react';

interface DestinationFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const DestinationFilter: React.FC<DestinationFilterProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Destinations', icon: '🌴' },
    { id: 'beaches', label: 'Beaches', icon: '🏖️' },
    { id: 'culture', label: 'Culture', icon: '🏛️' },
    { id: 'nature', label: 'Nature', icon: '🌿' },
    { id: 'adventure', label: 'Adventure', icon: '🏄' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <Filter size={20} className="text-orange-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Filter Destinations</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
              activeFilter === filter.id
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
            }`}
          >
            <span>{filter.icon}</span>
            <span className="font-medium">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DestinationFilter;