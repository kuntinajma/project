import { useEffect, useState } from "react";
import { http } from "../lib/http";
import { CulturalContent } from "../types";

interface CultureResponse {
  success: boolean;
  data: {
    cultures: CulturalContent[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export type CultureQuery = {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
};

const defaultQuery: CultureQuery = {
  page: 1,
  limit: 15,
};

export default function useCulturalContents(
  query: CultureQuery = defaultQuery
) {
  const [cultures, setCultures] = useState<CulturalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const options = {
      method: "GET",
      query: query,
    };

    http<CultureResponse>("/culture", options)
      .then((res) => setCultures(res.data.cultures))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [query]);

  return { cultures, loading, error };
}
