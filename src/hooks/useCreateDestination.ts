// src/lib/createDestination.ts

import { http } from "../lib/http";
import { Destination } from "../types";

interface ValidationError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

interface CreateDestinationResponse {
  success: boolean;
  message: string;
  data?: Destination;
  errors?: ValidationError[];
}

export async function createDestination(
  destination: Omit<Destination, "id">,
  token: string
): Promise<CreateDestinationResponse> {
  try {
    console.log("Creating destination with token:", token?.substring(0, 10) + "...");
    
    if (!token) {
      console.error("No token provided for createDestination");
      return {
        success: false,
        message: "Authentication token is missing"
      };
    }
    
    // Validate destination data before sending
    const validationErrors = validateDestination(destination);
    if (validationErrors.length > 0) {
      console.error("Client-side validation errors:", validationErrors);
      return {
        success: false,
        message: "Validation failed",
        errors: validationErrors.map(err => ({
          value: "",
          msg: err.message,
          param: err.field,
          location: "client"
        }))
      };
    }
    
    const response = await http<CreateDestinationResponse>("/destinations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: destination,
    });
    
    console.log("Create destination response:", response);
    return response;
  } catch (err: any) {
    console.error("Create destination failed:", err);
    if (err.response) {
      console.log("Error response data:", err.response);
      return err.response as CreateDestinationResponse;
    }
    // Jika network error, throw atau return null
    console.error("Network error:", err);
    return {
      success: false,
      message: err.message || "Network error occurred"
    };
  }
}

// Client-side validation to catch errors before sending to server
interface ValidationResult {
  field: string;
  message: string;
}

function validateDestination(destination: Omit<Destination, "id">): ValidationResult[] {
  const errors: ValidationResult[] = [];
  
  // Title validation
  if (!destination.title) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (destination.title.length < 3 || destination.title.length > 255) {
    errors.push({ field: "title", message: "Title must be between 3-255 characters" });
  }
  
  // Short description validation
  if (!destination.shortDescription) {
    errors.push({ field: "shortDescription", message: "Short description is required" });
  } else if (destination.shortDescription.length < 10 || destination.shortDescription.length > 500) {
    errors.push({ field: "shortDescription", message: "Short description must be between 10-500 characters" });
  }
  
  // Description validation (optional but has min length)
  if (destination.description && destination.description.length < 50) {
    errors.push({ field: "description", message: "Description must be at least 50 characters" });
  }
  
  // Category validation
  const validCategories = ["beaches", "culture", "nature", "adventure"];
  if (!validCategories.includes(destination.category)) {
    errors.push({ field: "category", message: "Invalid category" });
  }
  
  // Location validation
  if (!destination.location) {
    errors.push({ field: "location", message: "Location is required" });
  } else {
    const { lat, lng } = destination.location;
    if (typeof lat !== 'number' || isNaN(lat)) {
      errors.push({ field: "location.lat", message: "Latitude must be a number" });
    } else if (lat < -90 || lat > 90) {
      errors.push({ field: "location.lat", message: "Latitude must be between -90 and 90" });
    }
    
    if (typeof lng !== 'number' || isNaN(lng)) {
      errors.push({ field: "location.lng", message: "Longitude must be a number" });
    } else if (lng < -180 || lng > 180) {
      errors.push({ field: "location.lng", message: "Longitude must be between -180 and 180" });
    }
  }
  
  return errors;
}
