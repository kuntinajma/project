// src/hooks/useDeleteDestination.ts

import { useCallback } from "react";
import { http } from "../lib/http";

export function useDeleteDestination() {
  const deleteDestination = useCallback(async (id: string, token: string) => {
    try {
      console.log(`Attempting to delete destination with ID: ${id}`);
      
      if (!id) {
        console.error("No destination ID provided");
        return {
          success: false,
          message: "No destination ID provided"
        };
      }
      
      if (!token) {
        console.error("No authentication token provided");
        return {
          success: false,
          message: "Authentication token is missing"
        };
      }
      
      // Make the API call
      const response = await http<{
        success: boolean;
        message: string;
      }>(`/destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("Delete destination response:", response);
      return response;
    } catch (err: any) {
      console.error("Delete destination failed:", err);
      
      // Check if we have a structured error response
      if (err.response) {
        console.log("Error response data:", err.response);
        return err.response;
      }
      
      // Return a standardized error object
      return {
        success: false,
        message: err instanceof Error ? err.message : "Failed to delete destination"
      };
    }
  }, []);

  return {
    deleteDestination,
  };
}
