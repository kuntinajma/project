import React from 'react';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  PlusIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ContributorDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Articles', value: '15', icon: DocumentTextIcon, color: 'bg-blue-500' },
    { label: 'Published', value: '12', icon: CheckCircleIcon, color: 'bg-green-500' },
    { label: 'Pending Review', value: '2', icon: ClockIcon, color: 'bg-yellow-500' },
    { label: 'Total Views', value: '8,450', icon: EyeIcon, color: 'bg-purple-500' },
  ];

  const articles = [
    { 
      title: 'Best Time to Visit Laiya Island', 
      status: 'published', 
      views: 1234, 
      date: '2024-01-15',
      category: 'tips'
    },
    { 
      title: 'Hidden Gems of South Sulawesi', 
      status: 'pending', 
      views: 0, 
      date: '2024-01-14',
      category: 'tourism'
    },
    { 
      title: 'Local Cuisine Guide', 
      status: 'published', 
      views: 856, 
      date: '2024-01-12',
      category: 'culture'
    },
    { 
      title: 'Photography Tips for Island Travel', 
      status: 'draft', 
      views: 0, 
      date: '2024-01-11',
      category: 'tips'
    },
  ];

  const achievements = [
    { title: 'First Article Published', date: '2023-12-01', icon: '🎉' },
    { title: 'Top Contributor of the Month', date: '2024-01-01', icon: '🏆' },
    { title: '10 Articles Published', date: '2024-01-10', icon: '📚' },
    { title: '5000+ Total Views', date: '2024-01-15', icon: '👀' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contributor Dashboard</h1>
        <p className="text-gray-600">Share your stories about Laiya Island</p>
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
        {/* My Articles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">My Articles</h3>
            <button className="flex items-center space-x-1 text-orange-600 hover:text-orange-700">
              <PlusIcon className="h-4 w-4" />
              <span className="text-sm">Write Article</span>
            </button>
          </div>
          <div className="space-y-3">
            {articles.map((article, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{article.title}</h4>
                  <div className="flex space-x-1">
                    <button className="text-gray-400 hover:text-gray-600">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(article.status)}`}>
                    {article.status}
                  </span>
                  <span className="text-gray-600">{article.category}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{article.views} views</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">{article.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg">
                <div className="text-2xl mr-3">{achievement.icon}</div>
                <div>
                  <p className="font-medium text-gray-900">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Writing Guidelines */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Writing Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Content Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Write engaging, informative content about Laiya Island</li>
              <li>• Include personal experiences and practical tips</li>
              <li>• Use high-quality images to support your content</li>
              <li>• Respect local culture and environment</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Article Categories</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <span className="font-medium">Tips:</span> Travel advice and recommendations</li>
              <li>• <span className="font-medium">Tourism:</span> Attractions and activities</li>
              <li>• <span className="font-medium">Culture:</span> Local traditions and customs</li>
              <li>• <span className="font-medium">Environment:</span> Conservation and sustainability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorDashboard;