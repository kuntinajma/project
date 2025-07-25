import { useEffect, useState } from "react";
import { http } from "../lib/http";
import { Transportation } from "../types";

interface TransportationResponse {
  success: boolean;
  data: {
    transportations: Transportation[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export type TransportationQuery = {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
};

const defaultQuery: TransportationQuery = {
  page: 1,
  limit: 15,
};

export default function useTransportation(
  query: TransportationQuery = defaultQuery
) {
  const [result, setResult] = useState<TransportationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    // Create a safe query object without undefined values that could cause errors
    const safeQuery = { ...query };
    
    // Remove undefined type to prevent errors if the column doesn't exist yet
    if (safeQuery.type === undefined) {
      delete safeQuery.type;
    }

    const options = {
      method: "GET",
      query: safeQuery,
    };

    http<TransportationResponse>("/transportation", options)
      .then((res) => setResult(res))
      .catch((err) => {
        console.error("Transportation fetch error:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, [query]);

  return {
    transportations: result?.data.transportations ?? [],
    pagination: result?.data.pagination,
    loading,
    error
  };
}