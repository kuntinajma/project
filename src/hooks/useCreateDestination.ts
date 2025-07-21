// src/lib/createDestination.ts

import { http } from "../lib/http";
import { Destination } from "../types";

interface CreateDestinationResponse {
  success: boolean;
  message: string;
  data: Destination;
}

export async function createDestination(
  destination: Omit<Destination, "id">,
  token: string
): Promise<CreateDestinationResponse | null> {
  try {
    const response = await http<CreateDestinationResponse>("/destinations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: destination,
    });
    return response;
  } catch (err: any) {
    console.error("Create destination failed:", err);
    if (err.response) {
      return err.response as CreateDestinationResponse;
    }
    // Jika network error, throw atau return null
    console.error("Network error:", err);
    throw err;
  }
}
