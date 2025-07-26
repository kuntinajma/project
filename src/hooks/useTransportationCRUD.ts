import { useCallback } from "react";
import { http } from "../lib/http";
import { Transportation } from "../types";

interface TransportationResponse {
  success: boolean;
  message: string;
  data?: Transportation;
  errors?: any[];
}

export function useTransportationCRUD() {
  // Create a new transportation
  const createTransportation = useCallback(async (
    transportation: Omit<Transportation, "id">,
    token: string
  ): Promise<TransportationResponse> => {
    try {
      const response = await http<TransportationResponse>("/transportation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: transportation,
      });
      
      return response;
    } catch (err: any) {
      console.error("Create transportation failed:", err);
      if (err.response) {
        return err.response;
      }
      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to create transportation"
      };
    }
  }, []);

  // Update an existing transportation
  const updateTransportation = useCallback(async (
    id: string | number,
    transportation: Partial<Transportation>,
    token: string
  ): Promise<TransportationResponse> => {
    try {
      const response = await http<TransportationResponse>(`/transportation/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: transportation,
      });
      
      return response;
    } catch (err: any) {
      console.error("Update transportation failed:", err);
      if (err.response) {
        return err.response;
      }
      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to update transportation"
      };
    }
  }, []);

  // Delete a transportation
  const deleteTransportation = useCallback(async (
    id: string | number,
    token: string
  ): Promise<TransportationResponse> => {
    try {
      const response = await http<TransportationResponse>(`/transportation/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response;
    } catch (err: any) {
      console.error("Delete transportation failed:", err);
      if (err.response) {
        return err.response;
      }
      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to delete transportation"
      };
    }
  }, []);

  // Toggle transportation status
  const toggleTransportationStatus = useCallback(async (
    id: string | number,
    status: 'active' | 'inactive',
    token: string
  ): Promise<TransportationResponse> => {
    try {
      const response = await http<TransportationResponse>(`/transportation/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: { status },
      });
      
      return response;
    } catch (err: any) {
      console.error("Toggle transportation status failed:", err);
      if (err.response) {
        return err.response;
      }
      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to update transportation status"
      };
    }
  }, []);

  return {
    createTransportation,
    updateTransportation,
    deleteTransportation,
    toggleTransportationStatus,
  };
}