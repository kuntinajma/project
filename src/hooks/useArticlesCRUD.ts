import { useState } from "react";
import { Article } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api";

interface CreateArticleData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  featuredImage?: string;
  status?: "draft" | "pending" | "published" | "rejected";
  isFeatured?: boolean;
  tags?: string[];
}

interface UpdateArticleData extends CreateArticleData {
  id: string;
}

interface UseArticlesCRUDReturn {
  loading: boolean;
  error: string | null;
  createArticle: (
    data: CreateArticleData,
    token: string
  ) => Promise<{ success: boolean; data?: Article; message?: string }>;
  updateArticle: (
    data: UpdateArticleData,
    token: string
  ) => Promise<{ success: boolean; data?: Article; message?: string }>;
  deleteArticle: (
    id: string,
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useArticlesCRUD = (): UseArticlesCRUDReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createArticle = async (data: CreateArticleData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create article";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = async (data: UpdateArticleData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update article";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteArticle = async (id: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete article";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

export default useArticlesCRUD;
