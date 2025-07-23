import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import useMSMEs, { MSMEQuery } from "../../hooks/useMSMEs";
import useMSMECRUD, { MSME } from "../../hooks/useMSMECRUD";

const UMKM: React.FC = () => {
  const { user, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMSME, setSelectedMSME] = useState<MSME | null>(null);
  const [msmeToDelete, setMsmeToDelete] = useState<MSME | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [prevMSMEs, setPrevMSMEs] = useState<MSME[]>([]);
  const { toast, showToast, hideToast } = useToast();

  // Form data state
  const [formData, setFormData] = useState({
    brand: "",
    description: "",
    phone: "",
    instagram: "",
    shopee: "",
    whatsapp: "",
  });

  // API state and queries
  const [query, setQuery] = useState<MSMEQuery>({
    page: 1,
    limit: 12,
    search: "",
    user_id: user?.role === "super_admin" ? undefined : user?.id?.toString(), // Super admin sees all, others see only their own
  });

  // Hooks for API operations
  const { msmes, loading: msmesLoading, error: msmesError } = useMSMEs(query);
  const {
    createMSME,
    updateMSME,
    deleteMSME,
    loading: crudLoading,
  } = useMSMECRUD();

  // Use previous data while loading
  useEffect(() => {
    if (msmes.length > 0) {
      setPrevMSMEs(msmes);
    }
  }, [msmes]);

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
  const displayMSMEs = msmesLoading ? prevMSMEs : msmes;

  const handleAddMSME = () => {
    setSelectedMSME(null);
    setFormData({
      brand: "",
      description: "",
      phone: "",
      instagram: "",
      shopee: "",
      whatsapp: "",
    });
    setIsModalOpen(true);
  };

  const handleEditMSME = (msme: MSME) => {
    setSelectedMSME(msme);
    setFormData({
      brand: msme.brand,
      description: msme.description,
      phone: msme.phone,
      instagram: msme.instagram || "",
      shopee: msme.shopee || "",
      whatsapp: msme.whatsapp || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteMSME = (msme: MSME) => {
    setMsmeToDelete(msme);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmDeleteMSME = async () => {
    if (!msmeToDelete || !token) return;

    try {
      const result = await deleteMSME(msmeToDelete.id, token);
      if (result.success) {
        showToast("success", `MSME ${msmeToDelete.brand} berhasil dihapus`);
        // Refresh MSMEs list
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menghapus MSME");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Terjadi kesalahan saat menghapus MSME");
    } finally {
      setIsDeleteDialogOpen(false);
      setMsmeToDelete(null);
    }
  };

  const handleSubmitMSME = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      let result;
      if (selectedMSME) {
        result = await updateMSME({ ...formData, id: selectedMSME.id }, token);
      } else {
        result = await createMSME(formData, token);
      }

      if (result.success) {
        const action = selectedMSME ? "diperbarui" : "dibuat";
        showToast("success", `MSME berhasil ${action}`);
        setIsModalOpen(false);
        setSelectedMSME(null);
        setFormData({
          brand: "",
          description: "",
          phone: "",
          instagram: "",
          shopee: "",
          whatsapp: "",
        });
        // Refresh MSMEs list
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menyimpan MSME");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("error", "Terjadi kesalahan saat menyimpan MSME");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">UMKM Partners</h1>
          <p className="text-gray-600">Manage local business partnerships</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddMSME}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add MSME
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by business name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 pl-10 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {msmesLoading && prevMSMEs.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-2 text-gray-600">Loading MSMEs...</p>
        </div>
      )}

      {/* Error State */}
      {msmesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error: {msmesError}</p>
        </div>
      )}

      {/* MSMEs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMSMEs.map((msme) => (
          <div key={msme.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-10 w-10 text-orange-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {msme.brand}
                  </h3>
                  <p className="text-sm text-gray-600">MSME Partner</p>
                </div>
              </div>
              <span className="flex items-center px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Active
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {msme.phone}
              </p>
              {msme.whatsapp && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">WhatsApp:</span> {msme.whatsapp}
                </p>
              )}
              {msme.instagram && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Instagram:</span> @
                  {msme.instagram}
                </p>
              )}
              {msme.shopee && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Shopee:</span> {msme.shopee}
                </p>
              )}
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-2">
              {msme.description}
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditMSME(msme)}
                className="flex items-center px-3 py-1 text-orange-600 border border-orange-600 rounded hover:bg-orange-50"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteMSME(msme)}
                className="flex items-center px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!msmesLoading && displayMSMEs.length === 0 && (
        <div className="text-center py-12">
          <BuildingStorefrontIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No MSMEs found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding your first MSME."}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddMSME}
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add First MSME
            </button>
          )}
        </div>
      )}

      {/* Modal */}
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
                    {selectedMSME ? "Edit MSME" : "Add New MSME"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmitMSME} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.brand}
                          onChange={(e) =>
                            handleFormChange("brand", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            handleFormChange("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          WhatsApp
                        </label>
                        <input
                          type="text"
                          value={formData.whatsapp}
                          onChange={(e) =>
                            handleFormChange("whatsapp", e.target.value)
                          }
                          placeholder="+62 812-3456-7890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instagram
                        </label>
                        <input
                          type="text"
                          value={formData.instagram}
                          onChange={(e) =>
                            handleFormChange("instagram", e.target.value)
                          }
                          placeholder="username"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Shopee Store
                        </label>
                        <input
                          type="url"
                          value={formData.shopee}
                          onChange={(e) =>
                            handleFormChange("shopee", e.target.value)
                          }
                          placeholder="https://shopee.co.id/..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={crudLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                      >
                        {crudLoading
                          ? "Saving..."
                          : selectedMSME
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
        onConfirm={confirmDeleteMSME}
        title="Delete MSME"
        message={`Are you sure you want to delete "${msmeToDelete?.brand}"? This action cannot be undone.`}
        confirmText="Delete"
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
};

export default UMKM;
