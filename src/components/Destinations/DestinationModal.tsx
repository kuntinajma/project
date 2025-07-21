import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Destination } from "../../types";

// Props baru: terima data awal, kirim form + files ke parent
interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    destination: Omit<Destination, "id">;
    files: FileList | null;
  }) => void;
  initialData?: Destination; // untuk edit mode
}

const categoryOptions = ["beaches", "culture", "nature", "adventure"] as const;

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

  // File upload state
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

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

  const resetForm = () => {
    setTitle("");
    setShortDescription("");
    setDescription("");
    setCategory("nature");
    setLocationLat("");
    setLocationLng("");
    setFiles(null);
    setPreviews([]);
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    if (selectedFiles) {
      const urls = Array.from(selectedFiles).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(urls);
    }
  };

  // Remove preview
  const removePreview = () => {
    setPreviews([]);
    setFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title ||
      !shortDescription ||
      !category ||
      !locationLat ||
      !locationLng
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    if (!files && !initialData) {
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

    // Kirim data + files ke parent (page)
    onSubmit({ destination: destinationData, files });

    // Cleanup object URL setelah submit
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

                  {/* Featured Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gambar Utama{" "}
                      {initialData
                        ? "(kosongkan jika tidak ingin ganti)"
                        : "(max 5 file)"}
                    </label>

                    {previews.length > 0 ? (
                      <div className="relative">
                        <img
                          src={previews[0]}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removePreview}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 cursor-pointer transition-colors"
                      >
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Klik untuk pilih gambar (maks 5 file)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG · Max 5MB
                        </p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
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
