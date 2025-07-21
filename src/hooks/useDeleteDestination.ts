// src/hooks/useDeleteDestination.ts

import { useCallback } from "react";
import { http } from "../lib/http";

export function useDeleteDestination() {
  const deleteDestination = useCallback(async (id: string, token: string) => {
    return http<{
      success: boolean;
      message: string;
    }>(`/destinations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, []);

  return {
    deleteDestination,
  };
}
