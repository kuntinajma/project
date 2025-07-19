import { useEffect, useState } from "react";
import { http } from "../lib/http";
import { MSMEProduct } from "../types";

interface MsmeProductResponse {
  success: boolean;
  data: {
    products: MSMEProduct[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export type MSMEProductQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

const defaultQuery: MSMEProductQuery = {
  page: 1,
  limit: 15,
};

export default function useMSMEProducts(
  query: MSMEProductQuery = defaultQuery
) {
  const [msmeProducts, setMsmeProducts] = useState<MSMEProduct[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const options = {
      method: "GET",
      query: query,
    };

    http<MsmeProductResponse>("/products", options)
      .then((res) => setMsmeProducts(res.data.products))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [query]);

  return { msmeProducts, loading, error };
}
