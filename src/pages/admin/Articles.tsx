import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../context/AuthContext';

const Articles: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const articles = [
    { 
      id: 1, 
      title: 'Best Time to Visit Laiya Island', 
      author: 'Sarah Johnson',
      category: 'tips',
      status: 'published',
      views: 1234,
      date: '2024-01-15',
      excerpt: 'Discover the perfect time to visit Laiya Island for the best weather and experiences.'
    },
    { 
      id: 2, 
      title: 'Hidden Gems of South Sulawesi', 
      author: 'Ahmad Rahman',
      category: 'tourism',
      status: 'pending',
      views: 0,
      date: '2024-01-14',
      excerpt: 'Explore lesser-known attractions around Laiya Island and South Sulawesi.'
    },
    { 
      id: 3, 
      title: 'Local Cuisine Guide', 
      author: 'Maria Santos',
      category: 'culture',
      status: 'published',
      views: 856,
      date: '2024-01-12',
      excerpt: 'A comprehensive guide to traditional foods and local delicacies.'
    },
    { 
      id: 4, 
      title: 'Sustainable Tourism Practices', 
      author: 'David Kim',
      category: 'environment',
      status: 'draft',
      views: 0,
      date: '2024-01-11',
      excerpt: 'How to travel responsibly and support local communities.'
    },
  ];

  // Filter articles based on user role
  const getFilteredArticles = () => {
    let filtered = articles;
    
    // If contributor, only show their own articles
    if (user?.role === 'contributor') {
      filtered = articles.filter(article => article.author === user.name);
    }
    
    // Apply search and filters
    return filtered.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || article.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  const filteredArticles = getFilteredArticles();

  const handleAddArticle = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
  };

  const handleEditArticle = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tips': return 'bg-blue-100 text-blue-800';
      case 'tourism': return 'bg-green-100 text-green-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'msmes': return 'bg-orange-100 text-orange-800';
      case 'environment': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canApproveReject = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'contributor' ? 'My Articles' : 'Articles Management'}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'contributor' 
              ? 'Write and manage your travel articles' 
              : 'Manage and moderate travel articles'
            }
          </p>
        </div>
        <button
          onClick={handleAddArticle}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>{user?.role === 'contributor' ? 'Write Article' : 'Add Article'}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="tips">Tips</option>
              <option value="tourism">Tourism</option>
              <option value="culture">Culture</option>
              <option value="msmes">MSMEs</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(article.status)}`}>
                    {article.status}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">{article.excerpt}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {article.author}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.views} views</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {canApproveReject && article.status === 'pending' && (
                  <>
                    <button className="text-green-600 hover:text-green-700 p-2">
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-700 p-2">
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button className="text-blue-600 hover:text-blue-700 p-2">
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleEditArticle(article)}
                  className="text-green-600 hover:text-green-700 p-2"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                {(user?.role === 'contributor' && article.author === user.name) || 
                 (user?.role === 'admin' || user?.role === 'superadmin') ? (
                  <button className="text-red-600 hover:text-red-700 p-2">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Article Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {selectedArticle ? 'Edit Article' : 'Write New Article'}
                  </Dialog.Title>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        defaultValue={selectedArticle?.title || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          defaultValue={selectedArticle?.category || 'tips'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="tips">Tips</option>
                          <option value="tourism">Tourism</option>
                          <option value="culture">Culture</option>
                          <option value="msmes">MSMEs</option>
                          <option value="environment">Environment</option>
                        </select>
                      </div>
                      
                      {(user?.role === 'admin' || user?.role === 'superadmin') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            defaultValue={selectedArticle?.status || 'draft'}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="draft">Draft</option>
                            <option value="pending">Pending Review</option>
                            <option value="published">Published</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                      <textarea
                        rows={2}
                        defaultValue={selectedArticle?.excerpt || ''}
                        placeholder="Brief description of your article..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        rows={12}
                        placeholder="Write your article content here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Save as Draft
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        {user?.role === 'contributor' ? 'Submit for Review' : 'Publish'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default Articles;