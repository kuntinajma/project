import { useState, useEffect } from "react";
import { Article } from "../types";

export interface ArticleQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const useArticles = (query: ArticleQuery = {}): UseArticlesReturn => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] =
    useState<UseArticlesReturn["pagination"]>();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (query.page) params.append("page", query.page.toString());
        if (query.limit) params.append("limit", query.limit.toString());
        if (query.search) params.append("search", query.search);
        if (query.category) params.append("category", query.category);
        if (query.status) params.append("status", query.status);

        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3005/api";
        const response = await fetch(
          `${API_BASE_URL}/articles?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch articles: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setArticles(data.data?.articles || []);
          if (data.data?.pagination) {
            setPagination(data.data.pagination);
          }
        } else {
          throw new Error(data.message || "Failed to fetch articles");
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [query.page, query.limit, query.search, query.category, query.status]);

  return {
    articles,
    loading,
    error,
    pagination,
  };
};

export default useArticles;
