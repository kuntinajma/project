import React, { useState, useEffect } from "react";
import { Clock, Users, Star, MessageCircle, Award } from "lucide-react";
// import { tourPackages } from '../data/mockData';
import { TourPackage } from "../types";
import useTourPackages, { TourPackageQuery } from "../hooks/useTourPackages";

interface TourPackagesPageProps {
  onNavigate: (page: string) => void;
}

const TourPackagesPage: React.FC<TourPackagesPageProps> = ({ onNavigate }) => {
  const [prevPackages, setPrevPackages] = useState<TourPackage[]>([]);
  const [query, setQuery] = useState<TourPackageQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const [search, setSearch] = useState("");
  const { packages, loading, error } = useTourPackages(query);

  useEffect(() => {
    if (packages.length > 0) {
      setPrevPackages(packages);
    }
  }, [packages]);

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

  // using previous data while loading data
  const tourPackages = loading ? prevPackages : packages;

  const handleWhatsAppContact = (phoneNumber: string, packageName: string) => {
    const message = `Hi! I'm interested in the ${packageName} tour package. Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Failed to load tour packages
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              Failed to load tour packages: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Tour Packages
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Choose from our carefully curated tour packages designed to give you
            the best experience of Laiya Island and its surrounding attractions.
          </p>

          <div className="flex flex-row justify-center items-center mt-6">
            <div className="md:w-1/3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search packages..."
                className="px-4 py-2 w-full rounded-lg border shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {tourPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                pkg.popular ? "ring-2 ring-orange-500" : ""
              }`}
            >
              {pkg.popular && (
                <div className="py-2 text-center text-white bg-orange-500">
                  <div className="flex justify-center items-center space-x-1">
                    <Award size={16} />
                    <span className="font-medium">Most Popular</span>
                  </div>
                </div>
              )}

              <div className="relative">
                <img
                  src={
                    pkg.image.includes("http")
                      ? pkg.image
                      : `http://localhost:3005/api/files/upload/${pkg.image}`
                  }
                  alt={pkg.name}
                  className="object-cover w-full h-64"
                />
                <div className="absolute top-4 right-4 px-3 py-2 rounded-lg backdrop-blur-sm bg-white/90">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  {pkg.name}
                </h3>

                <p className="mb-4 text-gray-600">{pkg.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-orange-600" size={18} />
                    <span className="text-sm text-gray-700">
                      {pkg.duration}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-blue-600" size={18} />
                    <span className="text-sm text-gray-700">
                      Min. {pkg.minPersons} persons
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Included Facilities:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">
                          {facility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Starting from</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatPrice(pkg.price)}
                    </p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>

                  <button
                    onClick={() =>
                      handleWhatsAppContact(pkg.whatsappContact, pkg.name)
                    }
                    className="flex items-center px-6 py-3 space-x-2 text-white bg-green-600 rounded-lg transition-colors hover:bg-green-700"
                  >
                    <MessageCircle size={20} />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 mt-12 bg-white rounded-lg shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Booking Information
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                What's Included:
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Professional local guide</li>
                <li>• Transportation to/from accommodation</li>
                <li>• All entrance fees</li>
                <li>• Safety equipment</li>
                <li>• Traditional lunch</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-gray-900">
                Important Notes:
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Advance booking recommended</li>
                <li>• Weather dependent activities</li>
                <li>• Suitable for all fitness levels</li>
                <li>• Vegetarian options available</li>
                <li>• Group discounts available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPackagesPage;
