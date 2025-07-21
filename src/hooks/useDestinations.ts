import { useEffect, useState } from "react";
import { http } from "../lib/http";
import { Destination } from "../types";

interface DestinationResponse {
	success: boolean;
	data: {
		destinations: Destination[];
		pagination: {
			currentPage: number;
			totalPages: number;
			totalItems: number;
			itemsPerPage: number;
		};
	};
}

export type DestinationQuery = {
	page?: number;
	limit?: number;
	category?: string;
	search?: string;
};

const defaultQuery: DestinationQuery = {
	page: 1,
	limit: 15,
};

export default function useDestinations(
	query: DestinationQuery = defaultQuery
) {
	const [result, setResult] = useState<DestinationResponse | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		setLoading(true);

		const options = {
			method: "GET",
			query: query,
		};

		http<DestinationResponse>("/destinations", options)
			.then((res) => setResult(res))
			.catch(setError)
			.finally(() => setLoading(false));
	}, [query]);

	return {
		destinations: result?.data.destinations ?? [],
		pagination: result?.data.pagination,
		loading: loading,
		error: error
	};
}
