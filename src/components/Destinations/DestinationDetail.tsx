import { ArrowLeft, Camera, MapPin, Star } from "lucide-react";
import { Destination } from "../../types";

interface Props {
	destination: Destination;
	onBack: () => void;
	onViewGallery?: () => void;
	onGetDirections?: () => void;
}

export default function DestinationDetail({
	destination,
	onBack,
	onViewGallery,
	onGetDirections,
}: Props) {
	return (
		<div className="min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<button
					onClick={onBack}
					className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6"
				>
					<ArrowLeft size={20} />
					<span>Back to Destinations</span>
				</button>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Image Gallery */}
					<div className="space-y-4">
						<img
							src={destination.image}
							alt={destination.title}
							className="w-full h-96 object-cover rounded-lg shadow-lg"
						/>
						<div className="grid grid-cols-2 gap-4">
							{destination.gallery.map((image, index) => (
								<img
									key={index}
									src={image}
									alt={`${destination.title} ${index + 1}`}
									className="w-full h-48 object-cover rounded-lg shadow-md"
								/>
							))}
						</div>
					</div>

					{/* Details */}
					<div className="space-y-6">
						<div>
							<h1 className="text-4xl font-bold text-gray-900 mb-2">
								{destination.title}
							</h1>
							<div className="flex items-center space-x-4 mb-4">
								<span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
									{destination.category}
								</span>
								<div className="flex items-center space-x-1">
									<Star className="text-yellow-500 fill-current" size={16} />
									<span className="text-sm text-gray-600">
										4.8 (124 reviews)
									</span>
								</div>
							</div>
						</div>

						<div className="prose max-w-none">
							<p className="text-gray-700 leading-relaxed">
								{destination.description}
							</p>
						</div>

						<div className="bg-white rounded-lg p-6 shadow-md">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								Location
							</h3>
							<div className="flex items-center space-x-2 mb-4">
								<MapPin className="text-orange-600" size={20} />
								<span className="text-gray-700">
									{destination.location.lat.toFixed(4)},{" "}
									{destination.location.lng.toFixed(4)}
								</span>
							</div>
							<div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
								<p className="text-gray-600">Interactive Map Coming Soon</p>
							</div>
						</div>

						<div className="flex space-x-4">
							<button
								onClick={onViewGallery}
								className="flex items-center space-x-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
							>
								<Camera size={20} />
								<span>View Gallery</span>
							</button>
							<button
								onClick={onGetDirections}
								className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
							>
								<MapPin size={20} />
								<span>Get Directions</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

