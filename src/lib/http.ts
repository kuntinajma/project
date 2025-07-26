// src/lib/http.ts

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type HttpOptions = Omit<RequestInit, "body"> & {
  query?: Record<string, string | number>;
  body?: BodyInit | object;
};

export async function http<T>(
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  let fullUrl = `${BASE_URL}${url}`;

  // Handle query string
  if (options.query) {
    const params = new URLSearchParams();
    for (const key in options.query) {
      params.append(key, String(options.query[key]));
    }
    fullUrl += `?${params.toString()}`;
  }

  // Extract body & query
  const { query: _, body, ...fetchOptions } = options;

  // Normalisasi headers
  const headers: { [key: string]: string } = {};

  if (fetchOptions.headers) {
    if (fetchOptions.headers instanceof Headers) {
      fetchOptions.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
      });
    } else if (Array.isArray(fetchOptions.headers)) {
      const arr = fetchOptions.headers as (string | unknown)[];
      for (let i = 0; i < arr.length - 1; i += 2) {
        const name = arr[i];
        const value = arr[i + 1];
        if (typeof name === "string" && typeof value === "string") {
          headers[name.toLowerCase()] = value;
        }
      }
    } else {
      const headerObj = fetchOptions.headers as Record<string, string>;
      Object.keys(headerObj).forEach((key) => {
        const value = headerObj[key];
        if (typeof value === "string") {
          headers[key.toLowerCase()] = value;
        }
      });
    }
  }

  // Set default Content-Type jika bukan FormData
  if (!headers["content-type"] && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add authentication token if available and not already set
  if (!headers["authorization"]) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("Adding token from localStorage to request");
    }
  } else {
    console.log("Authorization header already set in request");
  }

  // Handle body
  let finalBody: BodyInit | undefined;
  if (body !== undefined) {
    if (body instanceof FormData) {
      finalBody = body;
      delete headers["content-type"];
    } else if (typeof body === "object") {
      finalBody = JSON.stringify(body);
    } else {
      finalBody = body;
    }
  }

  let data: T;

  try {
    console.log(`Making ${fetchOptions.method || "GET"} request to ${fullUrl}`);

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      body: finalBody,
    });

    // Special handling for DELETE requests that might return empty body
    if (fetchOptions.method === 'DELETE' && response.status === 204) {
      console.log('DELETE request successful with no content');
      return { success: true, message: 'Resource deleted successfully' } as T;
    }

    // Try to parse JSON response
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      // If it's a DELETE request and we can't parse JSON but status is OK, return success
      if (fetchOptions.method === 'DELETE' && response.ok) {
        return { success: true, message: 'Resource deleted successfully' } as T;
      }
      
      // For other requests or non-OK status, handle as error
      const error: any = new Error('Invalid JSON response');
      error.status = response.status;
      error.response = { success: false, message: 'Server returned invalid JSON' };
      throw error;
    }

    // ❌ Jika tidak OK, throw dengan bawa data
    if (!response.ok) {
      console.error(`HTTP error ${response.status}: ${JSON.stringify(data)}`);
      const error: any = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (err: any) {
    // Re-throw tapi pastikan error punya .response
    if (err.name === "SyntaxError") {
      err.message = "Network error or invalid JSON";
      err.response = { success: false, message: "Network error or invalid JSON response" };
    } else if (!err.response) {
      err.response = { 
        success: false, 
        message: err.message || "Network error occurred" 
      };
    }
    throw err;
  }
}
