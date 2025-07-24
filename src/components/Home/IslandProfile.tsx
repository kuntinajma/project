import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Users, Clock } from 'lucide-react';
import { useSettings, GeneralSettings, ContactSettings, IslandProfileSettings } from '../../hooks/useSettings';

// Cache for settings to prevent repeated API calls
let settingsCache: {
  general?: GeneralSettings;
  contact?: ContactSettings;
  island_profile?: IslandProfileSettings;
} = {};
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const IslandProfile: React.FC = () => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    island_name: 'Pulau Laiya',
    village_name: 'Desa Mattiro Labangeng',
    description: '',
    welcome_message: ''
  });
  
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    maps_embed_url: '',
    latitude: '',
    longitude: ''
  });

  const [profileSettings, setProfileSettings] = useState<IslandProfileSettings>({
    community_values: 'Pulau ini adalah rumah bagi Desa Mattiro Labangeng, tempat budaya Bugis tradisional berkembang. Nilai-nilai komunitas seperti saling menghormati, konservasi lingkungan, dan pelestarian budaya telah membentuk pulau ini menjadi destinasi wisata yang berkelanjutan.',
    history_description: 'Dengan sejarah yang membentang berabad-abad, pulau ini telah menjadi komunitas nelayan vital yang menyambut pengunjung untuk merasakan cara hidup mereka, dari teknik penangkapan ikan tradisional hingga pengalaman kuliner yang autentik.',
    location: 'Sulawesi Selatan',
    population: '~500 Penduduk',
    best_time: 'Sepanjang Tahun'
  });
  
  const [loading, setLoading] = useState(true);
  const { getSettingsByCategory } = useSettings();
  
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Check if cache is valid
        const isCacheValid = settingsCache.general && 
                            settingsCache.contact &&
                            settingsCache.island_profile &&
                            Date.now() - cacheTimestamp < CACHE_DURATION;

        let generalData = settingsCache.general;
        let contactData = settingsCache.contact;
        let profileData = settingsCache.island_profile;

        if (!isCacheValid) {
          // Fetch data concurrently
          const [newGeneralData, newContactData, newProfileData] = await Promise.all([
            getSettingsByCategory<GeneralSettings>('general'),
            getSettingsByCategory<ContactSettings>('contact'),
            getSettingsByCategory<IslandProfileSettings>('island_profile')
          ]);
          
          // Update cache with non-null values
          if (newGeneralData) generalData = newGeneralData;
          if (newContactData) contactData = newContactData;
          if (newProfileData) profileData = newProfileData;
          
          // Update cache
          settingsCache = {
            general: generalData,
            contact: contactData,
            island_profile: profileData
          };
          cacheTimestamp = Date.now();
        }
        
        if (generalData) {
          setGeneralSettings(generalData);
        }
        
        if (contactData) {
          setContactSettings(contactData);
        }

        if (profileData) {
          setProfileSettings(profileData);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  // Formatted description - memoized to prevent recalculations
  const description = useMemo(() => {
    return generalSettings.description || 
      `${generalSettings.island_name} adalah surga tropis yang masih alami yang terletak di perairan biru Sulawesi Selatan. 
      Permata tersembunyi ini menawarkan pengunjung pengalaman pulau Indonesia yang autentik dengan 
      pantai-pantai yang belum tersentuh, terumbu karang yang hidup, dan warisan budaya yang kaya.`;
  }, [generalSettings.description, generalSettings.island_name]);

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Temukan {generalSettings.island_name} & {generalSettings.village_name}
              </h2>
              <div className="space-y-4 text-gray-700">
                <p className="text-lg">
                  {description}
                </p>
                <p>
                  {profileSettings.community_values}
                </p>
                <p>
                  {profileSettings.history_description}
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                    <MapPin className="text-blue-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Lokasi</h3>
                  <p className="text-sm text-gray-600">{profileSettings.location}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                    <Users className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Populasi</h3>
                  <p className="text-sm text-gray-600">{profileSettings.population}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                    <Clock className="text-orange-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-900">Waktu Terbaik</h3>
                  <p className="text-sm text-gray-600">{profileSettings.best_time}</p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt={generalSettings.village_name}
                className="rounded-lg shadow-xl w-full h-96 object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-semibold text-gray-900">Kehidupan Desa Tradisional</p>
                <p className="text-xs text-gray-600">{generalSettings.village_name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default IslandProfile;