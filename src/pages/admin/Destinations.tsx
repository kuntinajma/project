import React, { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { useDeleteDestination } from '../../hooks/useDeleteDestination';
import useDestinations from "../../hooks/useDestinations";
import { DestinationQuery } from "../../hooks/useDestinations";
import { Destination } from "../../types";
import DestinationModal from '../../components/Destinations/DestinationModal';
import DestinationTable from "../../components/Destinations/DestinationTable";
import DestinationDetail from '../../components/Destinations/DestinationDetail';

import { useAuth } from '../../context/AuthContext';


type DestinationAction =
	| { mode: "view"; destination: Destination }
	| { mode: "edit"; destination: Destination }
	| { mode: "none"; destination: undefined };



const Destinations: React.FC = () => {

	const { token } = useAuth();


	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null);
	const [filterCategory, setFilterCategory] = useState('all');
	const { toast, showToast, hideToast } = useToast();
	const [activeDestination, setActiveDestination] = useState<DestinationAction>({ mode: "none", destination: undefined });
	const [prevDestinations, setPrevDestinations] = useState<Destination[]>([]);
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState<DestinationQuery>({
		page: 1,
		limit: 10,
		category: undefined,
		search: "",
	});

	const { destinations, pagination, loading } = useDestinations(query);

	const { deleteDestination } = useDeleteDestination();

	const handleFilterChange = (category: string) => {
		setFilterCategory(category);
		setQuery((prev) => ({
			...prev,
			category: category === "all" ? undefined : category,
			page: 1, // reset page when filter changes
		}));
	};

	useEffect(() => {
		if (
			pagination?.currentPage &&
			pagination.currentPage !== query.page
		) {
			setQuery((prev) => ({
				...prev,
				page: pagination.currentPage,
			}));
		}
	}, [pagination?.currentPage]);


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


	useEffect(() => {
		if (destinations.length > 0) {
			setPrevDestinations(destinations);
		}
	}, [destinations]);

	// using previous destinations while loading data
	let destinationList = loading ? prevDestinations : destinations;

	const handleViewDetails = (destination: Destination) => {
		setActiveDestination({ mode: "view", destination });
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleAddDestination = () => {
		setActiveDestination({ mode: "none", destination: undefined });
		setIsModalOpen(true);
	};

	const handleEditDestination = (destination: Destination) => {
		setActiveDestination({ mode: "edit", destination });
		setIsModalOpen(true);
	};

	const handleCloseDetailOrEdit = () => {
		setIsModalOpen(false);
		setActiveDestination({ mode: "none", destination: undefined });
	};

	const handleDeleteDestination = (destination: Destination) => {
		setDestinationToDelete(destination);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteDestination = async () => {
		try {
			const res = await deleteDestination(destinationToDelete?.id ?? "", token ?? "");
			if (res.success) {
				// Force a re-fetch by triggering the hook again
				setQuery(prev => ({ ...prev }));
				console.log("Deleted!");
			}
		} catch (err) {
			console.error("Delete failed:", err);
		}
		setTimeout(() => {
			showToast('success', `Destinasi ${destinationToDelete?.title} berhasil dihapus`);
			setDestinationToDelete(null);
		}, 500);
	};

	const handleSave = (destination: Destination) => {
	}

	const handleSubmitDestination = (e: React.FormEvent) => {
		e.preventDefault();
		setTimeout(() => {
			const action = activeDestination.destination ? 'diperbarui' : 'dibuat';
			showToast('success', `Destinasi berhasil ${action}`);
			setIsModalOpen(false);
			handleCloseDetailOrEdit
		}, 500);
	};


	if (activeDestination.mode === "view") {
		return (
			<div className="bg-white p-4 shadow-md rounded-lg">
				<DestinationDetail
					destination={activeDestination.destination}
					onBack={handleCloseDetailOrEdit}
					onViewGallery={() => console.log("View gallery")}
					onGetDirections={() => console.log("Get directions")}
				/>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
					<p className="text-gray-600">Manage tourist destinations and attractions</p>
				</div>
				<button
					onClick={handleAddDestination}
					className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
				>
					<PlusIcon className="h-5 w-5" />
					<span>Add Destination</span>
				</button>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
					<div className="flex-1 max-w-md">
						<div className="relative">
							<MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search destinations..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
							/>
						</div>
					</div>

					<div className="flex items-center space-x-4">
						<select
							value={filterCategory}
							onChange={(e) => handleFilterChange(e.target.value)}
							className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
						>
							<option value="all">All Categories</option>
							<option value="beaches">Beaches</option>
							<option value="culture">Culture</option>
							<option value="nature">Nature</option>
							<option value="adventure">Adventure</option>
						</select>
					</div>
				</div>
			</div>

			<DestinationTable
				data={destinationList ?? []}
				page={query.page ?? 1}
				limit={query.limit ?? 10}
				total={pagination?.totalItems ?? 0}
				onQueryChange={(q) =>
					setQuery((prev) => ({
						...prev,
						...q,
					}))
				}
				onView={handleViewDetails}
				onEdit={handleEditDestination}
				onDelete={handleDeleteDestination}
			/>


			{/* Add/Edit Destination Modal */}

			if (activeDestination.mode === "edit") {
				<DestinationModal
					isOpen={isModalOpen}
					onClose={handleCloseDetailOrEdit}
					destination={activeDestination.destination ?? undefined}
					onSubmit={handleSave}
				/>
			}

			{/* Delete Confirmation Dialog */}
			<ConfirmDialog
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={confirmDeleteDestination}
				title="Hapus Destinasi"
				message={`Apakah Anda yakin ingin menghapus destinasi ${destinationToDelete?.title}? Tindakan ini tidak dapat dibatalkan.`}
				confirmText="Hapus"
				cancelText="Batal"
				type="danger"
			/>

			{/* Toast Notification */}
			{toast.show && (
				<Toast
					type={toast.type}
					message={toast.message}
					onClose={hideToast}
				/>
			)}
		</div>
	);
};

export default Destinations;
