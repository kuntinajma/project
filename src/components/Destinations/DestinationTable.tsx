import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Destination } from "../../types";
import { DestinationQuery } from "../../hooks/useDestinations";

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
	const columns = useMemo<ColumnDef<Destination>[]>(
		() => [
			{
				header: "Title",
				accessorKey: "title",
			},
			{
				header: "Category",
				accessorKey: "category",
			},
			{
				header: "Description",
				accessorKey: "shortDescription",
			},
			{
				header: "Actions",
				cell: ({ row }) => {
					const destination = row.original;
					return (
						<div className="flex gap-2">
							<button
								onClick={() => onView(destination)}
								className="text-blue-600 hover:underline"
							>
								View
							</button>
							<button
								onClick={() => onEdit(destination)}
								className="text-yellow-600 hover:underline"
							>
								Edit
							</button>
							<button
								onClick={() => onDelete(destination)}
								className="text-red-600 hover:underline"
							>
								Delete
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

