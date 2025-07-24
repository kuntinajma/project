import React, { useState, useEffect, Fragment } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../context/AuthContext";
import useMSMEProducts, { MSMEProductQuery } from "../../hooks/useMSMEProducts";
import useProductsCRUD, { Product } from "../../hooks/useProductsCRUD";
import useMSMEs from "../../hooks/useMSMEs";
import { useUploadFiles } from "../../hooks/useUploadFiles";

const Products: React.FC = () => {
  const { user, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [prevProducts, setPrevProducts] = useState<Product[]>([]);
  const { toast, showToast, hideToast } = useToast();

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    description: "",
    material: "",
    durability: "",
    deliveryTime: "",
    msme_id: "",
    relatedProducts: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // API state and queries
  const [query, setQuery] = useState<MSMEProductQuery>({
    page: 1,
    limit: 12,
    search: "",
    // Don't filter by user MSMEs initially - show all products for admin
  });

  // Hooks for API operations
  const {
    msmeProducts: products,
    loading: productsLoading,
    error: productsError,
  } = useMSMEProducts(query);
  const {
    createProduct,
    updateProduct,
    deleteProduct,
    loading: crudLoading,
  } = useProductsCRUD();
  const { uploadFiles, uploading: uploadLoading } = useUploadFiles();

  // Get MSMEs for the dropdown
  const { msmes } = useMSMEs({
    limit: 100,
    user_id: user?.role === "super_admin" ? undefined : user?.id?.toString(),
  });

  // Use previous data while loading
  useEffect(() => {
    if (products.length > 0) {
      setPrevProducts(products);
    }
  }, [products]);

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

  // Use previous data while loading to prevent UI flicker
  const displayProducts = productsLoading ? prevProducts : products;

  const handleAddProduct = () => {
    // Check if user has any MSMEs before allowing product creation
    if (msmes.length === 0) {
      showToast(
        "error",
        "Anda harus membuat MSME terlebih dahulu sebelum menambahkan produk"
      );
      return;
    }

    setSelectedProduct(null);
    setFormData({
      name: "",
      price: 0,
      image: "",
      description: "",
      material: "",
      durability: "",
      deliveryTime: "",
      msme_id: "",
      relatedProducts: [],
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image || "",
      description: product.description,
      material: product.material,
      durability: product.durability,
      deliveryTime: product.deliveryTime,
      msme_id: product.msme_id,
      relatedProducts: product.relatedProducts || [],
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete || !token) return;

    try {
      const result = await deleteProduct(productToDelete.id, token);
      if (result.success) {
        showToast(
          "success",
          `Product ${productToDelete.name} berhasil dihapus`
        );
        // Refresh products list by creating a new query object to trigger the hook
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menghapus product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Terjadi kesalahan saat menghapus product");
    } finally {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!formData.msme_id) {
      showToast("error", "Pilih MSME terlebih dahulu");
      return;
    }

    try {
      let image = formData.image;

      if (imageFile) {
        // Since useUploadFiles expects a FileList, we create one
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFile);
        const fileList = dataTransfer.files;

        const uploadedUrls = await uploadFiles(fileList);
        if (uploadedUrls.length > 0) {
          image = uploadedUrls[0];
        }
      }

      const productData = { ...formData, image };

      let result;
      if (selectedProduct) {
        result = await updateProduct(
          { ...productData, id: selectedProduct.id },
          token
        );
      } else {
        result = await createProduct(productData, token);
      }

      if (result.success) {
        const action = selectedProduct ? "diperbarui" : "dibuat";
        showToast("success", `Product berhasil ${action}`);
        setIsModalOpen(false);
        // Refresh products list
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menyimpan product");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("error", "Terjadi kesalahan saat menyimpan product");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600">
            Manage your UMKM products and inventory
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          disabled={msmes.length === 0}
          className={`flex items-center px-4 py-2 space-x-2 rounded-lg transition-colors ${
            msmes.length === 0
              ? "text-gray-400 bg-gray-300 cursor-not-allowed"
              : "text-white bg-orange-600 hover:bg-orange-700"
          }`}
          title={msmes.length === 0 ? "Buat MSME terlebih dahulu" : ""}
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {productsLoading && prevProducts.length === 0 && (
        <div className="py-8 text-center">
          <div className="inline-block w-8 h-8 rounded-full border-b-2 border-orange-600 animate-spin"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {productsError && (
        <div className="p-4 mb-6 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600">Error: {productsError?.message}</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayProducts.map((product: Product) => (
          <div
            key={product.id}
            className="overflow-hidden bg-white rounded-lg shadow-md"
          >
            <img
              src={
                product.image ||
                "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300"
              }
              alt={product.name}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                {product.description}
              </p>

              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">MSME:</span>
                  <span className="font-medium text-gray-900">
                    {product.sellerInfo?.brand || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium text-gray-900">
                    {product.material}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="font-medium text-gray-900">
                    {product.deliveryTime}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="flex justify-center items-center px-3 py-1 text-orange-600 rounded border border-orange-600 hover:bg-orange-50"
                >
                  <PencilIcon className="inline mr-1 w-4 h-4" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product)}
                  className="flex justify-center items-center px-3 py-1 text-red-600 rounded border border-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="inline mr-1 w-4 h-4" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!productsLoading && displayProducts.length === 0 && (
        <div className="py-12 text-center">
          <CubeIcon className="mx-auto mb-4 w-16 h-16 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No products found
          </h3>
          <p className="mb-4 text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms."
              : "Get started by adding your first product."}
          </p>
          {!searchTerm && (
            <button
              onClick={handleAddProduct}
              className="inline-flex items-center px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
            >
              <PlusIcon className="mr-2 w-5 h-5" />
              Add First Product
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
                    {selectedProduct ? "Edit Product" : "Add New Product"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmitProduct} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        MSME *
                      </label>
                      <select
                        required
                        value={formData.msme_id}
                        onChange={(e) =>
                          handleFormChange("msme_id", e.target.value)
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select MSME</option>
                        {msmes.map((msme) => (
                          <option key={msme.id} value={msme.id}>
                            {msme.brand}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        rows={3}
                        required
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
                          Price (IDR) *
                        </label>
                        <input
                          type="number"
                          required
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
                          Delivery Time *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.deliveryTime}
                          onChange={(e) =>
                            handleFormChange("deliveryTime", e.target.value)
                          }
                          placeholder="e.g., 3-5 working days"
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Material *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.material}
                        onChange={(e) =>
                          handleFormChange("material", e.target.value)
                        }
                        placeholder="e.g., Coconut shell, natural fiber"
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Durability *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.durability}
                        onChange={(e) =>
                          handleFormChange("durability", e.target.value)
                        }
                        placeholder="e.g., 5+ years with proper care"
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Product Image
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
                        disabled={crudLoading || uploadLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50"
                      >
                        {crudLoading || uploadLoading
                          ? "Saving..."
                          : selectedProduct
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
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
};

export default Products;