import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const Destinations: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [destinationToDelete, setDestinationToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast, showToast, hideToast } = useToast();

  const destinations = [
    { 
      id: 1, 
      title: 'Pantai Laiya', 
      category: 'beaches', 
      status: 'published', 
      views: 1234,
      image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=300',
      shortDescription: 'Pantai berpasir putih dengan air laut jernih'
    },
    { 
      id: 2, 
      title: 'Taman Karang', 
      category: 'nature', 
      status: 'published', 
      views: 856,
      image: 'https://images.pexels.com/photos/1680779/pexels-photo-1680779.jpeg?auto=compress&cs=tinysrgb&w=300',
      shortDescription: 'Surga bawah laut dengan terumbu karang indah'
    },
    { 
      id: 3, 
      title: 'Desa Tradisional', 
      category: 'culture', 
      status: 'draft', 
      views: 0,
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=300',
      shortDescription: 'Budaya lokal autentik dan rumah tradisional'
    },
  ];

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || destination.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddDestination = () => {
    setSelectedDestination(null);
    setIsModalOpen(true);
  };

  const handleEditDestination = (destination: any) => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  const handleDeleteDestination = (destination: any) => {
    setDestinationToDelete(destination);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteDestination = () => {
    setTimeout(() => {
      showToast('success', `Destinasi ${destinationToDelete.title} berhasil dihapus`);
      setDestinationToDelete(null);
    }, 500);
  };

  const handleSubmitDestination = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      const action = selectedDestination ? 'diperbarui' : 'dibuat';
      showToast('success', `Destinasi berhasil ${action}`);
      setIsModalOpen(false);
      setSelectedDestination(null);
    }, 500);
  };

  const handleToggleStatus = (destination: any) => {
    const newStatus = destination.status === 'published' ? 'draft' : 'published';
    showToast('success', `Status destinasi ${destination.title} berhasil diubah menjadi ${newStatus}`);
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beaches': return 'bg-blue-100 text-blue-800';
      case 'culture': return 'bg-purple-100 text-purple-800';
      case 'nature': return 'bg-green-100 text-green-800';
      case 'adventure': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
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

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={destination.image}
              alt={destination.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{destination.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(destination.status)}`}>
                  {destination.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{destination.shortDescription}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(destination.category)}`}>
                  {destination.category}
                </span>
                <span className="text-sm text-gray-500">{destination.views} views</span>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex items-center justify-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">View</span>
                </button>
                <button 
                  onClick={() => handleEditDestination(destination)}
                  className="flex items-center justify-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button 
                  onClick={() => handleDeleteDestination(destination)}
                  className="flex items-center justify-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <TrashIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Destination Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsModalOpen}>
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
                    {selectedDestination ? 'Edit Destination' : 'Add New Destination'}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmitDestination} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        defaultValue={selectedDestination?.title || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                      <input
                        type="text"
                        defaultValue={selectedDestination?.shortDescription || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        defaultValue={selectedDestination?.category || 'beaches'}
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
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                      <input
                        type="url"
                        placeholder="https://maps.google.com/maps?q=Laiya+Island"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">URL Google Maps untuk lokasi destinasi</p>
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
                        {[1, 2, 3].map((i) => (
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
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                      >
                        {selectedDestination ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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