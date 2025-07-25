import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useArticles, Article } from "../hooks/useArticles";

interface ArticlesPageProps {
  onNavigate: (page: string) => void;
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit
  });

  const {
    getArticles,
    loading: fetchLoading,
    error: fetchError
  } = useArticles();

  const filters = [
    { id: "all", label: "All Articles", icon: "📰" },
    { id: "tips", label: "Travel Tips", icon: "💡" },
    { id: "tourism", label: "Tourism", icon: "🏝️" },
    { id: "culture", label: "Culture", icon: "🎭" },
    { id: "msmes", label: "MSMEs", icon: "🏪" },
    { id: "environment", label: "Environment", icon: "🌱" },
  ];

  // Fetch articles when component mounts or when filters/search change
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const category = activeFilter === "all" ? undefined : activeFilter;
        const response = await getArticles(
          page,
          limit,
          category,
          searchTerm || undefined,
          "published" // Only show published articles on landing page
        );
        setArticles(response.articles);
        setPagination(response.pagination);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, limit, activeFilter, searchTerm, getArticles]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      // Search is handled in the fetchArticles effect
    }, 400); // debounce delay

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setPage(1); // Reset to first page when filter changes
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

  // Fix for the excerpt and featuredImage null values
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
            {selectedArticle.featuredImage && (
              <img
                src={selectedArticle.featuredImage}
                alt={selectedArticle.title}
                className="object-cover w-full h-64 md:h-96"
              />
            )}

            <div className="p-6">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {selectedArticle.title}
              </h1>

              <div className="flex flex-wrap items-center mb-6 space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>{selectedArticle.authorName || 'Unknown Author'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  <span>
                    {selectedArticle.publishedAt
                      ? formatDate(selectedArticle.publishedAt)
                      : 'Unpublished'}
                  </span>
                </div>
                <div className="px-2 py-1 mt-2 text-xs text-blue-800 bg-blue-100 rounded-full sm:mt-0">
                  {selectedArticle.category}
                </div>
              </div>

              {selectedArticle.excerpt && (
                <div className="p-4 mb-6 italic bg-gray-50 rounded-md">
                  {selectedArticle.excerpt}
                </div>
              )}

              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
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
            Artikel & Panduan Wisata
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Temukan tips perjalanan, panduan wisata, dan kisah menarik seputar Pulau Laiya 
            dari para wisatawan dan komunitas lokal
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
        {fetchError && (
          <div className="py-12 text-center">
            <p className="text-red-600">Error: {fetchError}</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !fetchError && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: Article) => (
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
        {!loading && !fetchError && articles.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">
              No articles found matching your search criteria.
            </p>
          </div>
        )}

        {/* Contribute Section */}
        <div className="p-8 mt-12 bg-white rounded-lg shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Bagikan Ceritamu
          </h3>
          <p className="mb-6 text-gray-600">
            Pernah berkunjung ke Pulau Laiya? Bagikan pengalaman, tips, dan kisah perjalananmu kepada sesama wisatawan. 
            Kontribusimu akan menjadi sumber inspirasi dan informasi berharga bagi para pengunjung di masa depan.
          </p>
          <Link
            to="/kontak#contribute"
            className="inline-block px-6 py-3 text-white bg-orange-600 rounded-lg transition-colors hover:bg-orange-700"
          >
            Kirim Artikelmu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
