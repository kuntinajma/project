import React from 'react';
import { 
  MapPinIcon, 
  CubeIcon, 
  DocumentTextIcon, 
  BuildingStorefrontIcon, 
  SparklesIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Destinations', value: '24', icon: MapPinIcon, color: 'bg-green-500' },
    { label: 'Tour Packages', value: '18', icon: CubeIcon, color: 'bg-orange-500' },
    { label: 'Cultural Items', value: '31', icon: SparklesIcon, color: 'bg-pink-500' },
    { label: 'UMKM Partners', value: '42', icon: BuildingStorefrontIcon, color: 'bg-purple-500' },
  ];

  const recentDestinations = [
    { name: 'Pantai Sunset Bay', category: 'beaches', status: 'published', views: 1234 },
    { name: 'Traditional Village Tour', category: 'culture', status: 'draft', views: 0 },
    { name: 'Coral Garden Diving', category: 'nature', status: 'published', views: 856 },
  ];

  const pendingArticles = [
    { title: 'Best Time to Visit Laiya', author: 'Sarah Johnson', submitted: '2 days ago' },
    { title: 'Local Cuisine Guide', author: 'Ahmad Rahman', submitted: '1 day ago' },
    { title: 'Diving Tips for Beginners', author: 'Maria Santos', submitted: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage destinations, packages, and content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                  <Icon className="text-white h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Destinations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Destinations</h3>
            <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700">
              <PlusIcon className="h-4 w-4" />
              <span className="text-sm">Add New</span>
            </button>
          </div>
          <div className="space-y-3">
            {recentDestinations.map((destination, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{destination.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {destination.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      destination.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {destination.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{destination.views} views</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Articles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Article Reviews</h3>
          <div className="space-y-3">
            {pendingArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{article.title}</p>
                  <p className="text-sm text-gray-600">by {article.author} • {article.submitted}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-green-600 hover:text-green-700 text-sm">Approve</button>
                  <button className="text-red-600 hover:text-red-700 text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <MapPinIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-900">Add Destination</span>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <CubeIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-orange-900">Create Package</span>
          </button>
          <button className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
            <SparklesIcon className="h-8 w-8 text-pink-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-pink-900">Add Culture</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <DocumentTextIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-900">Review Articles</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;