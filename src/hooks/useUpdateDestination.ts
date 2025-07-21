import { http } from "../lib/http";
import { Destination } from "../types";

export interface UpdateDestinationResponse {
  success: boolean;
  message: string;
  data?: Destination;
  errors?: any;
}

export async function updateDestination(
  id: string,
  destination: Omit<Destination, "id">,
  token: string
): Promise<UpdateDestinationResponse | null> {
  try {
    const res = await http<UpdateDestinationResponse>(`/destinations/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: destination,
    });
    return res;
  } catch (err: any) {
    if (err.response) {
      return err.response as UpdateDestinationResponse;
    }
    console.error("Network error during update:", err);
    return null;
  }
}
