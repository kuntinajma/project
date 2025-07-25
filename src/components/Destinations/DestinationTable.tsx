import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Destination } from "../../types";
import { DestinationQuery } from "../../hooks/useDestinations";
import { MapPin, Eye, Edit, Trash2, Map } from "lucide-react";

interface Props {
	data: Destination[];
	page: number;
	limit: number;
	total: number;
	onQueryChange: (query: Partial<DestinationQuery>) => void;

	onView: (destination: Destination) => void;
	onEdit: (destination: Destination) => void;
	onDelete: (destination: Destination) => void;
}

export default function DestinationTable({
	data,
	page,
	limit,
	total,
	onQueryChange,
	onView,
	onEdit,
	onDelete,
}: Props) {
	const handleViewOnMap = (destination: Destination) => {
		const { lat, lng } = destination.location;
		const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
		window.open(mapUrl, "_blank");
	};

	const columns = useMemo<ColumnDef<Destination>[]>(
		() => [
			{
				header: "Title",
				accessorKey: "title",
			},
			{
				header: "Category",
				accessorKey: "category",
				cell: ({ row }) => {
					const category = row.original.category;
					return (
						<span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
							{category}
						</span>
					);
				},
			},
			{
				header: "Location",
				accessorKey: "location",
				cell: ({ row }) => {
					const { lat, lng } = row.original.location;
					return (
						<div className="flex items-center space-x-1">
							<MapPin className="h-4 w-4 text-orange-600" />
							<span className="text-sm">
								{lat.toFixed(4)}, {lng.toFixed(4)}
							</span>
						</div>
					);
				},
			},
			{
				header: "Description",
				accessorKey: "shortDescription",
				cell: ({ row }) => {
					const desc = row.original.shortDescription;
					return (
						<div className="max-w-xs truncate" title={desc}>
							{desc}
						</div>
					);
				},
			},
			{
				header: "Actions",
				cell: ({ row }) => {
					const destination = row.original;
					return (
						<div className="flex gap-2">
							<button
								onClick={() => onView(destination)}
								className="p-1 text-blue-600 hover:bg-blue-100 rounded"
								title="View Details"
							>
								<Eye className="h-4 w-4" />
							</button>
							<button
								onClick={() => handleViewOnMap(destination)}
								className="p-1 text-green-600 hover:bg-green-100 rounded"
								title="View on Map"
							>
								<Map className="h-4 w-4" />
							</button>
							<button
								onClick={() => onEdit(destination)}
								className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
								title="Edit"
							>
								<Edit className="h-4 w-4" />
							</button>
							<button
								onClick={() => onDelete(destination)}
								className="p-1 text-red-600 hover:bg-red-100 rounded"
								title="Delete"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					);
				},
			},
		],
		[onView, onEdit, onDelete]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		pageCount: Math.ceil(total / limit),
	});

	const totalPages = Math.ceil(total / limit);

	return (
		<div className="bg-white shadow-md rounded-lg p-6">
			<table className="w-full table-auto">
				<thead className="bg-gray-50">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="px-4 py-3 border-b border-gray-300 font-semibold text-gray-700 text-left"
								>
									{flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="divide-y divide-gray-200">
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className="hover:bg-gray-50">
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-4 py-3 text-gray-800">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			{/* Pagination */}
			<div className="flex justify-between items-center mt-6">
				<p className="text-sm text-gray-600">
					Page {page} of {totalPages}
				</p>

				<div className="flex gap-2 items-center">
					<select
						className="border rounded px-2 py-1 text-sm"
						value={limit}
						onChange={(e) => {
							const newLimit = parseInt(e.target.value);
							onQueryChange({ page: 1, limit: newLimit }); // reset to page 1
						}}
					>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>

					<button
						disabled={page <= 1}
						onClick={() => onQueryChange({ page: page - 1, limit })}
						className="px-3 py-1 border rounded disabled:opacity-50"
					>
						Prev
					</button>
					<button
						disabled={page >= totalPages}
						onClick={() => onQueryChange({ page: page + 1, limit })}
						className="px-3 py-1 border rounded disabled:opacity-50"
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
}

