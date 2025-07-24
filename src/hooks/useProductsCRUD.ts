import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description: string;
  material: string;
  durability: string;
  deliveryTime: string;
  msme_id: string;
  sellerInfo?: {
    brand: string;
    whatsapp?: string;
    shopee?: string;
    instagram?: string;
  };
  relatedProducts: string[];
}

interface CreateProductData {
  name: string;
  price: number;
  image?: string;
  description: string;
  material: string;
  durability: string;
  deliveryTime: string;
  msme_id: string;
  relatedProducts?: string[];
}

interface UpdateProductData extends CreateProductData {
  id: string;
}

interface UseProductsCRUDReturn {
  loading: boolean;
  error: string | null;
  createProduct: (
    data: CreateProductData,
    token: string
  ) => Promise<{ success: boolean; data?: Product; message?: string }>;
  updateProduct: (
    data: UpdateProductData,
    token: string
  ) => Promise<{ success: boolean; data?: Product; message?: string }>;
  deleteProduct: (
    id: string,
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const useProductsCRUD = (): UseProductsCRUDReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: CreateProductData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
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
        err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (data: UpdateProductData, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const { id, ...updateData } = data;
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
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
        err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string, token: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
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
        err instanceof Error ? err.message : "Failed to delete product";
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
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProductsCRUD;
