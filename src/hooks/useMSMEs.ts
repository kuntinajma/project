import { useState, useEffect } from "react";
import { MSME } from "./useMSMECRUD";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export interface MSMEQuery {
  page?: number;
  limit?: number;
  search?: string;
  user_id?: string;
}

interface MSMEPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UseMSMEsReturn {
  msmes: MSME[];
  loading: boolean;
  error: string | null;
  pagination?: MSMEPagination;
}

const useMSMEs = (query: MSMEQuery = {}): UseMSMEsReturn => {
  const [msmes, setMsmes] = useState<MSME[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<MSMEPagination>();

  useEffect(() => {
    const fetchMSMEs = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (query.page) params.append("page", query.page.toString());
        if (query.limit) params.append("limit", query.limit.toString());
        if (query.search) params.append("search", query.search);
        if (query.user_id) params.append("user_id", query.user_id);

        const response = await fetch(
          `${API_BASE_URL}/msme?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch MSMEs: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setMsmes(data.data?.msmes || []);
          if (data.data?.pagination) {
            setPagination(data.data.pagination);
          }
        } else {
          throw new Error(data.message || "Failed to fetch MSMEs");
        }
      } catch (err) {
        console.error("Error fetching MSMEs:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setMsmes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMSMEs();
  }, [query.page, query.limit, query.search, query.user_id]);

  return {
    msmes,
    loading,
    error,
    pagination,
  };
};

export default useMSMEs;
