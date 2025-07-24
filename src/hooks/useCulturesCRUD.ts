import { useState } from "react";
import { CulturalContent } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api";

interface CreateCultureData {
  title: string;
  description: string;
  image: string;
  category: "dance" | "culinary" | "customs" | "wisdom";
  gallery?: string[];
  videos?: string[];
}

interface UpdateCultureData extends CreateCultureData {
  id: string;
}

interface UseCulturesCRUDReturn {
  loading: boolean;
  error: string | null;
  createCulture: (
    data: CreateCultureData,
    token: string
  ) => Promise<{ success: boolean; data?: CulturalContent; message?: string }>;
  updateCulture: (
    data: UpdateCultureData,
    token: string
  ) => Promise<{ success: boolean; data?: CulturalContent; message?: string }>;
  deleteCulture: (
    id: string,
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useCulturesCRUD = (): UseCulturesCRUDReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCulture = async (data: CreateCultureData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/culture`, {
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
        err instanceof Error ? err.message : "Failed to create culture";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateCulture = async (data: UpdateCultureData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${API_BASE_URL}/culture/${id}`, {
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
        err instanceof Error ? err.message : "Failed to update culture";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteCulture = async (id: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/culture/${id}`, {
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
        err instanceof Error ? err.message : "Failed to delete culture";
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
    createCulture,
    updateCulture,
    deleteCulture,
  };
};

export default useCulturesCRUD;
