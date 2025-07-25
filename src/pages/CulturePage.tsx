import React, { useState, useEffect } from "react";
import { ArrowLeft, Play, Filter } from "lucide-react";
// import { culturalContent } from '../data/mockData';
import useCulturalContents from "../hooks/useCultures";
import type { CultureQuery } from "../hooks/useCultures";
import { CulturalContent } from "../types";
import CulturalContentFilter from "../components/CulturalContent/CulturalContentFilter";

interface CulturePageProps {
  onNavigate: (page: string) => void;
}

const CulturePage: React.FC<CulturePageProps> = ({ onNavigate }) => {
  const [prevCultures, setPrevCultures] = useState<CulturalContent[]>([]);
  const [query, setQuery] = useState<CultureQuery>({
    page: 1,
    limit: 10,
    category: undefined,
    search: "",
  });

  const { cultures, loading, error } = useCulturalContents(query);

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedContent, setSelectedContent] =
    useState<CulturalContent | null>(null);
  const [search, setSearch] = useState("");

  const handleFilterChange = (category: string) => {
    setActiveFilter(category); // update UI active button
    setQuery((prev) => ({
      ...prev,
      category: category === "all" ? undefined : category,
      page: 1, // reset page when filter changes
    }));
  };

  const handleViewDetails = (content: CulturalContent) => {
    setSelectedContent(content);
  };

  const handleBackToList = () => {
    setSelectedContent(null);
  };

  useEffect(() => {
    if (cultures.length > 0) {
      setPrevCultures(cultures);
    }
  }, [cultures]);

  useEffect(() => {
    if (search === query.search) return;

    const handler = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: search,
        page: 1,
      }));
    }, 400); // debounce delay (400ms)

    return () => {
      clearTimeout(handler); // cancel previous timeout on each keystroke
    };
  }, [query.search, search]);

  // using previous destinations while loading data
  const cultureList = loading ? prevCultures : cultures;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Failed to load Cultural Contents
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Failed to load cultural content: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedContent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Culture</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <img
                src={selectedContent.image}
                alt={selectedContent.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />

              {selectedContent.gallery.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedContent.gallery.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${selectedContent.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              )}

              {selectedContent.videos && selectedContent.videos.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Video Content
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedContent.videos.map((video, index) => (
                      <div
                        key={index}
                        className="relative bg-gray-200 rounded-lg h-48 flex items-center justify-center"
                      >
                        <Play className="text-gray-500" size={32} />
                        <p className="absolute bottom-2 left-2 text-sm text-gray-600">
                          Video {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedContent.title}
                </h1>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {selectedContent.category}
                </span>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedContent.description}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Makna Budaya
                </h3>
                <p className="text-gray-600">
                  Unsur budaya ini mencerminkan kekayaan warisan Pulau Laiya dan Desa Mattiro Labangeng yang telah diwariskan 
                  secara turun-temurun dan masih dilestarikan hingga kini sebagai bagian dari identitas masyarakat setempat.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Experience This Culture
                </h3>
                <p className="text-orange-800 mb-4">
                  Join our cultural tours to witness and participate in these
                  traditional practices.
                </p>
                <button
                  onClick={() => onNavigate("packages")}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  View Cultural Tours
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Budaya & Tradisi
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rasakan kekayaan warisan budaya Pulau Laiya dan Desa Mattiro Labangeng, 
            tempat tradisi leluhur masih hidup dan terus dilestarikan hingga kini.
          </p>

          <div className="mt-6 flex flex-row items-center justify-center">
            <div className="md:w-1/3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-4 py-2 border shadow-md rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>

        <CulturalContentFilter
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cultureList.map((content) => (
            <div
              key={content.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-medium">
                    {content.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {content.title}
                </h3>
                <p className="text-gray-600 mb-4">{content.description}</p>

                <button
                  onClick={() => handleViewDetails(content)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {cultureList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No cultural content found for the selected category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CulturePage;
