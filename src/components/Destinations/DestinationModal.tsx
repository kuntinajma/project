import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { PhotoIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/solid";
import { Destination } from "../../types";

// Props baru: terima data awal, kirim form + files ke parent
interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    destination: Omit<Destination, "id">;
    files: File[] | null;
  }) => void;
  initialData?: Destination; // untuk edit mode
}

const categoryOptions = ["beaches", "culture", "nature", "adventure"] as const;
const MAX_FILES = 5; // Maximum number of files allowed

export default function DestinationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: DestinationModalProps) {
  // State form
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]>("nature");
  const [locationLat, setLocationLat] = useState<number | "">("");
  const [locationLng, setLocationLng] = useState<number | "">("");
  const [mapUrl, setMapUrl] = useState("");

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Ref untuk trigger file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset & isi ulang form saat modal buka
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setShortDescription(initialData.shortDescription);
      setDescription(initialData.description);
      setCategory(initialData.category);
      setLocationLat(initialData.location.lat);
      setLocationLng(initialData.location.lng);
      // Tidak set file — biarkan user pilih lagi kalau mau ganti
    } else {
      resetForm();
    }
  }, [initialData]);

  // Update map URL when coordinates change
  useEffect(() => {
    if (locationLat !== "" && locationLng !== "") {
      const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${locationLat},${locationLng}&zoom=15`;
      setMapUrl(googleMapsUrl);
    } else {
      setMapUrl("");
    }
  }, [locationLat, locationLng]);

  const resetForm = () => {
    setTitle("");
    setShortDescription("");
    setDescription("");
    setCategory("nature");
    setLocationLat("");
    setLocationLng("");
    setSelectedFiles([]);
    setPreviews([]);
    setMapUrl("");
    setFileError(null);
  };

  // Handle file change for single file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) return;
    
    // Check if we've reached the maximum number of files
    if (selectedFiles.length >= MAX_FILES) {
      setFileError(`Maksimal ${MAX_FILES} gambar diperbolehkan`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    // Check file type and size
    const isValidType = file.type.startsWith('image/');
    const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
    
    if (!isValidType || !isValidSize) {
      setFileError('File harus berupa gambar (JPG, PNG) dengan ukuran maksimal 5MB');
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    // Add the file to our collection
    const newFiles = [...selectedFiles, file];
    setSelectedFiles(newFiles);
    
    // Create and add the preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreviews([...previews, previewUrl]);
    
    // Reset the file input for the next selection
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Remove a specific file and its preview
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    // Also remove the preview
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    
    setFileError(null);
  };

  // Clear all files
  const clearAllFiles = () => {
    // Revoke all object URLs to prevent memory leaks
    previews.forEach(url => URL.revokeObjectURL(url));
    
    setSelectedFiles([]);
    setPreviews([]);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submission data:", {
      title,
      shortDescription,
      description,
      category,
      locationLat,
      locationLng,
      filesCount: selectedFiles.length,
      isEditMode: !!initialData
    });

    if (
      !title ||
      !shortDescription ||
      !category ||
      !locationLat ||
      !locationLng
    ) {
      console.error("Validation failed - missing required fields:", {
        title: !!title,
        shortDescription: !!shortDescription,
        category: !!category,
        locationLat: !!locationLat,
        locationLng: !!locationLng
      });
      alert("Semua field wajib diisi");
      return;
    }

    // Validate description length
    if (description && description.length < 50) {
      console.error("Description too short:", description.length);
      alert("Deskripsi harus minimal 50 karakter");
      return;
    }

    // Validate short description length
    if (shortDescription.length < 10 || shortDescription.length > 500) {
      console.error("Short description invalid length:", shortDescription.length);
      alert("Deskripsi singkat harus 10-500 karakter");
      return;
    }

    // Validate title length
    if (title.length < 3 || title.length > 255) {
      console.error("Title invalid length:", title.length);
      alert("Judul harus 3-255 karakter");
      return;
    }

    // Validate coordinates
    if (
      typeof locationLat === 'number' && 
      (locationLat < -90 || locationLat > 90)
    ) {
      console.error("Invalid latitude:", locationLat);
      alert("Latitude harus antara -90 dan 90");
      return;
    }

    if (
      typeof locationLng === 'number' && 
      (locationLng < -180 || locationLng > 180)
    ) {
      console.error("Invalid longitude:", locationLng);
      alert("Longitude harus antara -180 dan 180");
      return;
    }

    if (selectedFiles.length === 0 && !initialData) {
      console.error("No files selected for new destination");
      alert("Pilih minimal 1 gambar untuk destinasi baru.");
      return;
    }

    const destinationData: Omit<Destination, "id"> = {
      title,
      shortDescription,
      description,
      category,
      image: "", // akan diisi setelah upload
      location: {
        lat: Number(locationLat),
        lng: Number(locationLng),
      },
      gallery: [], // akan diisi setelah upload
    };

    console.log("Submitting destination data:", destinationData);

    // Kirim data + files ke parent (page)
    onSubmit({ destination: destinationData, files: selectedFiles.length > 0 ? selectedFiles : null });

    // Cleanup object URL setelah submit
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
  };

  // Cleanup URL saat modal ditutup
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-6"
                >
                  {initialData ? "Edit Destinasi" : "Tambah Destinasi Baru"}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      minLength={3}
                      maxLength={255}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      required
                      minLength={10}
                      maxLength={500}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Full Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={locationLat}
                          onChange={(e) =>
                            setLocationLat(
                              e.target.value ? parseFloat(e.target.value) : ""
                            )
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={locationLng}
                          onChange={(e) =>
                            setLocationLng(
                              e.target.value ? parseFloat(e.target.value) : ""
                            )
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {/* Map Preview */}
                    {mapUrl ? (
                      <div className="rounded-lg h-48 overflow-hidden border border-gray-300">
                        <iframe
                          title="Location Preview"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={mapUrl}
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center border border-gray-300">
                        <p className="text-gray-500 text-sm">
                          Enter coordinates to see map preview
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Gambar Destinasi{" "}
                        {initialData
                          ? "(kosongkan jika tidak ingin ganti)"
                          : `(max ${MAX_FILES} gambar)`}
                      </label>
                      
                      <div className="text-sm text-gray-500">
                        {selectedFiles.length} dari {MAX_FILES} gambar
                      </div>
                    </div>

                    {fileError && (
                      <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                        {fileError}
                      </div>
                    )}
                    
                    {/* Image Gallery */}
                    {selectedFiles.length > 0 && (
                      <div className="mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {previews.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className={`w-full h-32 object-cover rounded-lg border-2 ${
                                  index === 0 ? 'border-orange-500' : 'border-transparent'
                                }`}
                              />
                              {index === 0 && (
                                <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-md">
                                  Utama
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {selectedFiles.length > 1 && (
                          <div className="mt-2 text-xs text-gray-500">
                            * Gambar pertama akan menjadi gambar utama
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={clearAllFiles}
                          className="mt-3 text-sm text-red-600 hover:text-red-800"
                        >
                          Hapus semua gambar
                        </button>
                      </div>
                    )}
                    
                    {/* Add Photo Button */}
                    {selectedFiles.length < MAX_FILES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-orange-400 transition-colors"
                      >
                        <PlusIcon className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-600">
                          {selectedFiles.length === 0 
                            ? "Tambahkan gambar utama" 
                            : "Tambahkan gambar lainnya"}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          JPG, PNG · Max 5MB
                        </span>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                    >
                      {initialData ? "Update" : "Buat"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
