import React from 'react';
import { 
  CubeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const MSMEDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Products', value: '12', icon: CubeIcon, color: 'bg-blue-500' },
    { label: 'Monthly Views', value: '1,234', icon: EyeIcon, color: 'bg-green-500' },
    { label: 'Inquiries', value: '45', icon: ChartBarIcon, color: 'bg-orange-500' },
    { label: 'Revenue', value: 'Rp 2.5M', icon: CurrencyDollarIcon, color: 'bg-purple-500' },
  ];

  const products = [
    { 
      name: 'Coconut Shell Handicraft', 
      price: 'Rp 125,000', 
      stock: 15, 
      views: 234,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    { 
      name: 'Traditional Woven Bag', 
      price: 'Rp 85,000', 
      stock: 8, 
      views: 156,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    { 
      name: 'Seashell Jewelry Set', 
      price: 'Rp 65,000', 
      stock: 0, 
      views: 89,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
  ];

  const recentInquiries = [
    { customer: 'Sarah Johnson', product: 'Coconut Shell Handicraft', time: '2 hours ago' },
    { customer: 'Ahmad Rahman', product: 'Traditional Woven Bag', time: '1 day ago' },
    { customer: 'Maria Santos', product: 'Seashell Jewelry Set', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">UMKM Dashboard</h1>
        <p className="text-gray-600">Manage your products and business profile</p>
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
        {/* Products Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
            <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700">
              <PlusIcon className="h-4 w-4" />
              <span className="text-sm">Add Product</span>
            </button>
          </div>
          <div className="space-y-3">
            {products.map((product, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{product.price}</span>
                    <span>Stock: {product.stock}</span>
                    <span>{product.views} views</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
          <div className="space-y-3">
            {recentInquiries.map((inquiry, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-gray-900">{inquiry.customer}</p>
                <p className="text-sm text-gray-600">Interested in: {inquiry.product}</p>
                <p className="text-xs text-gray-500">{inquiry.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Profile Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Laiya Crafts</h4>
            <p className="text-gray-600 mb-4">Traditional handicrafts made from local materials</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Phone:</span> +62 812-3456-7890</p>
              <p><span className="font-medium">WhatsApp:</span> +62 812-3456-7890</p>
              <p><span className="font-medium">Instagram:</span> @laiyacrafts</p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MSMEDashboard;