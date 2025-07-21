import React, { useState, useEffect } from "react";
// import { destinations } from '../data/mockData';
import useDestinations from "../hooks/useDestinations";
import type { DestinationQuery } from "../hooks/useDestinations";
import { Destination } from "../types";
import DestinationCard from "../components/Destinations/DestinationCard";
import DestinationFilter from "../components/Destinations/DestinationFilter";
import DestinationDetail from "../components/Destinations/DestinationDetail";

interface DestinationsPageProps {
	onNavigate: (page: string) => void;
}

const DestinationsPage: React.FC<DestinationsPageProps> = ({ onNavigate }) => {
	const [prevDestinations, setPrevDestinations] = useState<Destination[]>([]);
	const [query, setQuery] = useState<DestinationQuery>({
		page: 1,
		limit: 10,
		category: undefined,
		search: "",
	});

	const { destinations, loading, error } = useDestinations(query);

	const [activeFilter, setActiveFilter] = useState("all");
	const [selectedDestination, setSelectedDestination] =
		useState<Destination | null>(null);
	const [search, setSearch] = useState("");

	const handleFilterChange = (category: string) => {
		setActiveFilter(category); // update UI active button
		setQuery((prev) => ({
			...prev,
			category: category === "all" ? undefined : category,
			page: 1, // reset page when filter changes
		}));
	};

	const handleViewDetails = (destination: Destination) => {
		setSelectedDestination(destination);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	useEffect(() => {
		if (destinations.length > 0) {
			setPrevDestinations(destinations);
		}
	}, [destinations]);

	useEffect(() => {
		if (search === query.search) return;

		const handler = setTimeout(() => {
			setQuery((prev) => ({
				...prev,
				search: search,
				page: 1,
			}));
		}, 400); // debounce delay (400ms)

		return () => {
			clearTimeout(handler); // cancel previous timeout on each keystroke
		};
	}, [query.search, search]);

	// using previous destinations while loading data
	const destinationList = loading ? prevDestinations : destinations;

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 mb-4">
							Failed to load destinations
						</h1>
						<p className="text-xl text-gray-600 max-w-3xl mx-auto">
							Failed to load destinations: {error.message}
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (selectedDestination) {
		return (<DestinationDetail
			destination={selectedDestination}
			onBack={() => setSelectedDestination(null)}
			onViewGallery={() => console.log("View gallery")}
			onGetDirections={() => console.log("Get directions")}
		/>)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="text-center mb-6">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						Discover Laiya Island
					</h1>

					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						From pristine beaches to cultural treasures, explore the diverse
						attractions that make Laiya Island a unique destination in South
						Sulawesi.
					</p>

					<div className="mt-6 flex flex-row items-center justify-center">
						<div className="md:w-1/3">
							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search destinations..."
								className="w-full px-4 py-2 border shadow-md rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
							/>
						</div>
					</div>
				</div>

				<DestinationFilter
					activeFilter={activeFilter}
					onFilterChange={handleFilterChange}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{destinationList.map((destination) => (
						<DestinationCard
							key={destination.id}
							destination={destination}
							onViewDetails={handleViewDetails}
              onViewDetailText="View Details"
						/>
					))}
				</div>

				{destinationList.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							No destinations found for the selected filter.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default DestinationsPage;
