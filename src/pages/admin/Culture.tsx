import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const Culture: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCulture, setSelectedCulture] = useState<any>(null);
  const [cultureToDelete, setCultureToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const { toast, showToast, hideToast } = useToast();

  const cultures = [
    { 
      id: 1, 
      title: 'Tari Saman Laiya', 
      category: 'dance', 
      status: 'published',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Tarian tradisional yang dipentaskan saat festival dan perayaan'
    },
    { 
      id: 2, 
      title: 'Ikan Bakar Laiya', 
      category: 'culinary', 
      status: 'published',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Ikan segar yang dibakar dengan bumbu tradisional'
    },
    { 
      id: 3, 
      title: 'Upacara Adat Nelayan', 
      category: 'customs', 
      status: 'draft',
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Ritual tradisional sebelum melaut'
    },
  ];

  const filteredCultures = cultures.filter(culture => {
    const matchesSearch = culture.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || culture.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCulture = () => {
    setSelectedCulture(null);
    setIsModalOpen(true);
  };

  const handleEditCulture = (culture: any) => {
    setSelectedCulture(culture);
    setIsModalOpen(true);
  };

  const handleDeleteCulture = (culture: any) => {
    setCultureToDelete(culture);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCulture = () => {
    setTimeout(() => {
      showToast('success', `Budaya ${cultureToDelete.title} berhasil dihapus`);
      setCultureToDelete(null);
    }, 500);
  };

  const handleSubmitCulture = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      const action = selectedCulture ? 'diperbarui' : 'dibuat';
      showToast('success', `Budaya berhasil ${action}`);
      setIsModalOpen(false);
      setSelectedCulture(null);
    }, 500);
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dance': return 'bg-pink-100 text-pink-800';
      case 'culinary': return 'bg-orange-100 text-orange-800';
      case 'customs': return 'bg-purple-100 text-purple-800';
      case 'wisdom': return 'bg-blue-100 text-blue-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Culture & Traditions</h1>
          <p className="text-gray-600">Manage local culture and traditional practices</p>
        </div>
        <button
          onClick={handleAddCulture}
          className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Culture</span>
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
                placeholder="Search culture..."
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
              <option value="dance">Dance</option>
              <option value="culinary">Culinary</option>
              <option value="customs">Customs</option>
              <option value="wisdom">Local Wisdom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Culture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCultures.map((culture) => (
          <div key={culture.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={culture.image}
              alt={culture.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{culture.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(culture.status)}`}>
                  {culture.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{culture.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(culture.category)}`}>
                  {culture.category}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  View
                </button>
                <button 
                  onClick={() => handleEditCulture(culture)}
                  className="flex-1 text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteCulture(culture)}
                  className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  <TrashIcon className="h-4 w-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Culture Modal */}
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
                    {selectedCulture ? 'Edit Culture' : 'Add New Culture'}
                  </Dialog.Title>
                  
                  <form onSubmit={handleSubmitCulture} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        defaultValue={selectedCulture?.title || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        defaultValue={selectedCulture?.category || 'dance'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="dance">Dance</option>
                        <option value="culinary">Culinary</option>
                        <option value="customs">Customs</option>
                        <option value="wisdom">Local Wisdom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        rows={4}
                        defaultValue={selectedCulture?.description || ''}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video URL (Optional)</label>
                      <input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">YouTube video URL untuk konten budaya</p>
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
                        {selectedCulture ? 'Update' : 'Create'}
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
        onConfirm={confirmDeleteCulture}
        title="Hapus Budaya"
        message={`Apakah Anda yakin ingin menghapus budaya ${cultureToDelete?.title}? Tindakan ini tidak dapat dibatalkan.`}
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

export default Culture;