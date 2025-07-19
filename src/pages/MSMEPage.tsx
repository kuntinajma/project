import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  ExternalLink,
  Star,
} from "lucide-react";
// import { msmeProducts } from '../data/mockData';
import useMSMEProducts from "../hooks/useMSMEProducts";
import type { MSMEProductQuery } from "../hooks/useMSMEProducts";
import { MSMEProduct } from "../types";

interface MSMEPageProps {
  onNavigate: (page: string) => void;
}

const MSMEPage: React.FC<MSMEPageProps> = ({ onNavigate }) => {
  const [prevMsmeProducts, setPrevMsmeProducts] = useState<MSMEProduct[]>([]);

  const [query, setQuery] = useState<MSMEProductQuery>({
    page: 1,
    limit: 10,
    search: "",
  });

  const { msmeProducts, loading, error } = useMSMEProducts(query);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (msmeProducts.length > 0) {
      setPrevMsmeProducts(msmeProducts);
    }
  }, [msmeProducts]);

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
  const productList = loading ? prevMsmeProducts : msmeProducts;

  const [selectedProduct, setSelectedProduct] = useState<MSMEProduct | null>(
    null
  );

  const handleViewDetails = (product: MSMEProduct) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleContact = (
    platform: string,
    contact: string,
    productName: string
  ) => {
    let url = "";
    const message = `Hi! I'm interested in the ${productName} product. Can you provide more details?`;

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/${contact.replace(
          "+",
          ""
        )}?text=${encodeURIComponent(message)}`;
        break;
      case "shopee":
        url = contact;
        break;
      case "instagram":
        url = `https://instagram.com/${contact.replace("@", "")}`;
        break;
      case "tiktok":
        url = contact;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Material:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedProduct.material}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Durability:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {selectedProduct.durability}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Delivery Time:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {selectedProduct.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h1>
                <p className="text-3xl font-bold text-orange-600 mb-4">
                  {formatPrice(selectedProduct.price)}
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(4.8 rating)</span>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Seller Information
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedProduct.sellerInfo.brand.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedProduct.sellerInfo.brand}
                    </h4>
                    <p className="text-sm text-gray-600">Local Craftsman</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() =>
                      handleContact(
                        "whatsapp",
                        selectedProduct.sellerInfo.whatsapp,
                        selectedProduct.name
                      )
                    }
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>

                  {selectedProduct.sellerInfo.shopee && (
                    <button
                      onClick={() =>
                        handleContact(
                          "shopee",
                          selectedProduct.sellerInfo.shopee,
                          selectedProduct.name
                        )
                      }
                      className="flex items-center justify-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <ShoppingBag size={16} />
                      <span>Shopee</span>
                    </button>
                  )}

                  {selectedProduct.sellerInfo.instagram && (
                    <button
                      onClick={() =>
                        handleContact(
                          "instagram",
                          selectedProduct.sellerInfo.instagram,
                          selectedProduct.name
                        )
                      }
                      className="flex items-center justify-center space-x-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>Instagram</span>
                    </button>
                  )}

                  {selectedProduct.sellerInfo.tiktok && (
                    <button
                      onClick={() =>
                        handleContact(
                          "tiktok",
                          selectedProduct.sellerInfo.tiktok,
                          selectedProduct.name
                        )
                      }
                      className="flex items-center justify-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>TikTok</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Support Local Business
                </h3>
                <p className="text-blue-800">
                  By purchasing this product, you're supporting local craftsmen
                  and the sustainable economy of Laiya Island community.
                </p>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Local Products & MSMEs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic handcrafted products from local artisans and
            small businesses in Laiya Island. Support the community while taking
            home unique souvenirs.
          </p>

          <div className="mt-6 flex flex-row items-center justify-center">
            <div className="md:w-1/3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product..."
                className="w-full px-4 py-2 border shadow-md rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productList.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 fill-current" size={16} />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-orange-600 mb-2">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    by {product.sellerInfo.brand}
                  </div>
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            About Our MSMEs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Supporting Local Economy
              </h4>
              <p className="text-gray-600">
                Our MSME partners are local artisans and small business owners
                who create authentic products using traditional techniques and
                local materials.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Quality & Authenticity
              </h4>
              <p className="text-gray-600">
                Every product is carefully crafted with attention to detail,
                ensuring you receive genuine, high-quality items that represent
                the culture of Laiya Island.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MSMEPage;
