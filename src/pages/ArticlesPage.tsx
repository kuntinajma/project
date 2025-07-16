import React, { useState } from 'react';
import { Search, Filter, Calendar, User, ArrowLeft } from 'lucide-react';
import { articles } from '../data/mockData';
import { Article } from '../types';

interface ArticlesPageProps {
  onNavigate: (page: string) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filters = [
    { id: 'all', label: 'All Articles', icon: '📰' },
    { id: 'tips', label: 'Travel Tips', icon: '💡' },
    { id: 'tourism', label: 'Tourism', icon: '🏝️' },
    { id: 'culture', label: 'Culture', icon: '🎭' },
    { id: 'msmes', label: 'MSMEs', icon: '🏪' },
    { id: 'environment', label: 'Environment', icon: '🌱' },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || article.category === activeFilter;
    return matchesSearch && matchesFilter && article.approved;
  });

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Articles</span>
          </button>

          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {selectedArticle.category}
                </span>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">{formatDate(selectedArticle.date)}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedArticle.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-600" />
                    <span className="font-medium text-gray-900">{selectedArticle.author}</span>
                  </div>
                  <p className="text-sm text-gray-600">Travel Writer</p>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                  {selectedArticle.excerpt}
                </p>
                
                <div className="text-gray-700 leading-relaxed">
                  {selectedArticle.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6 mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Share this article:</span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">Facebook</button>
                      <button className="text-blue-400 hover:text-blue-500">Twitter</button>
                      <button className="text-blue-700 hover:text-blue-800">LinkedIn</button>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Contact Author
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Travel Articles & Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover insider tips, travel guides, and stories about Laiya Island 
            from experienced travelers and local experts.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
              <Filter size={20} className="text-orange-600" />
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
                    }`}
                  >
                    <span className="text-sm">{filter.icon}</span>
                    <span className="text-sm font-medium">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Calendar size={14} />
                    <span className="text-xs">{formatDate(article.date)}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">{article.author}</span>
                  </div>
                  <button
                    onClick={() => handleViewArticle(article)}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No articles found matching your search criteria.
            </p>
          </div>
        )}

        {/* Contribute Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Share Your Story
          </h3>
          <p className="text-gray-600 mb-6">
            Have you visited Laiya Island? Share your experiences, tips, and stories 
            with fellow travelers. Your contribution helps build a valuable resource 
            for future visitors.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Contribute Article
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;