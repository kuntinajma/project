import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api";

export interface MSME {
  id: string;
  brand: string;
  description: string;
  phone: string;
  instagram?: string;
  shopee?: string;
  whatsapp?: string;
  user_id: string;
}

interface CreateMSMEData {
  brand: string;
  description: string;
  phone: string;
  instagram?: string;
  shopee?: string;
  whatsapp?: string;
}

interface UpdateMSMEData extends CreateMSMEData {
  id: string;
}

interface UseMSMECRUDReturn {
  loading: boolean;
  error: string | null;
  createMSME: (
    data: CreateMSMEData,
    token: string
  ) => Promise<{ success: boolean; data?: MSME; message?: string }>;
  updateMSME: (
    data: UpdateMSMEData,
    token: string
  ) => Promise<{ success: boolean; data?: MSME; message?: string }>;
  deleteMSME: (
    id: string,
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useMSMECRUD = (): UseMSMECRUDReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMSME = async (data: CreateMSMEData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/msme`, {
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
        err instanceof Error ? err.message : "Failed to create MSME";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateMSME = async (data: UpdateMSMEData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${API_BASE_URL}/msme/${id}`, {
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
        err instanceof Error ? err.message : "Failed to update MSME";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteMSME = async (id: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/msme/${id}`, {
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
        err instanceof Error ? err.message : "Failed to delete MSME";
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
    createMSME,
    updateMSME,
    deleteMSME,
  };
};

export default useMSMECRUD;
