import React, { useState, useEffect, Fragment } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import useCulturalContents, { CultureQuery } from "../../hooks/useCultures";
import useCulturesCRUD from "../../hooks/useCulturesCRUD";
import { useUploadFiles } from "../../hooks/useUploadFiles";
import { CulturalContent } from "../../types";

const Culture: React.FC = () => {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCulture, setSelectedCulture] =
    useState<CulturalContent | null>(null);
  const [cultureToDelete, setCultureToDelete] =
    useState<CulturalContent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [prevCultures, setPrevCultures] = useState<CulturalContent[]>([]);
  const { toast, showToast, hideToast } = useToast();

  // Form data state
  const [formData, setFormData] = useState<Omit<CulturalContent, "id">>({
    title: "",
    description: "",
    image: "",
    category: "dance",
    gallery: [],
    videos: [],
    videoUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<FileList | null>(null);

  // API state and queries
  const [query, setQuery] = useState<CultureQuery>({
    page: 1,
    limit: 12,
    search: "",
    category: undefined,
  });

  // Hooks for API operations
  const {
    cultures,
    loading: culturesLoading,
    error: culturesError,
  } = useCulturalContents(query);
  const {
    createCulture,
    updateCulture,
    deleteCulture,
    loading: crudLoading,
  } = useCulturesCRUD();
  const { uploadFiles, uploading: uploadLoading } = useUploadFiles();

  // Use previous data while loading to prevent UI flicker
  useEffect(() => {
    if (cultures.length > 0) {
      setPrevCultures(cultures);
    }
  }, [cultures]);

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

  // Update query when category filter changes
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      category: filterCategory === "all" ? undefined : filterCategory,
      page: 1,
    }));
  }, [filterCategory]);

  const displayCultures = culturesLoading ? prevCultures : cultures;

  const handleAddCulture = () => {
    setSelectedCulture(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      category: "dance",
      gallery: [],
      videos: [],
      videoUrl: "",
    });
    setImageFile(null);
    setGalleryFiles(null);
    setIsModalOpen(true);
  };

  const handleEditCulture = (culture: CulturalContent) => {
    setSelectedCulture(culture);
    setFormData({
      title: culture.title,
      description: culture.description,
      image: culture.image,
      category: culture.category,
      gallery: culture.gallery || [],
      videos: culture.videos || [],
      videoUrl: culture.videoUrl || "",
    });
    setImageFile(null);
    setGalleryFiles(null);
    setIsModalOpen(true);
  };

  const handleDeleteCulture = (culture: CulturalContent) => {
    setCultureToDelete(culture);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (
    field: keyof typeof formData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmDeleteCulture = async () => {
    if (!cultureToDelete || !token) return;

    try {
      const result = await deleteCulture(cultureToDelete.id, token);
      if (result.success) {
        showToast(
          "success",
          `Budaya ${cultureToDelete.title} berhasil dihapus`
        );
        setQuery((prev) => ({ ...prev })); // Refresh list
      } else {
        showToast("error", result.message || "Gagal menghapus budaya");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Terjadi kesalahan saat menghapus budaya");
    } finally {
      setIsDeleteDialogOpen(false);
      setCultureToDelete(null);
    }
  };

  const handleSubmitCulture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      let image = formData.image;
      let gallery = [...(formData.gallery || [])];

      // Upload main image if a new file is selected
      if (imageFile) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFile);
        const uploadedUrls = await uploadFiles(dataTransfer.files);
        if (uploadedUrls.length > 0) {
          image = uploadedUrls[0];
        }
      }

      // Upload gallery images if new files are selected
      if (galleryFiles && galleryFiles.length > 0) {
        const uploadedGalleryUrls = await uploadFiles(galleryFiles);
        gallery = [...gallery, ...uploadedGalleryUrls];
      }

      const cultureData = { ...formData, image, gallery };

      let result;
      if (selectedCulture) {
        result = await updateCulture(
          { ...cultureData, id: selectedCulture.id },
          token
        );
      } else {
        result = await createCulture(cultureData, token);
      }

      if (result.success) {
        const action = selectedCulture ? "diperbarui" : "dibuat";
        showToast("success", `Budaya berhasil ${action}`);
        setIsModalOpen(false);
        setQuery((prev) => ({ ...prev })); // Refresh list
      } else {
        showToast("error", result.message || "Gagal menyimpan budaya");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("error", "Terjadi kesalahan saat menyimpan budaya");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "dance":
        return "bg-pink-100 text-pink-800";
      case "culinary":
        return "bg-orange-100 text-orange-800";
      case "customs":
        return "bg-purple-100 text-purple-800";
      case "wisdom":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Culture & Traditions
          </h1>
          <p className="text-gray-600">
            Manage local culture and traditional practices
          </p>
        </div>
        <button
          onClick={handleAddCulture}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Culture</span>
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
                placeholder="Search culture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="dance">Dance</option>
              <option value="culinary">Culinary</option>
              <option value="customs">Customs</option>
              <option value="wisdom">Local Wisdom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {culturesLoading && displayCultures.length === 0 && (
        <p>Loading cultures...</p>
      )}
      {culturesError && (
        <p>Error loading cultures: {culturesError.message}</p>
      )}

      {/* Culture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCultures.map((culture) => (
          <div
            key={culture.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={culture.image}
              alt={culture.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {culture.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                    culture.category
                  )}`}
                >
                  {culture.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {culture.description}
              </p>
              <div className="flex space-x-2">
                <button className="flex items-center justify-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">View</span>
                </button>
                <button
                  onClick={() => handleEditCulture(culture)}
                  className="flex items-center justify-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCulture(culture)}
                  className="flex items-center justify-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <TrashIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Culture Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsModalOpen(false)}
        >
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    {selectedCulture ? "Edit Culture" : "Add New Culture"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmitCulture} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          handleFormChange("title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) =>
                          handleFormChange(
                            "category",
                            e.target.value as CulturalContent["category"]
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="dance">Dance</option>
                        <option value="culinary">Culinary</option>
                        <option value="customs">Customs</option>
                        <option value="wisdom">Local Wisdom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.description}
                        onChange={(e) =>
                          handleFormChange("description", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Image
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                          <PhotoIcon className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setImageFile(e.target.files?.[0] || null)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, or GIF. Max size 5MB.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube Video URL (Optional)
                      </label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) =>
                          handleFormChange("videoUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gallery Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setGalleryFiles(e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Select multiple images for the gallery.
                      </p>
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
                        type="submit"
                        disabled={crudLoading || uploadLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                      >
                        {crudLoading || uploadLoading
                          ? "Saving..."
                          : selectedCulture
                          ? "Update"
                          : "Create"}
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
        onConfirm={confirmDeleteCulture}
        title="Hapus Budaya"
        message={`Apakah Anda yakin ingin menghapus budaya "${cultureToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
};

export default Culture;