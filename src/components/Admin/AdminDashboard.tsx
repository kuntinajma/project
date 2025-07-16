import React, { useState } from 'react';
import { 
  MapPin, 
  Package, 
  FileText, 
  ShoppingBag, 
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('destinations');

  const destinations = [
    { id: 1, title: 'Laiya Beach', category: 'beaches', status: 'published', views: 1234 },
    { id: 2, title: 'Coral Garden', category: 'nature', status: 'published', views: 856 },
    { id: 3, title: 'Traditional Village', category: 'culture', status: 'draft', views: 0 },
  ];

  const tourPackages = [
    { id: 1, name: 'Island Hopping Adventure', price: 750000, bookings: 45, status: 'active' },
    { id: 2, name: 'Cultural Immersion', price: 500000, bookings: 23, status: 'active' },
    { id: 3, name: 'Sunset Photography Tour', price: 300000, bookings: 12, status: 'inactive' },
  ];

  const articles = [
    { id: 1, title: 'Best Time to Visit Laiya Island', author: 'Travel Writer', status: 'published', date: '2024-01-15' },
    { id: 2, title: 'Hidden Gems of South Sulawesi', author: 'Local Guide', status: 'pending', date: '2024-01-14' },
    { id: 3, title: 'Sustainable Tourism Practices', author: 'Contributor', status: 'review', date: '2024-01-13' },
  ];

  const msmeRequests = [
    { id: 1, businessName: 'Laiya Crafts', owner: 'Ahmad Rahman', products: 5, status: 'pending' },
    { id: 2, businessName: 'Island Souvenirs', owner: 'Maria Santos', products: 12, status: 'approved' },
    { id: 3, businessName: 'Traditional Foods', owner: 'Siti Nurhaliza', products: 8, status: 'review' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderDestinations = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Manage Destinations</h3>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Destination</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {destinations.map((destination) => (
              <tr key={destination.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{destination.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {destination.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    destination.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {destination.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {destination.views.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTourPackages = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Manage Tour Packages</h3>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Package</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tourPackages.map((pkg) => (
          <div key={pkg.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                pkg.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {pkg.status}
              </span>
            </div>
            <p className="text-lg font-bold text-orange-600 mb-2">{formatPrice(pkg.price)}</p>
            <p className="text-sm text-gray-600 mb-4">{pkg.bookings} bookings</p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                Edit
              </button>
              <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderArticles = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Manage Articles</h3>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Article</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{article.title}</h4>
                <p className="text-sm text-gray-600 mb-2">by {article.author} • {article.date}</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  article.status === 'published' ? 'bg-green-100 text-green-800' :
                  article.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {article.status}
                </span>
              </div>
              <div className="flex space-x-2 ml-4">
                {article.status === 'pending' && (
                  <>
                    <button className="text-green-600 hover:text-green-700">
                      <CheckCircle size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <XCircle size={16} />
                    </button>
                  </>
                )}
                <button className="text-blue-600 hover:text-blue-700">
                  <Eye size={16} />
                </button>
                <button className="text-gray-600 hover:text-gray-700">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMSME = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">MSME Account Requests</h3>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Create MSME Account</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {msmeRequests.map((request) => (
          <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{request.businessName}</h4>
                <p className="text-sm text-gray-600 mb-2">Owner: {request.owner}</p>
                <p className="text-sm text-gray-600 mb-2">{request.products} products</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {request.status}
                </span>
              </div>
              <div className="flex space-x-2 ml-4">
                {request.status === 'pending' && (
                  <>
                    <button className="text-green-600 hover:text-green-700">
                      <CheckCircle size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <XCircle size={16} />
                    </button>
                  </>
                )}
                <button className="text-blue-600 hover:text-blue-700">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'packages', label: 'Tour Packages', icon: Package },
    { id: 'articles', label: 'Articles', icon: FileText },
    { id: 'msme', label: 'MSME Accounts', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage destinations, packages, articles, and MSME accounts</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
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
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'destinations' && renderDestinations()}
        {activeTab === 'packages' && renderTourPackages()}
        {activeTab === 'articles' && renderArticles()}
        {activeTab === 'msme' && renderMSME()}
      </div>
    </div>
  );
};

export default AdminDashboard;