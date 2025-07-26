import { useState } from "react";
import { TourPackage } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface CreateTourPackageData {
  name: string;
  price: number;
  facilities: string[];
  duration: string;
  minPersons: number;
  maxPersons?: number;
  description: string;
  image?: string;
  popular?: boolean;
  whatsappContact: string;
}

interface UpdateTourPackageData extends CreateTourPackageData {
  id: string;
}

interface UseTourPackagesCRUDReturn {
  loading: boolean;
  error: string | null;
  createTourPackage: (
    data: CreateTourPackageData,
    token: string
  ) => Promise<{ success: boolean; data?: TourPackage; message?: string }>;
  updateTourPackage: (
    data: UpdateTourPackageData,
    token: string
  ) => Promise<{ success: boolean; data?: TourPackage; message?: string }>;
  deleteTourPackage: (
    id: string,
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useTourPackagesCRUD = (): UseTourPackagesCRUDReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTourPackage = async (
    data: CreateTourPackageData,
    token: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/packages`, {
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
        err instanceof Error ? err.message : "Failed to create tour package";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateTourPackage = async (
    data: UpdateTourPackageData,
    token: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
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
        err instanceof Error ? err.message : "Failed to update tour package";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteTourPackage = async (id: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
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
        err instanceof Error ? err.message : "Failed to delete tour package";
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
    createTourPackage,
    updateTourPackage,
    deleteTourPackage,
  };
};

export default useTourPackagesCRUD;
