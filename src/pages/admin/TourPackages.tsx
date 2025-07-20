import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  CubeIcon,
  ClockIcon,
  UsersIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const TourPackages: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packageToDelete, setPackageToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast, showToast, hideToast } = useToast();

  const packages = [
    { 
      id: 1, 
      name: 'Island Hopping Adventure', 
      price: 750000, 
      duration: '8 hours',
      minPersons: 4,
      maxPersons: 12,
      bookings: 45,
      status: 'active',
      image: 'https://images.pexels.com/photos/1430676/pexels-photo-1430676.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Explore multiple islands around Laiya with snorkeling activities'
    },
    { 
      id: 2, 
      name: 'Cultural Immersion', 
      price: 500000, 
      duration: '6 hours',
      minPersons: 2,
      maxPersons: 8,
      bookings: 23,
      status: 'active',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Experience authentic local culture in Mattiro Labangeng Village'
    },
    { 
      id: 3, 
      name: 'Sunset Photography Tour', 
      price: 300000, 
      duration: '4 hours',
      minPersons: 1,
      maxPersons: 6,
      bookings: 12,
      status: 'inactive',
      image: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Capture stunning sunset moments at the best spots'
    },
  ];

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = () => {
    setSelectedPackage(null);
    setIsModalOpen(true);
  };

  const handleEditPackage = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDeletePackage = (pkg: any) => {
    setPackageToDelete(pkg);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePackage = () => {
    setTimeout(() => {
      showToast('success', `Paket wisata ${packageToDelete.name} berhasil dihapus`);
      setPackageToDelete(null);
    }, 500);
  };

  const handleSubmitPackage = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      const action = selectedPackage ? 'diperbarui' : 'dibuat';
      showToast('success', `Paket wisata berhasil ${action}`);
      setIsModalOpen(false);
      setSelectedPackage(null);
    }, 500);
  };

  const handleToggleStatus = (pkg: any) => {
    const newStatus = pkg.status === 'active' ? 'inactive' : 'active';
    showToast('success', `Status paket ${pkg.name} berhasil diubah menjadi ${newStatus}`);
  };
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Packages</h1>
          <p className="text-gray-600">Manage tour packages and experiences</p>
        </div>
        <button
          onClick={handleAddPackage}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={pkg.image}
              alt={pkg.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(pkg.status)}`}>
                  {pkg.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  <span className="font-semibold text-orange-600">{formatPrice(pkg.price)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UsersIcon className="h-4 w-4 mr-2" />
                  <span>{pkg.minPersons}-{pkg.maxPersons} persons</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{pkg.bookings}</span> bookings
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex items-center justify-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">View</span>
                </button>
                <button 
                  onClick={() => handleEditPackage(pkg)}
                  className="flex items-center justify-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                >
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button 
                  onClick={() => handleDeletePackage(pkg)}
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

      {/* Add/Edit Package Modal */}
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {selectedPackage ? 'Edit Tour Package' : 'Add New Tour Package'}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmitPackage} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                      <input
                        type="text"
                        defaultValue={selectedPackage?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={3}
                        defaultValue={selectedPackage?.description || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (IDR)</label>
                        <input
                          type="number"
                          defaultValue={selectedPackage?.price || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          defaultValue={selectedPackage?.duration || ''}
                          placeholder="e.g., 8 hours"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Persons</label>
                        <input
                          type="number"
                          defaultValue={selectedPackage?.minPersons || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Persons</label>
                        <input
                          type="number"
                          defaultValue={selectedPackage?.maxPersons || ''}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Contact</label>
                      <input
                        type="text"
                        placeholder="+62 812-3456-7890"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Booking URL</label>
                      <input
                        type="url"
                        placeholder="https://wa.me/6281234567890?text=Hi, I want to book..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">URL WhatsApp dengan pesan booking otomatis</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Facilities (one per line)</label>
                      <textarea
                        rows={4}
                        placeholder="Transportation&#10;Snorkeling equipment&#10;Lunch&#10;Local guide"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
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
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="popular"
                        defaultChecked={selectedPackage?.popular || false}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <label htmlFor="popular" className="ml-2 text-sm text-gray-700">
                        Mark as popular package
                      </label>
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
                        {selectedPackage ? 'Update' : 'Create'}
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
        onConfirm={confirmDeletePackage}
        title="Hapus Paket Wisata"
        message={`Apakah Anda yakin ingin menghapus paket wisata ${packageToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
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

export default TourPackages;