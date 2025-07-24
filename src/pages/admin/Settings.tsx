import React, { useState, useEffect } from 'react';
import { 
  CogIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import Toast from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';
import { useSettings, Facility, GeneralSettings, ContactSettings, MediaSettings, SocialSettings, IslandProfileSettings } from '../../hooks/useSettings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [newFacility, setNewFacility] = useState<Omit<Facility, 'id'>>({ 
    icon: '', 
    label: '', 
    description: null,
    available: true 
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  // Settings state
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    island_name: '',
    village_name: '',
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
  
  const [mediaSettings, setMediaSettings] = useState<MediaSettings>({
    hero_video_url: '',
    main_logo: '',
    hero_background: '',
    gallery: []
  });
  
  const [socialSettings, setSocialSettings] = useState<SocialSettings>({
    tiktok: '',
    instagram: '',
    youtube: '',
    twitter: ''
  });

  const [islandProfileSettings, setIslandProfileSettings] = useState<IslandProfileSettings>({
    community_values: '',
    history_description: '',
    location: '',
    population: '',
    best_time: ''
  });

  // Use settings hook
  const { 
    loading,
    error,
    getSettingsByCategory,
    updateSettings,
    getAllFacilities,
    createFacility,
    updateFacility,
    deleteFacility
  } = useSettings();

  // Load settings and facilities on component mount
  useEffect(() => {
    loadSettings();
    loadFacilities();
  }, []);

  // Load settings based on active tab
  useEffect(() => {
    if (activeTab === 'general') {
      loadGeneralSettings();
    } else if (activeTab === 'contact') {
      loadContactSettings();
    } else if (activeTab === 'media') {
      loadMediaSettings();
    } else if (activeTab === 'social') {
      loadSocialSettings();
    } else if (activeTab === 'island_profile') {
      loadIslandProfileSettings();
    }
  }, [activeTab]);

  // Load all settings for the current tab
  const loadSettings = async () => {
    loadGeneralSettings();
    loadContactSettings();
    loadMediaSettings();
    loadSocialSettings();
    loadIslandProfileSettings();
  };

  // Load general settings
  const loadGeneralSettings = async () => {
    const data = await getSettingsByCategory<GeneralSettings>('general');
    if (data) {
      setGeneralSettings(data);
    }
  };

  // Load contact settings
  const loadContactSettings = async () => {
    const data = await getSettingsByCategory<ContactSettings>('contact');
    if (data) {
      setContactSettings(data);
    }
  };

  // Load media settings
  const loadMediaSettings = async () => {
    const data = await getSettingsByCategory<MediaSettings>('media');
    if (data) {
      setMediaSettings(data);
    }
  };

  // Load social settings
  const loadSocialSettings = async () => {
    const data = await getSettingsByCategory<SocialSettings>('social');
    if (data) {
      setSocialSettings(data);
    }
  };

  // Load island profile settings
  const loadIslandProfileSettings = async () => {
    const data = await getSettingsByCategory<IslandProfileSettings>('island_profile');
    if (data) {
      setIslandProfileSettings(data);
    }
  };

  // Load facilities
  const loadFacilities = async () => {
    const data = await getAllFacilities();
    if (data) {
      setFacilities(data);
    }
  };

  // Handle saving settings based on active tab
  const handleSaveSettings = async () => {
    try {
      let result = null;
      
      if (activeTab === 'general') {
        result = await updateSettings('general', generalSettings);
      } else if (activeTab === 'contact') {
        result = await updateSettings('contact', contactSettings);
      } else if (activeTab === 'media') {
        result = await updateSettings('media', mediaSettings);
      } else if (activeTab === 'social') {
        result = await updateSettings('social', socialSettings);
      } else if (activeTab === 'island_profile') {
        result = await updateSettings('island_profile', islandProfileSettings);
      }
      
      if (result) {
        showToast('success', 'Pengaturan berhasil disimpan');
      }
    } catch (error) {
      showToast('error', 'Gagal menyimpan pengaturan');
    }
  };

  // Reset settings to default (reload from server)
  const handleResetSettings = () => {
    if (activeTab === 'general') {
      loadGeneralSettings();
    } else if (activeTab === 'contact') {
      loadContactSettings();
    } else if (activeTab === 'media') {
      loadMediaSettings();
    } else if (activeTab === 'social') {
      loadSocialSettings();
    } else if (activeTab === 'island_profile') {
      loadIslandProfileSettings();
    }
    
    showToast('info', 'Pengaturan direset ke nilai default');
  };

  // Handle adding a new facility
  const handleAddFacility = async () => {
    if (newFacility.icon && newFacility.label) {
      try {
        const result = await createFacility(newFacility);
        
        if (result) {
          setFacilities([...facilities, result]);
          setNewFacility({ icon: '', label: '', description: null, available: true });
          setShowAddForm(false);
          showToast('success', `Fasilitas ${newFacility.label} berhasil ditambahkan`);
        }
      } catch (error) {
        showToast('error', 'Gagal menambahkan fasilitas');
      }
    }
  };

  // Handle deleting a facility
  const handleDeleteFacility = async (id: number, label: string) => {
    try {
      const success = await deleteFacility(id);
      
      if (success) {
        setFacilities(facilities.filter(f => f.id !== id));
        showToast('success', `Fasilitas ${label} berhasil dihapus`);
      }
    } catch (error) {
      showToast('error', 'Gagal menghapus fasilitas');
    }
  };

  // Handle toggling facility availability
  const handleToggleFacility = async (id: number, available: boolean) => {
    try {
      const result = await updateFacility(id, { available });
      
      if (result) {
        setFacilities(facilities.map(f => 
          f.id === id ? { ...f, available } : f
        ));
      }
    } catch (error) {
      showToast('error', 'Gagal mengubah status fasilitas');
    }
  };

  // Handle form changes for general settings
  const handleGeneralChange = (field: keyof GeneralSettings, value: string) => {
    setGeneralSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form changes for contact settings
  const handleContactChange = (field: keyof ContactSettings, value: string) => {
    setContactSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form changes for media settings
  const handleMediaChange = (field: keyof MediaSettings, value: string | string[]) => {
    setMediaSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form changes for social settings
  const handleSocialChange = (field: keyof SocialSettings, value: string) => {
    setSocialSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form changes for island profile settings
  const handleIslandProfileChange = (field: keyof IslandProfileSettings, value: string) => {
    setIslandProfileSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'contact', label: 'Contact Info', icon: PhoneIcon },
    { id: 'media', label: 'Media', icon: PhotoIcon },
    { id: 'social', label: 'Social Media', icon: GlobeAltIcon },
    { id: 'island_profile', label: 'Island Profile', icon: HomeIcon },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Island Name</label>
        <input
          type="text"
          value={generalSettings.island_name}
          onChange={(e) => handleGeneralChange('island_name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Village Name</label>
        <input
          type="text"
          value={generalSettings.village_name}
          onChange={(e) => handleGeneralChange('village_name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={4}
          value={generalSettings.description}
          onChange={(e) => handleGeneralChange('description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
        <textarea
          rows={3}
          value={generalSettings.welcome_message}
          onChange={(e) => handleGeneralChange('welcome_message', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderContactSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          rows={3}
          value={contactSettings.address}
          onChange={(e) => handleContactChange('address', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="text"
            value={contactSettings.phone}
            onChange={(e) => handleContactChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
          <input
            type="text"
            value={contactSettings.whatsapp}
            onChange={(e) => handleContactChange('whatsapp', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={contactSettings.email}
          onChange={(e) => handleContactChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
        <input
          type="url"
          value={contactSettings.maps_embed_url}
          onChange={(e) => handleContactChange('maps_embed_url', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
          <input
            type="text"
            value={contactSettings.latitude}
            onChange={(e) => handleContactChange('latitude', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
          <input
            type="text"
            value={contactSettings.longitude}
            onChange={(e) => handleContactChange('longitude', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderMediaSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Video URL (YouTube)</label>
        <input
          type="url"
          value={mediaSettings.hero_video_url}
          onChange={(e) => handleMediaChange('hero_video_url', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Logo</label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            {mediaSettings.main_logo ? (
              <img src={mediaSettings.main_logo} alt="Logo" className="h-full w-full object-contain" />
            ) : (
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <button 
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            onClick={() => {
              // This would typically open a file upload dialog
              const url = prompt('Enter logo URL:');
              if (url) handleMediaChange('main_logo', url);
            }}
          >
            Upload Logo
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            {mediaSettings.hero_background ? (
              <img src={mediaSettings.hero_background} alt="Hero Background" className="h-full w-full object-cover" />
            ) : (
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <button 
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            onClick={() => {
              // This would typically open a file upload dialog
              const url = prompt('Enter hero background URL:');
              if (url) handleMediaChange('hero_background', url);
            }}
          >
            Upload Image
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {mediaSettings.gallery.map((url, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center relative">
              <img src={url} alt={`Gallery ${i+1}`} className="h-full w-full object-cover rounded-lg" />
              <button 
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                onClick={() => {
                  const newGallery = [...mediaSettings.gallery];
                  newGallery.splice(i, 1);
                  handleMediaChange('gallery', newGallery);
                }}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 6 - mediaSettings.gallery.length) }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            </div>
          ))}
        </div>
        <button 
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          onClick={() => {
            // This would typically open a file upload dialog
            const url = prompt('Enter image URL:');
            if (url) handleMediaChange('gallery', [...mediaSettings.gallery, url]);
          }}
        >
          Add Images
        </button>
      </div>
    </div>
  );

  const renderSocialSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">TikTok Account</label>
        <input
          type="url"
          value={socialSettings.tiktok}
          onChange={(e) => handleSocialChange('tiktok', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Account</label>
        <input
          type="url"
          value={socialSettings.instagram}
          onChange={(e) => handleSocialChange('instagram', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel</label>
        <input
          type="url"
          value={socialSettings.youtube}
          onChange={(e) => handleSocialChange('youtube', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Account</label>
        <input
          type="url"
          value={socialSettings.twitter}
          onChange={(e) => handleSocialChange('twitter', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderIslandProfileSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Island Profile Content</h3>
        <p className="text-sm text-blue-700">
          Edit the highlighted text sections that appear on the island profile section of the homepage.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Community Values Text</label>
        <textarea
          rows={4}
          value={islandProfileSettings.community_values}
          onChange={(e) => handleIslandProfileChange('community_values', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Describe the community values of the island..."
        />
        <p className="mt-1 text-xs text-gray-500">
          This is the first highlighted paragraph in the island profile section.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">History Description Text</label>
        <textarea
          rows={4}
          value={islandProfileSettings.history_description}
          onChange={(e) => handleIslandProfileChange('history_description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="Describe the history of the island..."
        />
        <p className="mt-1 text-xs text-gray-500">
          This is the second highlighted paragraph in the island profile section.
        </p>
      </div>
      
      <div className="bg-orange-50 p-4 rounded-lg mb-2">
        <h3 className="text-lg font-medium text-orange-800 mb-2">Island Statistics</h3>
        <p className="text-sm text-orange-700">
          Edit the statistics that appear on the island profile section.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={islandProfileSettings.location}
            onChange={(e) => handleIslandProfileChange('location', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. Sulawesi Selatan"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Population</label>
          <input
            type="text"
            value={islandProfileSettings.population}
            onChange={(e) => handleIslandProfileChange('population', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. ~500 Penduduk"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Best Time to Visit</label>
          <input
            type="text"
            value={islandProfileSettings.best_time}
            onChange={(e) => handleIslandProfileChange('best_time', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g. Sepanjang Tahun"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
        <p className="text-gray-600">Manage island profile, contact information, and website content</p>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-4">
          Loading settings...
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          Error: {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'contact' && renderContactSettings()}
          {activeTab === 'media' && renderMediaSettings()}
          {activeTab === 'social' && renderSocialSettings()}
          {activeTab === 'island_profile' && renderIslandProfileSettings()}
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button 
              onClick={handleResetSettings}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Reset
            </button>
            <button 
              onClick={handleSaveSettings}
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
              disabled={loading}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={hideToast}
        />
      )}

      {/* Island Facilities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Island Facilities</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            disabled={loading}
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Facility</span>
          </button>
        </div>
        
        {/* Add Facility Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Add New Facility</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                <input
                  type="text"
                  value={newFacility.icon}
                  onChange={(e) => setNewFacility({ ...newFacility, icon: e.target.value })}
                  placeholder="🏊"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  value={newFacility.label}
                  onChange={(e) => setNewFacility({ ...newFacility, label: e.target.value })}
                  placeholder="Swimming Pool"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={handleAddFacility}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  disabled={loading}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Facilities List */}
        {loading ? (
          <div className="text-center p-4">Loading facilities...</div>
        ) : facilities.length === 0 ? (
          <div className="text-center p-4">No facilities found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((facility) => (
              <div key={facility.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{facility.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{facility.label}</p>
                    <label className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={facility.available}
                        onChange={(e) => handleToggleFacility(facility.id, e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        disabled={loading}
                      />
                      <span className="ml-1 text-xs text-gray-600">Available</span>
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteFacility(facility.id, facility.label)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
                  title="Delete facility"
                  disabled={loading}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;