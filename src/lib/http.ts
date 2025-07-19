// src/lib/http.ts

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type HttpOptions = RequestInit & {
  query?: Record<string, string | number>;
};

export async function http<T>(
  url: string,
  options: HttpOptions = {}
): Promise<T> {
  let fullUrl = `${BASE_URL}${url}`;

  // Tambah query string kalau ada
  if (options.query) {
    const params = new URLSearchParams();
    for (const key in options.query) {
      params.append(key, String(options.query[key]));
    }
    fullUrl += `?${params.toString()}`;
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body:
      options.body && typeof options.body !== "string"
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
