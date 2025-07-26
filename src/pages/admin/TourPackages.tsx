import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CubeIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import useTourPackages, { TourPackageQuery } from "../../hooks/useTourPackages";
import useTourPackagesCRUD from "../../hooks/useTourPackagesCRUD";
import { useUploadFiles } from "../../hooks/useUploadFiles";
import { TourPackage } from "../../types";

const TourPackages: React.FC = () => {
  const { user, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(
    null
  );
  const [packageToDelete, setPackageToDelete] = useState<TourPackage | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [prevPackages, setPrevPackages] = useState<TourPackage[]>([]);
  const { toast, showToast, hideToast } = useToast();

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    facilities: [] as string[],
    duration: "",
    minPersons: 1,
    maxPersons: 10,
    description: "",
    image: "",
    popular: false,
    whatsappContact: "",
    whatsappBookingUrl: "", // ADD THIS FIELD
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [facilitiesText, setFacilitiesText] = useState("");

  // API state and queries
  const [query, setQuery] = useState<TourPackageQuery>({
    page: 1,
    limit: 12,
    search: "",
  });

  // Hooks for API operations
  const {
    packages,
    loading: packagesLoading,
    error: packagesError,
  } = useTourPackages(query);
  const {
    createTourPackage,
    updateTourPackage,
    deleteTourPackage,
    loading: crudLoading,
  } = useTourPackagesCRUD();
  const { uploadFiles, uploading: uploadLoading } = useUploadFiles();

  // Use previous data while loading
  useEffect(() => {
    if (packages.length > 0) {
      setPrevPackages(packages);
    }
  }, [packages]);

  // Handle search with debounce
  useEffect(() => {
    if (searchTerm === query.search) return;

    const handler = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1,
      }));
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, query.search]);

  // Use previous data while loading
  const displayPackages = packagesLoading ? prevPackages : packages;

  const filteredPackages = displayPackages;

  const handleAddPackage = () => {
    setSelectedPackage(null);
    setFormData({
      name: "",
      price: 0,
      facilities: [],
      duration: "",
      minPersons: 1,
      maxPersons: 10,
      description: "",
      image: "",
      popular: false,
      whatsappContact: "",
      whatsappBookingUrl: "",
    });
    setFacilitiesText("");
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEditPackage = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
    setFormData({
      name: pkg.name,
      price: pkg.price,
      facilities: pkg.facilities,
      duration: pkg.duration,
      minPersons: pkg.minPersons,
      maxPersons: pkg.maxPersons || 10,
      description: pkg.description,
      image: pkg.image,
      popular: pkg.popular || false,
      whatsappContact: pkg.whatsappContact,
      whatsappBookingUrl: pkg.whatsappBookingUrl || "",
    });
    setFacilitiesText(pkg.facilities.join("\n"));
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeletePackage = (pkg: TourPackage) => {
    setPackageToDelete(pkg);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmDeletePackage = async () => {
    if (!packageToDelete || !token) return;

    try {
      const result = await deleteTourPackage(packageToDelete.id, token);
      if (result.success) {
        showToast(
          "success",
          `Paket wisata ${packageToDelete.name} berhasil dihapus`
        );
        // Refresh packages list
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menghapus paket wisata");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Terjadi kesalahan saat menghapus paket wisata");
    } finally {
      setIsDeleteDialogOpen(false);
      setPackageToDelete(null);
    }
  };

  const handleSubmitPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      let image = formData.image;

      // Upload image if file is selected
      if (imageFile) {
        const uploadedUrls = await uploadFiles([imageFile]);
        if (uploadedUrls.length > 0) {
          image = uploadedUrls[0];
        }
      }

      // Parse facilities from text
      const facilities = facilitiesText
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const packageData = {
        ...formData,
        image,
        facilities,
      };

      let result;
      if (selectedPackage) {
        result = await updateTourPackage(
          { ...packageData, id: selectedPackage.id },
          token
        );
      } else {
        result = await createTourPackage(packageData, token);
      }

      if (result.success) {
        const action = selectedPackage ? "diperbarui" : "dibuat";
        showToast("success", `Paket wisata berhasil ${action}`);
        setIsModalOpen(false);
        setSelectedPackage(null);
        setFormData({
          name: "",
          price: 0,
          facilities: [],
          duration: "",
          minPersons: 1,
          maxPersons: 10,
          description: "",
          image: "",
          popular: false,
          whatsappContact: "",
          whatsappBookingUrl: "",
        });
        setFacilitiesText("");
        setImageFile(null);
        // Refresh packages list
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menyimpan paket wisata");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("error", "Terjadi kesalahan saat menyimpan paket wisata");
    }
  };

  const handleToggleStatus = (pkg: any) => {
    const newStatus = pkg.status === "active" ? "inactive" : "active";
    showToast(
      "success",
      `Status paket ${pkg.name} berhasil diubah menjadi ${newStatus}`
    );
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Packages</h1>
          <p className="text-gray-600">Manage tour packages and experiences</p>
        </div>
        <button
          onClick={handleAddPackage}
          className="flex items-center px-4 py-2 space-x-2 text-white bg-orange-600 rounded-lg transition-colors hover:bg-orange-700"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="overflow-hidden bg-white rounded-lg shadow-md"
          >
            <img
              src={
                pkg.image && pkg.image.includes("http")
                  ? pkg.image
                  : pkg.image
                  ? `http://localhost:5000/api/files/upload/${pkg.image}`
                  : "https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
              alt={pkg.name}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {pkg.name}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    pkg.popular
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {pkg.popular ? "Popular" : "Regular"}
                </span>
              </div>

              <p className="mb-3 text-sm text-gray-600">{pkg.description}</p>

              <div className="mb-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="mr-2 w-4 h-4" />
                  <span className="font-semibold text-orange-600">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="mr-2 w-4 h-4" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UsersIcon className="mr-2 w-4 h-4" />
                  <span>Min {pkg.minPersons} persons</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{pkg.facilities.length}</span>{" "}
                  facilities
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex justify-center items-center px-3 py-2 text-blue-600 rounded-md transition-colors hover:text-blue-700 hover:bg-blue-50">
                  <EyeIcon className="inline mr-1 w-4 h-4" />
                  <span className="text-sm font-medium">View</span>
                </button>
                <button
                  onClick={() => handleEditPackage(pkg)}
                  className="flex justify-center items-center px-3 py-2 text-green-600 rounded-md transition-colors hover:text-green-700 hover:bg-green-50"
                >
                  <PencilIcon className="inline mr-1 w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDeletePackage(pkg)}
                  className="flex justify-center items-center px-3 py-2 text-red-600 rounded-md transition-colors hover:text-red-700 hover:bg-red-50"
                >
                  <TrashIcon className="inline mr-1 w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Package Modal */}
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

          <div className="overflow-y-auto fixed inset-0">
            <div className="flex justify-center items-center p-4 min-h-full text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                  <Dialog.Title
                    as="h3"
                    className="mb-4 text-lg font-medium leading-6 text-gray-900"
                  >
                    {selectedPackage
                      ? "Edit Tour Package"
                      : "Add New Tour Package"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmitPackage} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Package Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          handleFormChange("description", e.target.value)
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Price (IDR)
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) =>
                            handleFormChange(
                              "price",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={formData.duration}
                          onChange={(e) =>
                            handleFormChange("duration", e.target.value)
                          }
                          placeholder="e.g., 8 hours"
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Min Persons
                        </label>
                        <input
                          type="number"
                          value={formData.minPersons}
                          onChange={(e) =>
                            handleFormChange(
                              "minPersons",
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Max Persons
                        </label>
                        <input
                          type="number"
                          value={formData.maxPersons}
                          onChange={(e) =>
                            handleFormChange(
                              "maxPersons",
                              parseInt(e.target.value) || 10
                            )
                          }
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        WhatsApp Contact
                      </label>
                      <input
                        type="text"
                        value={formData.whatsappContact}
                        onChange={(e) =>
                          handleFormChange("whatsappContact", e.target.value)
                        }
                        placeholder="+62 812-3456-7890"
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        WhatsApp Booking URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://wa.me/6281234567890?text=Hi, I want to book..."
                        value={formData.whatsappBookingUrl}
                        onChange={(e) =>
                          handleFormChange("whatsappBookingUrl", e.target.value)
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        URL WhatsApp dengan pesan booking otomatis
                      </p>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Facilities (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={facilitiesText}
                        onChange={(e) => setFacilitiesText(e.target.value)}
                        placeholder="Transportation&#10;Snorkeling equipment&#10;Lunch&#10;Local guide"
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Image URL
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex justify-center items-center w-20 h-20 bg-gray-200 rounded-lg">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setImageFile(e.target.files?.[0] || null)
                            }
                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            JPG, PNG, or GIF. Max size 5MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Gallery Images
                      </label>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex justify-center items-center bg-gray-200 rounded-lg aspect-square"
                          >
                            <PhotoIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        ))}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Select multiple images for gallery
                      </p>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="popular"
                        checked={formData.popular}
                        onChange={(e) =>
                          handleFormChange("popular", e.target.checked)
                        }
                        className="text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="popular"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Mark as popular package
                      </label>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        {selectedPackage ? "Update" : "Create"}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeletePackage}
        title="Hapus Paket Wisata"
        message={`Apakah Anda yakin ingin menghapus paket wisata ${packageToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
};

export default TourPackages;
