import React, { useState, useEffect } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import { useDeleteDestination } from "../../hooks/useDeleteDestination";
import useDestinations from "../../hooks/useDestinations";
import { DestinationQuery } from "../../hooks/useDestinations";
import { Destination } from "../../types";
import DestinationModal from "../../components/Destinations/DestinationModal";
import DestinationTable from "../../components/Destinations/DestinationTable";
import DestinationDetail from "../../components/Destinations/DestinationDetail";

import { useAuth } from "../../context/AuthContext";

// Hooks baru
import { useUploadFiles } from "../../hooks/useUploadFiles";
import { createDestination } from "../../hooks/useCreateDestination";
import { updateDestination } from "../../hooks/useUpdateDestination";

type DestinationAction =
  | { mode: "view"; destination: Destination }
  | { mode: "edit"; destination: Destination }
  | { mode: "none"; destination: undefined };

const Destinations: React.FC = () => {
  const { token } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [destinationToDelete, setDestinationToDelete] =
    useState<Destination | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast, showToast, hideToast } = useToast();
  const [activeDestination, setActiveDestination] = useState<DestinationAction>(
    { mode: "none", destination: undefined }
  );
  const [prevDestinations, setPrevDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState<DestinationQuery>({
    page: 1,
    limit: 10,
    category: undefined,
    search: "",
  });

  // Hook untuk fetch data
  const { destinations, pagination, loading } = useDestinations(query);

  // Hook untuk upload & create
  const {  error: uploadError, uploadFiles } = useUploadFiles();

  // Hook untuk delete
  const { deleteDestination } = useDeleteDestination();

  const handleFilterChange = (category: string) => {
    setFilterCategory(category);
    setQuery((prev) => ({
      ...prev,
      category: category === "all" ? undefined : category,
      page: 1,
    }));
  };

  useEffect(() => {
    if (pagination?.currentPage && pagination.currentPage !== query.page) {
      setQuery((prev) => ({
        ...prev,
        page: pagination.currentPage,
      }));
    }
  }, [pagination?.currentPage]);

  useEffect(() => {
    if (search === query.search) return;

    const handler = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: search,
        page: 1,
      }));
    }, 400);

    return () => clearTimeout(handler);
  }, [query.search, search]);

  useEffect(() => {
    if (destinations.length > 0) {
      setPrevDestinations(destinations);
    }
  }, [destinations]);

  // Gunakan data sebelumnya saat loading
  let destinationList = loading ? prevDestinations : destinations;

  const handleViewDetails = (destination: Destination) => {
    setActiveDestination({ mode: "view", destination });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddDestination = () => {
    setActiveDestination({ mode: "none", destination: undefined });
    setIsModalOpen(true);
  };

  const handleEditDestination = (destination: Destination) => {
    setActiveDestination({ mode: "edit", destination });
    setIsModalOpen(true);
  };

  const handleCloseDetailOrEdit = () => {
    setIsModalOpen(false);
    setActiveDestination({ mode: "none", destination: undefined });
  };

  const handleDeleteDestination = (destination: Destination) => {
    setDestinationToDelete(destination);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDestination = async () => {
    try {
      const res = await deleteDestination(
        destinationToDelete?.id ?? "",
        token ?? ""
      );
      if (res.success) {
        setQuery((prev) => ({ ...prev })); // trigger refetch
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setTimeout(() => {
        showToast(
          "success",
          `Destinasi ${destinationToDelete?.title} berhasil dihapus`
        );
        setIsDeleteDialogOpen(false);
        setDestinationToDelete(null);
      }, 500);
    }
  };

  // Handle save dari modal: terima data + files
  const handleSave = async (data: {
    destination: Omit<Destination, "id">;
    files: FileList | null;
  }) => {
    const { destination, files } = data;

    let filenames: string[] = [];

    // 1. Upload file jika user pilih baru
    if (files && files.length > 0) {
      filenames = await uploadFiles(files);
      if (filenames.length === 0) {
        showToast("error", "Upload gambar gagal");
        return;
      }
    }

    // 2. Tentukan apakah ini edit atau create
    if (activeDestination.destination) {
      // 🔁 UPDATE MODE
      const existing = activeDestination.destination;

      // Gunakan gambar lama jika tidak upload baru
      const image = filenames[0] || existing.image;
      const gallery =
        filenames.slice(1).length > 0 ? filenames.slice(1) : existing.gallery;

      const updatedDestination: Omit<Destination, "id"> = {
        ...destination,
        image,
        gallery,
      };

      const result = await updateDestination(
        existing.id,
        updatedDestination,
        token ?? ""
      );

      if (result?.success) {
        setQuery((prev) => ({ ...prev })); // refresh list
        showToast("success", `Destinasi berhasil diperbarui`);
        handleCloseDetailOrEdit();
      } else {
        showToast("error", `Gagal memperbarui destinasi: ${result?.message}`);
      }
    } else {
      // ➕ CREATE MODE
      if (filenames.length === 0) {
        showToast("error", "Pilih minimal 1 gambar.");
        return;
      }

      const [image, ...gallery] = filenames;

      const finalDestination: Omit<Destination, "id"> = {
        ...destination,
        image,
        gallery,
      };

      const result = await createDestination(finalDestination, token ?? "");

      if (result?.success) {
        setQuery((prev) => ({ ...prev }));
        showToast("success", `Destinasi berhasil dibuat`);
        handleCloseDetailOrEdit();
      } else {
        showToast("error", `Gagal membuat destinasi: ${result?.message}`);
      }
    }
  };

  // Render detail view
  if (activeDestination.mode === "view") {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg">
        <DestinationDetail
          destination={activeDestination.destination}
          onBack={handleCloseDetailOrEdit}
          onViewGallery={() => console.log("View gallery")}
          onGetDirections={() => console.log("Get directions")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-600">
            Manage tourist destinations and attractions
          </p>
        </div>
        <button
          onClick={handleAddDestination}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="beaches">Beaches</option>
              <option value="culture">Culture</option>
              <option value="nature">Nature</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DestinationTable
        data={destinationList ?? []}
        page={query.page ?? 1}
        limit={query.limit ?? 10}
        total={pagination?.totalItems ?? 0}
        onQueryChange={(q) =>
          setQuery((prev) => ({
            ...prev,
            ...q,
          }))
        }
        onView={handleViewDetails}
        onEdit={handleEditDestination}
        onDelete={handleDeleteDestination}
      />

      {/* Modal */}
      {isModalOpen && (
        <DestinationModal
          isOpen={isModalOpen}
          onClose={handleCloseDetailOrEdit}
          onSubmit={handleSave}
          initialData={
            activeDestination.mode === "edit"
              ? activeDestination.destination
              : undefined
          }
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteDestination}
        title="Hapus Destinasi"
        message={`Apakah Anda yakin ingin menghapus destinasi ${destinationToDelete?.title}? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        type="danger"
      />

      {/* Toast */}
      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
};

export default Destinations;
