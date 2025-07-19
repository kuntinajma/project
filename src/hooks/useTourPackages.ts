import { useEffect, useState } from "react";
import { http } from "../lib/http";
import { TourPackage } from "../types";

interface TourPackageResponse {
  success: boolean;
  data: {
    packages: TourPackage[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export type TourPackageQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

const defaultQuery: TourPackageQuery = {
  page: 1,
  limit: 10,
};

export default function useTourPackages(
  query: TourPackageQuery = defaultQuery
) {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);

    const options = {
      method: "GET",
      query: query,
    };

    http<TourPackageResponse>("/packages", options)
      .then((res) => setPackages(res.data.packages))
      .catch(setError)
      .finally(() => setLoading(false));
  }, [query]);

  return { packages, loading, error };
}
