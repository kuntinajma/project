import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useAuth } from "../../context/AuthContext";
import Toast from "../../components/common/Toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { useToast } from "../../hooks/useToast";
import useArticles, { ArticleQuery } from "../../hooks/useArticles";
import useArticlesCRUD from "../../hooks/useArticlesCRUD";
import { useUploadFiles } from "../../hooks/useUploadFiles";
import { Article } from "../../types";

const Articles: React.FC = () => {
  const { user, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [prevArticles, setPrevArticles] = useState<Article[]>([]);
  const { toast, showToast, hideToast } = useToast();

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "tips",
    status: "draft" as "draft" | "pending" | "published" | "rejected",
    isFeatured: false,
    tags: [] as string[],
    featuredImage: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // API state and queries
  const [query, setQuery] = useState<ArticleQuery>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
    category: undefined,
  });

  // Hooks for API operations
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
  } = useArticles(query);
  const {
    createArticle,
    updateArticle,
    deleteArticle,
    loading: crudLoading,
  } = useArticlesCRUD();
  const { uploadFiles, uploading: uploadLoading } = useUploadFiles();

  // Use previous data while loading
  useEffect(() => {
    if (articles.length > 0) {
      setPrevArticles(articles);
    }
  }, [articles]);

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

  // Update query when filters change
  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      status: filterStatus === "all" ? undefined : filterStatus,
      category: filterCategory === "all" ? undefined : filterCategory,
      page: 1,
    }));
  }, [filterStatus, filterCategory]);

  // Use previous data while loading
  const displayArticles = articlesLoading ? prevArticles : articles;

  // Filter articles based on user role
  const getFilteredArticles = () => {
    let filtered = displayArticles;

    // If contributor, only show their own articles
    if (user?.role === "contributor") {
      filtered = articles.filter((article) => article.authorName === user.name);
    }

    // Apply search and filters
    return filtered.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || article.status === filterStatus;
      const matchesCategory =
        filterCategory === "all" || article.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  };

  const filteredArticles = getFilteredArticles();

  const handleAddArticle = () => {
    setSelectedArticle(null);
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "tips",
      status: "draft" as "draft" | "pending" | "published" | "rejected",
      isFeatured: false,
      tags: [],
      featuredImage: "",
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      status: article.status,
      isFeatured: article.isFeatured,
      tags: article.tags,
      featuredImage: article.featuredImage,
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDeleteArticle = (article: any) => {
    setArticleToDelete(article);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete || !token) return;

    try {
      const result = await deleteArticle(articleToDelete.id, token);
      if (result.success) {
        showToast(
          "success",
          `Artikel ${articleToDelete.title} berhasil dihapus`
        );
        // Refresh articles list
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menghapus artikel");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("error", "Terjadi kesalahan saat menghapus artikel");
    } finally {
      setIsDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleSubmitArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      let featuredImage = formData.featuredImage;

      // Upload image if file is selected
      if (imageFile) {
        const fileList = new FileList();
        Object.defineProperty(fileList, "0", { value: imageFile });
        Object.defineProperty(fileList, "length", { value: 1 });

        const uploadedUrls = await uploadFiles(fileList);
        if (uploadedUrls.length > 0) {
          featuredImage = uploadedUrls[0];
        }
      }

      const articleData = {
        ...formData,
        featuredImage,
      };

      let result;
      if (selectedArticle) {
        result = await updateArticle(
          { ...articleData, id: selectedArticle.id },
          token
        );
      } else {
        result = await createArticle(articleData, token);
      }

      if (result.success) {
        const action = selectedArticle ? "diperbarui" : "dibuat";
        showToast("success", `Artikel berhasil ${action}`);
        setIsModalOpen(false);
        setSelectedArticle(null);
        setFormData({
          title: "",
          content: "",
          excerpt: "",
          category: "tips",
          status: "draft" as "draft" | "pending" | "published",
          isFeatured: false,
          tags: [],
          featuredImage: "",
        });
        setImageFile(null);
        // Refresh articles list
        setQuery((prev) => ({ ...prev }));
      } else {
        showToast("error", result.message || "Gagal menyimpan artikel");
      }
    } catch (error) {
      console.error("Submit error:", error);
      showToast("error", "Terjadi kesalahan saat menyimpan artikel");
    }
  };

  const handleApproveArticle = (article: any) => {
    showToast("success", `Artikel ${article.title} berhasil disetujui`);
  };

  const handleRejectArticle = (article: any) => {
    showToast("error", `Artikel ${article.title} ditolak`);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tips":
        return "bg-blue-100 text-blue-800";
      case "tourism":
        return "bg-green-100 text-green-800";
      case "culture":
        return "bg-purple-100 text-purple-800";
      case "msmes":
        return "bg-orange-100 text-orange-800";
      case "environment":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canApproveReject =
    user?.role === "admin" || user?.role === "superadmin";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === "contributor"
              ? "My Articles"
              : "Articles Management"}
          </h1>
          <p className="text-gray-600">
            {user?.role === "contributor"
              ? "Write and manage your travel articles"
              : "Manage and moderate travel articles"}
          </p>
        </div>
        <button
          onClick={handleAddArticle}
          className="flex items-center px-4 py-2 space-x-2 text-white bg-orange-600 rounded-lg transition-colors hover:bg-orange-700"
        >
          <PlusIcon className="w-5 h-5" />
          <span>
            {user?.role === "contributor" ? "Write Article" : "Add Article"}
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="tips">Tips</option>
              <option value="tourism">Tourism</option>
              <option value="culture">Culture</option>
              <option value="msmes">MSMEs</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <div key={article.id} className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2 space-x-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {article.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      article.status
                    )}`}
                  >
                    {article.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(
                      article.category
                    )}`}
                  >
                    {article.category}
                  </span>
                </div>

                <p className="mb-3 text-gray-600">{article.excerpt}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {article.authorName}</span>
                  <span>•</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{article.viewCount} views</span>
                </div>
              </div>

              <div className="flex items-center ml-4 space-x-2">
                {canApproveReject && article.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApproveArticle(article)}
                      className="p-2 text-green-600 hover:text-green-700"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRejectArticle(article)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button className="p-2 text-blue-600 hover:text-blue-700">
                  <EyeIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEditArticle(article)}
                  className="p-2 text-green-600 hover:text-green-700"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                {(user?.role === "contributor" &&
                  article.authorName === user.name) ||
                user?.role === "admin" ||
                user?.role === "superadmin" ? (
                  <button
                    onClick={() => handleDeleteArticle(article)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Article Modal */}
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                  <Dialog.Title
                    as="h3"
                    className="mb-4 text-lg font-medium leading-6 text-gray-900"
                  >
                    {selectedArticle ? "Edit Article" : "Write New Article"}
                  </Dialog.Title>

                  <form onSubmit={handleSubmitArticle} className="space-y-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleFormChange("title", e.target.value)
                        }
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) =>
                            handleFormChange("category", e.target.value)
                          }
                          className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="tips">Tips</option>
                          <option value="tourism">Tourism</option>
                          <option value="culture">Culture</option>
                          <option value="msmes">MSMEs</option>
                          <option value="environment">Environment</option>
                        </select>
                      </div>

                      {(user?.role === "admin" ||
                        user?.role === "superadmin") && (
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              handleFormChange("status", e.target.value)
                            }
                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="draft">Draft</option>
                            <option value="pending">Pending Review</option>
                            <option value="published">Published</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Excerpt
                      </label>
                      <textarea
                        rows={2}
                        value={formData.excerpt}
                        onChange={(e) =>
                          handleFormChange("excerpt", e.target.value)
                        }
                        placeholder="Brief description of your article..."
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Content
                      </label>
                      <textarea
                        rows={12}
                        value={formData.content}
                        onChange={(e) =>
                          handleFormChange("content", e.target.value)
                        }
                        placeholder="Write your article content here..."
                        className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Featured Image URL
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="flex justify-center items-center w-20 h-20 bg-gray-200 rounded-lg">
                          <PhotoIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <input
                            type="url"
                            value={formData.featuredImage}
                            onChange={(e) =>
                              handleFormChange("featuredImage", e.target.value)
                            }
                            placeholder="Enter image URL or upload file below"
                            className="px-3 py-2 mb-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              setImageFile(e.target.files?.[0] || null)
                            }
                            className="px-3 py-2 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            JPG, PNG, or GIF. Max size 5MB. File upload will
                            override URL.
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
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        Save as Draft
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        {user?.role === "contributor"
                          ? "Submit for Review"
                          : "Publish"}
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
        onConfirm={confirmDeleteArticle}
        title="Hapus Artikel"
        message={`Apakah Anda yakin ingin menghapus artikel ${articleToDelete?.title}? Tindakan ini tidak dapat dibatalkan.`}
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

export default Articles;
