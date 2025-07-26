import React, { useState } from "react";
import {
  BuildingStorefrontIcon,
  PhoneIcon,
  EnvelopeIcon,
  PhotoIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import Toast from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const ProfileUMKM: React.FC = () => {
  const { toast, showToast, hideToast } = useToast();
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState({
    businessName: "",
    ownerName: "",
    description: "",
    category: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    instagram: "",
    facebook: "",
    shopee: "",
    tiktok: "",
    website: "",
    id: "", // id msme
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch UMKM milik user login
  React.useEffect(() => {
    const fetchUMKM = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/msme?user_id=${user.id}`);
        const data = await res.json();
        if (data.success && data.data.msmes.length > 0) {
          const msme = data.data.msmes[0];
          setProfileData({
            businessName: msme.brand || "",
            ownerName: user.name || "",
            description: msme.description || "",
            category: "", // backend belum ada, bisa diisi manual
            phone: msme.phone || "",
            whatsapp: msme.whatsapp || "",
            email: user.email || "",
            address: "", // backend belum ada, bisa diisi manual
            instagram: msme.instagram || "",
            facebook: "",
            shopee: msme.shopee || "",
            tiktok: "",
            website: "",
            id: msme.id,
          });
        } else {
          setError("UMKM tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal mengambil data UMKM");
      } finally {
        setLoading(false);
      }
    };
    fetchUMKM();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !profileData.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/msme/${profileData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand: profileData.businessName,
          description: profileData.description,
          phone: profileData.phone,
          whatsapp: profileData.whatsapp,
          instagram: profileData.instagram,
          shopee: profileData.shopee,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("success", "Profil UMKM berhasil diperbarui");
      } else {
        showToast("error", data.message || "Gagal update profil UMKM");
      }
    } catch (err) {
      showToast("error", "Gagal update profil UMKM");
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading UMKM profile...</div>;
  }
  if (error) {
    return <div className="py-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">UMKM Profile</h1>
        <p className="text-gray-600">
          Manage your business profile and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Information */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
            <BuildingStorefrontIcon className="w-5 h-5 mr-2" />
            Business Information
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                value={profileData.businessName}
                onChange={(e) =>
                  handleInputChange("businessName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                type="text"
                value={profileData.ownerName}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Business Description
            </label>
            <textarea
              rows={4}
              value={profileData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Business Category
            </label>
            <select
              value={profileData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="handicrafts">Handicrafts</option>
              <option value="food">Food & Beverage</option>
              <option value="textiles">Textiles</option>
              <option value="souvenirs">Souvenirs</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Business Address
            </label>
            <textarea
              rows={2}
              value={profileData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
            <PhoneIcon className="w-5 h-5 mr-2" />
            Contact Information
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={profileData.whatsapp}
                onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
            <GlobeAltIcon className="w-5 h-5 mr-2" />
            Social Media & Online Presence
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Instagram Username
              </label>
              <input
                type="text"
                value={profileData.instagram}
                onChange={(e) => handleInputChange("instagram", e.target.value)}
                placeholder="@yourusername"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Facebook Page
              </label>
              <input
                type="text"
                value={profileData.facebook}
                onChange={(e) => handleInputChange("facebook", e.target.value)}
                placeholder="Your Facebook page name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Shopee Store URL
              </label>
              <input
                type="url"
                value={profileData.shopee}
                onChange={(e) => handleInputChange("shopee", e.target.value)}
                placeholder="https://shopee.co.id/yourstore"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                TikTok Username
              </label>
              <input
                type="text"
                value={profileData.tiktok}
                onChange={(e) => handleInputChange("tiktok", e.target.value)}
                placeholder="@yourusername"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Website/Online Store
              </label>
              <input
                type="text"
                value={profileData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Business Logo/Images */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
            <PhotoIcon className="w-5 h-5 mr-2" />
            Business Images
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Business Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-lg">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                >
                  Upload Logo
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Business Banner
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-32 h-20 bg-gray-200 rounded-lg">
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
                >
                  Upload Banner
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Product Gallery
            </label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-center bg-gray-200 rounded-lg aspect-square"
                >
                  <PhotoIcon className="w-8 h-8 text-gray-400" />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="px-4 py-2 text-white transition-colors bg-orange-600 rounded-lg hover:bg-orange-700"
            >
              Add Images
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
          >
            Update Profile
          </button>
        </div>
      </form>

      {/* Toast Notification */}
      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
};

export default ProfileUMKM;
