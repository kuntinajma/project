import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Article } from "../types";
import useArticles, { ArticleQuery } from "../hooks/useArticles";

interface ArticlesPageProps {
  onNavigate: (page: string) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [prevArticles, setPrevArticles] = useState<Article[]>([]);

  const [query, setQuery] = useState<ArticleQuery>({
    page: 1,
    limit: 12,
    search: "",
    category: undefined,
    status: "published", // Only show published articles on landing page
  });

  const { articles, loading, error } = useArticles(query);

  const filters = [
    { id: "all", label: "All Articles", icon: "📰" },
    { id: "tips", label: "Travel Tips", icon: "💡" },
    { id: "tourism", label: "Tourism", icon: "🏝️" },
    { id: "culture", label: "Culture", icon: "🎭" },
    { id: "msmes", label: "MSMEs", icon: "🏪" },
    { id: "environment", label: "Environment", icon: "🌱" },
  ];

  useEffect(() => {
    if (articles.length > 0) {
      setPrevArticles(articles);
    }
  }, [articles]);

  useEffect(() => {
    if (searchTerm === query.search) return;

    const handler = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1,
      }));
    }, 400); // debounce delay

    return () => clearTimeout(handler);
  }, [searchTerm, query.search]);

  // Use previous data while loading
  const displayArticles = loading ? prevArticles : articles;

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setQuery((prev) => ({
      ...prev,
      category: filter === "all" ? undefined : filter,
      page: 1,
    }));
  };

  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <button
            onClick={handleBackToList}
            className="flex items-center mb-6 space-x-2 text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft size={20} />
            <span>Back to Articles</span>
          </button>

          <article className="overflow-hidden bg-white rounded-lg shadow-lg">
            <img
              src={selectedArticle.featuredImage}
              alt={selectedArticle.title}
              className="object-cover w-full h-64 md:h-96"
            />

            <div className="p-8">
              <div className="flex items-center mb-4 space-x-4">
                <span className="px-3 py-1 text-sm font-medium text-orange-800 bg-orange-100 rounded-full">
                  {selectedArticle.category}
                </span>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {formatDate(selectedArticle.publishedAt)}
                  </span>
                </div>
              </div>

              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center mb-6 space-x-3">
                <div className="flex justify-center items-center w-10 h-10 font-bold text-white bg-gradient-to-r from-orange-400 to-blue-400 rounded-full">
                  {selectedArticle.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {selectedArticle.authorName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Travel Writer</p>
                </div>
              </div>

              <div className="max-w-none prose">
                <p className="mb-6 text-xl font-light leading-relaxed text-gray-600">
                  {selectedArticle.excerpt}
                </p>

                <div className="leading-relaxed text-gray-700">
                  {selectedArticle.content
                    .split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>

              <div className="pt-6 mt-8 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      Share this article:
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        Facebook
                      </button>
                      <button className="text-blue-400 hover:text-blue-500">
                        Twitter
                      </button>
                      <button className="text-blue-700 hover:text-blue-800">
                        LinkedIn
                      </button>
                    </div>
                  </div>
                  <Link
                    to="/kontak#contribute"
                    className="font-medium text-orange-600 hover:text-orange-700"
                  >
                    Contact Author
                  </Link>
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
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Travel Articles & Guides
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Discover insider tips, travel guides, and stories about Laiya Island
            from experienced travelers and local experts.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-orange-600" />
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-colors ${
                      activeFilter === filter.id
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-orange-100"
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

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <p className="text-gray-600">Loading articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-12 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayArticles.map((article: Article) => (
              <div
                key={article.id}
                className="overflow-hidden bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl"
              >
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="object-cover w-full h-48"
                />

                <div className="p-6">
                  <div className="flex items-center mb-3 space-x-2">
                    <span className="px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
                      {article.category}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar size={14} />
                      <span className="text-xs">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                  </div>

                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {article.title}
                  </h3>

                  <p className="mb-4 text-gray-600 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {article.authorName}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewArticle(article)}
                      className="font-medium text-orange-600 hover:text-orange-700"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && displayArticles.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              No articles found matching your search criteria.
            </p>
          </div>
        )}

        {/* Contribute Section */}
        <div className="p-8 mt-12 bg-white rounded-lg shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Share Your Story
          </h3>
          <p className="mb-6 text-gray-600">
            Have you visited Laiya Island? Share your experiences, tips, and
            stories with fellow travelers. Your contribution helps build a
            valuable resource for future visitors.
          </p>
          <Link
            to="/kontak#contribute"
            className="inline-block px-6 py-3 text-white bg-orange-600 rounded-lg transition-colors hover:bg-orange-700"
          >
            Contribute Article
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
