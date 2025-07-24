import React, { useState, useEffect, useMemo } from 'react';
import { useSettings, Facility } from '../../hooks/useSettings';
import { GeneralSettings } from '../../hooks/useSettings';

// Cache for facilities to prevent repeated API calls
let facilitiesCache: Facility[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const AmenitiesGrid: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    island_name: 'Pulau Laiya',
    village_name: 'Desa Mattiro Labangeng',
    description: '',
    welcome_message: ''
  });
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const { getAllFacilities } = useSettings();

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        // Check if cache is valid
        const isCacheValid = facilitiesCache.length > 0 && 
                            Date.now() - cacheTimestamp < CACHE_DURATION;

        if (isCacheValid) {
          setFacilities(facilitiesCache);
          setLoading(false);
          return;
        }

        // Fetch facilities
        const data = await getAllFacilities();
        if (data) {
          // Filter only available facilities
          const availableFacilities = data.filter(facility => facility.available);
          setFacilities(availableFacilities);
          
          // Update cache
          facilitiesCache = availableFacilities;
          cacheTimestamp = Date.now();
        }
      } catch (error) {
        console.error('Error loading facilities:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFacilities();
  }, [getAllFacilities]);

  // Precompute styles for each facility to prevent recomputation
  const facilityStyles = useMemo(() => {
    return facilities.map(() => ({
      background: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to))`,
    }));
  }, [facilities.length]);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Fasilitas Pulau
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Semua yang Anda butuhkan untuk menginap yang nyaman {generalSettings.island_name}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : facilities.length === 0 ? (
          <div className="text-center text-gray-500">
            Tidak ada fasilitas yang tersedia saat ini
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {facilities.map((facility, index) => (
              <div
                key={facility.id}
                className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">
                  {facility.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {facility.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {facility.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AmenitiesGrid;