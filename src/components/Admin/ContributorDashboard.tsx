import React, { useState } from 'react';
import { 
  FileText, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  Award
} from 'lucide-react';

const ContributorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('articles');

  const contributorStats = {
    totalArticles: 15,
    publishedArticles: 12,
    pendingArticles: 2,
    totalViews: 8450,
  };

  const articles = [
    { 
      id: 1, 
      title: 'Best Time to Visit Laiya Island', 
      status: 'published', 
      views: 1234, 
      date: '2024-01-15',
      category: 'tips'
    },
    { 
      id: 2, 
      title: 'Hidden Gems of South Sulawesi', 
      status: 'pending', 
      views: 0, 
      date: '2024-01-14',
      category: 'tourism'
    },
    { 
      id: 3, 
      title: 'Sustainable Tourism Practices', 
      status: 'review', 
      views: 0, 
      date: '2024-01-13',
      category: 'environment'
    },
    { 
      id: 4, 
      title: 'Local Cuisine Guide', 
      status: 'published', 
      views: 856, 
      date: '2024-01-12',
      category: 'culture'
    },
    { 
      id: 5, 
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3 mr-4">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{contributorStats.totalArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3 mr-4">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{contributorStats.publishedArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 rounded-lg p-3 mr-4">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{contributorStats.pendingArticles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3 mr-4">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{contributorStats.totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Articles and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Articles</h3>
          <div className="space-y-3">
            {articles.slice(0, 4).map((article) => (
              <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{article.title}</p>
                  <p className="text-sm text-gray-600">{article.category} • {article.date}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    article.status === 'published' ? 'bg-green-100 text-green-800' :
                    article.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    article.status === 'review' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {article.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{article.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
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
    </div>
  );

  const renderArticles = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">My Articles</h3>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
          <Plus size={16} />
          <span>Write Article</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{article.title}</h4>
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-sm text-gray-600">{article.category}</span>
                  <span className="text-sm text-gray-600">{article.date}</span>
                  <span className="text-sm text-gray-600">{article.views.toLocaleString()} views</span>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  article.status === 'published' ? 'bg-green-100 text-green-800' :
                  article.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  article.status === 'review' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {article.status}
                </span>
              </div>
              <div className="flex space-x-2 ml-4">
                <button className="text-blue-600 hover:text-blue-700">
                  <Eye size={16} />
                </button>
                <button className="text-green-600 hover:text-green-700">
                  <Edit size={16} />
                </button>
                {article.status === 'draft' && (
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWriteArticle = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Write New Article</h3>
      
      <form className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Article Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Enter article title..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="tips">Travel Tips</option>
              <option value="tourism">Tourism</option>
              <option value="culture">Culture</option>
              <option value="msmes">MSMEs</option>
              <option value="environment">Environment</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Article Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Brief description of your article..."
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Article Content
          </label>
          <textarea
            id="content"
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Write your article content here..."
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Contributor Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                defaultValue="Sarah Johnson"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                defaultValue="sarah@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
              <input
                type="text"
                defaultValue="University of Indonesia"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
              <input
                type="text"
                defaultValue="Tourism Management"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Contributor Status</h4>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-2" size={20} />
                <span className="font-medium text-green-800">Verified Contributor</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your articles are automatically published without admin review.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Award className="text-blue-600 mr-2" size={20} />
                <span className="font-medium text-blue-800">Top Contributor</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                You're one of our most active contributors this month!
              </p>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">Writing Guidelines</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Write engaging, informative content</li>
                <li>• Use high-quality images</li>
                <li>• Follow SEO best practices</li>
                <li>• Respect local culture and environment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
          Update Profile
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'articles', label: 'My Articles', icon: FileText },
    { id: 'write', label: 'Write Article', icon: Plus },
    { id: 'profile', label: 'Profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Contributor Dashboard</h1>
          <p className="text-gray-600">Share your stories and experiences about Laiya Island</p>
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'articles' && renderArticles()}
        {activeTab === 'write' && renderWriteArticle()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default ContributorDashboard;