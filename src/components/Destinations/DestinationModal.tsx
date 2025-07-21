import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Destination } from "../../types";


interface DestinationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (destination: Destination) => void;
	destination?: Destination;
}

export default function DestinationModal({
	isOpen,
	onClose,
	onSubmit,
	destination,
}: DestinationModalProps) {
	const [form, setForm] = useState<Destination>({
		id: destination?.id || crypto.randomUUID(),
		title: destination?.title || "",
		description: destination?.description || "",
		shortDescription: destination?.shortDescription || "",
		image: destination?.image || "",
		category: destination?.category || "beaches",
		location: destination?.location || { lat: 0, lng: 0 },
		gallery: destination?.gallery || [],
	});

	useEffect(() => {
		if (destination) {
			setForm(destination);
		}
	}, [destination]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(form);
		onClose();
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-10" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
									{destination ? "Edit Destination" : "Add New Destination"}
								</Dialog.Title>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
										<input
											name="title"
											value={form.title}
											onChange={handleChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
										<input
											name="shortDescription"
											value={form.shortDescription}
											onChange={handleChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
										<select
											name="category"
											value={form.category}
											onChange={handleChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										>
											<option value="beaches">Beaches</option>
											<option value="culture">Culture</option>
											<option value="nature">Nature</option>
											<option value="adventure">Adventure</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
										<textarea
											name="description"
											rows={4}
											value={form.description}
											onChange={handleChange}
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
										<input
											name="mapsUrl"
											placeholder="https://maps.google.com/maps?q=Your+Place"
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
											disabled
										/>
										<p className="text-xs text-gray-500 mt-1">Hardcoded for now, parsing not implemented</p>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
										<div className="flex items-center space-x-4">
											<div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
												<PhotoIcon className="h-8 w-8 text-gray-400" />
											</div>
											<div className="flex-1">
												<input
													type="file"
													accept="image/*"
													className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
												/>
												<p className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF. Max size 5MB.</p>
											</div>
										</div>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
										<div className="grid grid-cols-3 gap-4 mb-4">
											{form.gallery.map((img, i) => (
												<div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
													<PhotoIcon className="h-8 w-8 text-gray-400" />
												</div>
											))}
										</div>
										<input
											type="file"
											accept="image/*"
											multiple
											className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
										/>
										<p className="text-xs text-gray-500 mt-1">Select multiple images for gallery</p>
									</div>

									<div className="flex justify-end space-x-3 pt-4">
										<button
											type="button"
											onClick={onClose}
											className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
										>
											{destination ? "Update" : "Create"}
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
}

