import React, { useState } from 'react';
import { 
  CogIcon, 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  GlobeAltIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import Toast from '../../components/common/Toast';
import { useToast } from '../../hooks/useToast';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { toast, showToast, hideToast } = useToast();

  const handleSaveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      showToast('success', 'Pengaturan berhasil disimpan');
    }, 500);
  };

  const handleResetSettings = () => {
    showToast('info', 'Pengaturan direset ke nilai default');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'contact', label: 'Contact Info', icon: PhoneIcon },
    { id: 'media', label: 'Media', icon: PhotoIcon },
    { id: 'social', label: 'Social Media', icon: GlobeAltIcon },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Island Name</label>
        <input
          type="text"
          defaultValue="Pulau Laiya"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Village Name</label>
        <input
          type="text"
          defaultValue="Desa Mattiro Labangeng"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={4}
          defaultValue="Pulau Laiya adalah destinasi wisata eksotis dengan budaya lokal yang kaya di Desa Mattiro Labangeng, Sulawesi Selatan."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
        <textarea
          rows={3}
          defaultValue="Selamat datang di Pulau Laiya, permata tersembunyi Sulawesi Selatan dengan keindahan alam dan budaya yang memukau."
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
          defaultValue="Pulau Laiya, Desa Mattiro Labangeng, Kecamatan Liukang Tupabbiring, Kabupaten Pangkep, Sulawesi Selatan"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="text"
            defaultValue="+62 812-3456-7890"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
          <input
            type="text"
            defaultValue="+62 812-3456-7890"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          defaultValue="info@pulaulaiya.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
        <input
          type="url"
          defaultValue="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
          <input
            type="text"
            defaultValue="-5.1234"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
          <input
            type="text"
            defaultValue="119.5678"
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
          defaultValue="https://www.youtube.com/watch?v=Gh0K71uxucM"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Main Logo</label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <PhotoIcon className="h-8 w-8 text-gray-400" />
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Upload Logo
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <PhotoIcon className="h-8 w-8 text-gray-400" />
          </div>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            Upload Image
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            </div>
          ))}
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
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
          defaultValue="https://tiktok.com/@pulaulaiya"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram Account</label>
        <input
          type="url"
          defaultValue="https://instagram.com/pulaulaiya"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel</label>
        <input
          type="url"
          defaultValue="https://youtube.com/@pulaulaiya"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">TikTok Account</label>
        <input
          type="url"
          defaultValue="https://tiktok.com/@pulaulaiya"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Account</label>
        <input
          type="url"
          defaultValue="https://twitter.com/pulaulaiya"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
        <p className="text-gray-600">Manage island profile, contact information, and website content</p>
      </div>

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
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
            <button 
              onClick={handleResetSettings}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Reset
            </button>
            <button 
              onClick={handleSaveSettings}
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Island Facilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: '📶', label: 'Wi-Fi', available: true },
            { icon: '⚡', label: 'Electricity', available: true },
            { icon: '🏪', label: 'Local Store', available: true },
            { icon: '🏥', label: 'Medical', available: false },
            { icon: '🍽️', label: 'Restaurant', available: true },
          ].map((facility, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
              <span className="text-2xl">{facility.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{facility.label}</p>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={facility.available}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-1 text-xs text-gray-600">Available</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;