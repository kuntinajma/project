import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  TruckIcon,
  PhoneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useTransportation, { TransportationQuery } from '../../hooks/useTransportation';
import { useTransportationCRUD } from '../../hooks/useTransportationCRUD';
import { Transportation as TransportationType } from '../../types';

const Transportation: React.FC = () => {
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<TransportationType | null>(null);
  const [transportToDelete, setTransportToDelete] = useState<TransportationType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast, showToast, hideToast } = useToast();
  const [prevTransportations, setPrevTransportations] = useState<TransportationType[]>([]);
  const [query, setQuery] = useState<TransportationQuery>({
    page: 1,
    limit: 10,
    type: undefined,
    search: "",
  });

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      showToast("error", "Anda harus login untuk mengakses halaman ini");
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate, showToast]);

  // Fetch transportation data
  const { transportations, pagination, loading } = useTransportation(query);
  
  // CRUD operations
  const { 
    createTransportation, 
    updateTransportation, 
    deleteTransportation,
    toggleTransportationStatus
  } = useTransportationCRUD();

  // Update search query with debounce
  useEffect(() => {
    if (searchTerm === query.search) return;

    const handler = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        search: searchTerm,
        page: 1,
      }));
    }, 400);

    return () => clearTimeout(handler);
  }, [query.search, searchTerm]);

  // Save previous data for better UX during loading
  useEffect(() => {
    if (transportations.length > 0) {
      setPrevTransportations(transportations);
    }
  }, [transportations]);

  // Use previous data when loading
  const transportationList = loading ? prevTransportations : transportations;

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    setQuery((prev) => ({
      ...prev,
      type: type === 'all' ? undefined : type,
      page: 1,
    }));
  };

  const handleAddTransport = () => {
    setSelectedTransport(null);
    setIsModalOpen(true);
  };

  const handleEditTransport = (transport: TransportationType) => {
    setSelectedTransport(transport);
    setIsModalOpen(true);
  };

  const handleDeleteTransport = (transport: TransportationType) => {
    setTransportToDelete(transport);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTransport = async () => {
    if (!transportToDelete || !token) {
      showToast("error", "Gagal menghapus: Data tidak valid atau sesi berakhir");
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      console.log(`Deleting transportation with ID: ${transportToDelete.id}`);
      const res = await deleteTransportation(transportToDelete.id, token);
      
      if (res && res.success) {
        showToast(
          "success",
          `Transportasi ${transportToDelete.name} berhasil dihapus`
        );
        // Refresh the list
        setQuery((prev) => ({ ...prev }));
      } else {
        const errorMsg = res?.message || "Unknown error";
        console.error("Delete error details:", errorMsg);
        showToast("error", `Gagal menghapus: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Delete exception:", err);
      showToast("error", `Error saat menghapus: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsDeleteDialogOpen(false);
      setTransportToDelete(null);
    }
  };

  const handleSubmitTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      showToast("error", "Anda belum login atau sesi telah berakhir. Silakan login kembali.");
      return;
    }
    
    // Get form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const transportData = {
      name: formData.get('name') as string,
      type: formData.get('type') as "speedboat" | "boat" | "ferry",
      phone: formData.get('phone') as string,
      whatsapp: formData.get('whatsapp') as string || undefined,
      departureTime: formData.get('departureTime') as string,
      dockLocation: formData.get('dockLocation') as string,
      capacity: parseInt(formData.get('capacity') as string) || undefined,
      pricePerPerson: parseInt(formData.get('pricePerPerson') as string) || undefined,
      duration: formData.get('duration') as string,
      status: formData.get('status') as "active" | "inactive",
      notes: formData.get('notes') as string || undefined
    };
    
    try {
      let res;
      
      if (selectedTransport) {
        // Update existing transportation
        res = await updateTransportation(selectedTransport.id, transportData, token);
      } else {
        // Create new transportation
        res = await createTransportation(transportData as Omit<TransportationType, "id">, token);
      }
      
      if (res && res.success) {
        const action = selectedTransport ? 'diperbarui' : 'dibuat';
        showToast('success', `Transportasi berhasil ${action}`);
        setIsModalOpen(false);
        setSelectedTransport(null);
        // Refresh the list
        setQuery((prev) => ({ ...prev }));
      } else {
        const errorMsg = res?.message || "Unknown error";
        showToast("error", `Gagal ${selectedTransport ? 'memperbarui' : 'membuat'} transportasi: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Submit transportation error:", err);
      showToast("error", `Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const handleToggleStatus = async (transport: TransportationType) => {
    if (!token) {
      showToast("error", "Anda belum login atau sesi telah berakhir. Silakan login kembali.");
      return;
    }
    
    const newStatus = transport.status === 'active' ? 'inactive' : 'active';
    
    try {
      const res = await toggleTransportationStatus(transport.id, newStatus, token);
      
      if (res && res.success) {
        showToast('success', `Status transportasi ${transport.name} berhasil diubah menjadi ${newStatus}`);
        // Refresh the list
        setQuery((prev) => ({ ...prev }));
      } else {
        const errorMsg = res?.message || "Unknown error";
        showToast("error", `Gagal mengubah status: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Toggle status error:", err);
      showToast("error", `Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'speedboat': return 'bg-blue-100 text-blue-800';
      case 'boat': return 'bg-green-100 text-green-800';
      case 'ferry': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Transportation</h1>
          <p className="text-gray-600">Manage boats and transportation to Laiya Island</p>
        </div>
        <button
          onClick={handleAddTransport}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Transportation</span>
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
                placeholder="Search transportation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="speedboat">Speedboat</option>
              <option value="boat">Boat</option>
              <option value="ferry">Ferry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transportation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && transportationList.length === 0 && (
          <div className="col-span-3 text-center py-8">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        )}
        
        {!loading && transportationList.length === 0 && (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">No transportation found. Add your first transportation!</p>
          </div>
        )}
        
        {transportationList.map((transport) => (
          <div key={transport.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
                  <TruckIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{transport.name}</h3>
                  <div className="flex items-center space-x-2">
                    {transport.type && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(transport.type)}`}>
                        {transport.type}
                      </span>
                    )}
                    {transport.status && (
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(transport.status)}`}>
                        {transport.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <PhoneIcon className="h-4 w-4 mr-2" />
                <span>{transport.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>{transport.departureTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dock:</span>
                <span className="font-medium">{transport.dockLocation}</span>
              </div>
              {transport.capacity && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{transport.capacity} persons</span>
                </div>
              )}
              {transport.pricePerPerson && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-orange-600">{formatPrice(transport.pricePerPerson)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{transport.duration}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => handleToggleStatus(transport)}
                className="flex items-center justify-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <span className="text-sm font-medium">
                  {transport.status === 'active' ? 'Deactivate' : 'Activate'}
                </span>
              </button>
              <button 
                onClick={() => handleEditTransport(transport)}
                className="flex items-center justify-center px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button 
                onClick={() => handleDeleteTransport(transport)}
                className="flex items-center justify-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-white shadow-md rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>

            <div className="flex gap-2 items-center">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={query.limit}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value);
                  setQuery({ ...query, page: 1, limit: newLimit });
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <button
                disabled={query.page <= 1}
                onClick={() => setQuery({ ...query, page: query.page - 1 })}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={query.page >= pagination.totalPages}
                onClick={() => setQuery({ ...query, page: query.page + 1 })}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Transportation Modal */}
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
                    {selectedTransport ? 'Edit Transportation' : 'Add New Transportation'}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmitTransport} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Boat/Ship Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={selectedTransport?.name || ''}
                        placeholder="e.g., Laiya Express"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          name="type"
                          defaultValue={selectedTransport?.type || 'boat'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        >
                          <option value="speedboat">Speedboat</option>
                          <option value="boat">Boat</option>
                          <option value="ferry">Ferry</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          name="status"
                          defaultValue={selectedTransport?.status || 'active'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          defaultValue={selectedTransport?.phone || ''}
                          placeholder="+62 812-3456-7890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                        <input
                          type="tel"
                          name="whatsapp"
                          defaultValue={selectedTransport?.whatsapp || ''}
                          placeholder="+62 812-3456-7890"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Times</label>
                      <input
                        type="text"
                        name="departureTime"
                        defaultValue={selectedTransport?.departureTime || ''}
                        placeholder="08:00, 14:00, 20:00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma untuk multiple waktu</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dock Location</label>
                      <input
                        type="text"
                        name="dockLocation"
                        defaultValue={selectedTransport?.dockLocation || ''}
                        placeholder="Pelabuhan Bulukumba"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (persons)</label>
                        <input
                          type="number"
                          name="capacity"
                          defaultValue={selectedTransport?.capacity || ''}
                          placeholder="25"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Person (IDR)</label>
                        <input
                          type="number"
                          name="pricePerPerson"
                          defaultValue={selectedTransport?.pricePerPerson || ''}
                          placeholder="150000"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          defaultValue={selectedTransport?.duration || ''}
                          placeholder="45 minutes"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
                      <textarea
                        name="notes"
                        rows={3}
                        defaultValue={selectedTransport?.notes || ''}
                        placeholder="Safety equipment provided, weather dependent schedule, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
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
                        {selectedTransport ? 'Update' : 'Create'}
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
        onConfirm={confirmDeleteTransport}
        title="Hapus Transportasi"
        message={`Apakah Anda yakin ingin menghapus transportasi ${transportToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
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

export default Transportation;