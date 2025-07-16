import React from 'react';
import { Clock, Users, Star, MessageCircle, Award } from 'lucide-react';
import { tourPackages } from '../data/mockData';

interface TourPackagesPageProps {
  onNavigate: (page: string) => void;
}

const TourPackagesPage: React.FC<TourPackagesPageProps> = ({ onNavigate }) => {
  const handleWhatsAppContact = (phoneNumber: string, packageName: string) => {
    const message = `Hi! I'm interested in the ${packageName} tour package. Can you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tour Packages
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our carefully curated tour packages designed to give you 
            the best experience of Laiya Island and its surrounding attractions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tourPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                pkg.popular ? 'ring-2 ring-orange-500' : ''
              }`}
            >
              {pkg.popular && (
                <div className="bg-orange-500 text-white text-center py-2">
                  <div className="flex items-center justify-center space-x-1">
                    <Award size={16} />
                    <span className="font-medium">Most Popular</span>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {pkg.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Clock className="text-orange-600" size={18} />
                    <span className="text-sm text-gray-700">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="text-blue-600" size={18} />
                    <span className="text-sm text-gray-700">Min. {pkg.minPersons} persons</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Included Facilities:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Starting from</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatPrice(pkg.price)}
                    </p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  
                  <button
                    onClick={() => handleWhatsAppContact(pkg.whatsappContact, pkg.name)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What's Included:</h4>
              <ul className="text-gray-600 space-y-1">
                <li>• Professional local guide</li>
                <li>• Transportation to/from accommodation</li>
                <li>• All entrance fees</li>
                <li>• Safety equipment</li>
                <li>• Traditional lunch</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Important Notes:</h4>
              <ul className="text-gray-600 space-y-1">
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