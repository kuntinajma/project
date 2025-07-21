import React from 'react';
import { 
  UsersIcon, 
  MapPinIcon, 
  CubeIcon, 
  DocumentTextIcon, 
  BuildingStorefrontIcon, 
  SparklesIcon,
  ChartBarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const SuperAdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Users', value: '156', icon: UsersIcon, color: 'bg-blue-500', change: '+12%' },
    { label: 'Destinations', value: '24', icon: MapPinIcon, color: 'bg-green-500', change: '+8%' },
    { label: 'Tour Packages', value: '18', icon: CubeIcon, color: 'bg-orange-500', change: '+15%' },
    { label: 'UMKM Partners', value: '42', icon: BuildingStorefrontIcon, color: 'bg-purple-500', change: '+22%' },
    { label: 'Cultural Items', value: '31', icon: SparklesIcon, color: 'bg-pink-500', change: '+5%' },
    { label: 'Articles', value: '89', icon: DocumentTextIcon, color: 'bg-indigo-500', change: '+18%' },
  ];

  const recentActivities = [
    { type: 'user', action: 'New UMKM partner registered', user: 'Kerajinan Laiya', time: '2 hours ago' },
    { type: 'destination', action: 'New destination added', user: 'Admin User', time: '4 hours ago' },
    { type: 'article', action: 'Article published', user: 'Sarah Johnson', time: '6 hours ago' },
    { type: 'package', action: 'Tour package updated', user: 'Admin User', time: '1 day ago' },
  ];

  const pendingApprovals = [
    { type: 'UMKM Registration', item: 'Souvenir Laiya Store', status: 'pending' },
    { type: 'Article Review', item: 'Best Beaches in Laiya Island', status: 'pending' },
    { type: 'Destination Update', item: 'Coral Garden Description', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600">Overview of Laiya Island tourism website</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                  <Icon className="text-white h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
          <div className="space-y-4">
            {pendingApprovals.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.item}</p>
                  <p className="text-xs text-gray-600">{item.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-green-600 hover:text-green-700">
                    <EyeIcon className="h-4 w-4" />
                  </button>
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
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-900">Manage Users</span>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <MapPinIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-900">Add Destination</span>
          </button>
          <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <CubeIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-orange-900">Create Package</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-900">View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;