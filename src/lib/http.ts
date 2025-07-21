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
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      body: finalBody,
    });

    data = await response.json();

    // ❌ Jika tidak OK, throw dengan bawa data
    if (!response.ok) {
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
      err.response = null;
    }
    throw err;
  }
}
