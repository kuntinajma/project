import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import { useTestimonials, Testimonial } from '../../hooks/useTestimonials';
import { useTestimonialsCRUD } from '../../hooks/useTestimonialsCRUD';

const Testimonials: React.FC = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const { toast, showToast, hideToast } = useToast();
  
  // Add debounce for search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // Use our custom hooks
  const { getTestimonials, loading: fetchLoading } = useTestimonials();
  const { updateTestimonial, deleteTestimonial, loading: crudLoading } = useTestimonialsCRUD();
  
  // Debounce search term updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // State to store testimonials data
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: limit
  });
  
  // Fetch testimonials when component mounts or when search/filter/page changes
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await getTestimonials(currentPage, limit, debouncedSearchTerm);
        setTestimonials(response.testimonials);
        setPagination(response.pagination);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        showToast('error', 'Failed to fetch testimonials');
      }
    };
    
    fetchTestimonials();
  }, [currentPage, limit, debouncedSearchTerm, getTestimonials, showToast]);
  
  // Filter testimonials by rating
  const filteredTestimonials = testimonials.filter(testimonial => {
    return filterRating === 'all' || testimonial.star.toString() === filterRating;
  });

  const handleViewTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsViewModalOpen(true);
  };

  const handleDeleteTestimonial = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    
    try {
      const result = await deleteTestimonial(testimonialToDelete.id);
      if (result.success) {
        showToast('success', `Testimoni dari ${testimonialToDelete.name} berhasil dihapus`);
        
        // Remove the deleted testimonial from the current list instead of making a new API call
        setTestimonials(prev => prev.filter(t => t.id !== testimonialToDelete.id));
        
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          totalItems: prev.totalItems - 1,
          totalPages: Math.ceil((prev.totalItems - 1) / prev.itemsPerPage)
        }));
      } else {
        showToast('error', result.message || 'Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showToast('error', 'Failed to delete testimonial');
    } finally {
      setIsDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  const handleToggleDisplay = async (testimonial: Testimonial) => {
    try {
      // This is a mock implementation since we don't have a display field in our schema
      // In a real implementation, you would update the testimonial with a display field
      const result = await updateTestimonial(testimonial.id, {
        name: testimonial.name,
        star: testimonial.star,
        origin: testimonial.origin || undefined,
        message: testimonial.message
      });
      
      if (result.success) {
        // Use addMockProperties to get the display status
        const enhancedTestimonial = addMockProperties(testimonial);
        const action = enhancedTestimonial.isDisplayed ? 'disembunyikan dari' : 'ditampilkan di';
        showToast('success', `Testimoni ${action} beranda`);
        
        // Update the testimonial in the current list instead of making a new API call
        if (result.data) {
          setTestimonials(prev => prev.map(t => 
            t.id === testimonial.id ? result.data : t
          ));
        }
      } else {
        showToast('error', result.message || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      showToast('error', 'Failed to update testimonial');
    }
  };

  const handleToggleVerification = async (testimonial: Testimonial) => {
    try {
      // This is a mock implementation since we don't have a verification field in our schema
      // In a real implementation, you would update the testimonial with a verification field
      const result = await updateTestimonial(testimonial.id, {
        name: testimonial.name,
        star: testimonial.star,
        origin: testimonial.origin || undefined,
        message: testimonial.message
      });
      
      if (result.success) {
        // Use addMockProperties to get the verification status
        const enhancedTestimonial = addMockProperties(testimonial);
        const action = enhancedTestimonial.isVerified ? 'tidak diverifikasi' : 'diverifikasi';
        showToast('success', `Testimoni berhasil ${action}`);
        
        // Update the testimonial in the current list instead of making a new API call
        if (result.data) {
          setTestimonials(prev => prev.map(t => 
            t.id === testimonial.id ? result.data : t
          ));
        }
      } else {
        showToast('error', result.message || 'Failed to update testimonial');
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      showToast('error', 'Failed to update testimonial');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <SolidStarIcon key={star} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="h-4 w-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  // These are mock implementations since we don't have these fields in our schema
  // In a real implementation, you would use the actual fields from the testimonial object
  const getDisplayStatusColor = (testimonial: Testimonial) => {
    // Mock implementation - in a real app, use actual display status
    const isDisplayed = testimonial.id % 2 === 0; // Just for demonstration
    return isDisplayed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getVerificationColor = (testimonial: Testimonial) => {
    // Mock implementation - in a real app, use actual verification status
    const isVerified = testimonial.id % 3 !== 0; // Just for demonstration
    return isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getSourceColor = (testimonial: Testimonial) => {
    // Mock implementation - in a real app, use actual source
    const source = testimonial.id % 4 === 0 ? 'google' : 'website'; // Just for demonstration
    switch (source) {
      case 'google': return 'bg-red-100 text-red-800';
      case 'website': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock properties for UI display
  const addMockProperties = (testimonial: Testimonial) => {
    return {
      ...testimonial,
      isDisplayed: testimonial.id % 2 === 0, // Just for demonstration
      isVerified: testimonial.id % 3 !== 0, // Just for demonstration
      source: testimonial.id % 4 === 0 ? 'google' : 'website', // Just for demonstration
      email: `${testimonial.name.toLowerCase().replace(/\s/g, '.')}@example.com` // Just for demonstration
    };
  };

  const enrichedTestimonials = filteredTestimonials.map(addMockProperties);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600">Manage visitor testimonials and reviews</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{enrichedTestimonials.filter(t => t.isDisplayed).length}</span>
            <span>displayed</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{enrichedTestimonials.filter(t => !t.isVerified).length}</span>
            <span>pending verification</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fetchLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading testimonials...</td>
                </tr>
              ) : enrichedTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">No testimonials found</td>
                </tr>
              ) : (
                enrichedTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-500">{testimonial.email}</div>
                        <div className="text-sm text-gray-500">{testimonial.origin}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {renderStars(testimonial.star)}
                        <span className="text-sm text-gray-600">({testimonial.star})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {testimonial.message.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDisplayStatusColor(testimonial)}`}>
                          {testimonial.isDisplayed ? 'Displayed' : 'Hidden'}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getVerificationColor(testimonial)}`}>
                          {testimonial.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getSourceColor(testimonial)}`}>
                          {testimonial.source}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(testimonial.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewTestimonial(testimonial)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleDisplay(testimonial)}
                          className={testimonial.isDisplayed ? "text-gray-600 hover:text-gray-900" : "text-green-600 hover:text-green-900"}
                          title={testimonial.isDisplayed ? "Hide from Homepage" : "Show on Homepage"}
                        >
                          {testimonial.isDisplayed ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => handleToggleVerification(testimonial)}
                          className={testimonial.isVerified ? "text-yellow-600 hover:text-yellow-900" : "text-blue-600 hover:text-blue-900"}
                          title={testimonial.isVerified ? "Unverify" : "Verify"}
                        >
                          {testimonial.isVerified ? <XCircleIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteTestimonial(testimonial)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-md ${
                  page === currentPage
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonial Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {testimonials.length > 0 
                ? (testimonials.reduce((sum, t) => sum + t.star, 0) / testimonials.length).toFixed(1)
                : '0.0'
              }
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {enrichedTestimonials.filter(t => t.isDisplayed).length}
            </div>
            <div className="text-sm text-gray-600">Displayed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {enrichedTestimonials.filter(t => t.isVerified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {testimonials.filter(t => t.star === 5).length}
            </div>
            <div className="text-sm text-gray-600">5-Star Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {testimonials.length}
            </div>
            <div className="text-sm text-gray-600">Total Reviews</div>
          </div>
        </div>
      </div>

      {/* View Testimonial Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsViewModalOpen}>
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
                    Testimonial Details
                  </Dialog.Title>
                  
                  {selectedTestimonial && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <p className="text-sm text-gray-900">{selectedTestimonial.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-sm text-gray-900">{addMockProperties(selectedTestimonial).email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Origin</label>
                          <p className="text-sm text-gray-900">{selectedTestimonial.origin || 'Not specified'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rating</label>
                          <div className="flex items-center space-x-2">
                            {renderStars(selectedTestimonial.star)}
                            <span className="text-sm text-gray-600">({selectedTestimonial.star}/5)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Review Message</label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900">{selectedTestimonial.message}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Display Status</label>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDisplayStatusColor(selectedTestimonial)}`}>
                            {addMockProperties(selectedTestimonial).isDisplayed ? 'Displayed on Homepage' : 'Hidden from Homepage'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Verification</label>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getVerificationColor(selectedTestimonial)}`}>
                            {addMockProperties(selectedTestimonial).isVerified ? 'Verified' : 'Pending Verification'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Source</label>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getSourceColor(selectedTestimonial)}`}>
                            {addMockProperties(selectedTestimonial).source}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                        <p className="text-sm text-gray-900">{new Date(selectedTestimonial.created_at).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsViewModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                      Close
                    </button>
                    {selectedTestimonial && (
                      <button
                        type="button"
                        onClick={() => {
                          handleToggleDisplay(selectedTestimonial);
                          setIsViewModalOpen(false);
                        }}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                          addMockProperties(selectedTestimonial).isDisplayed 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {addMockProperties(selectedTestimonial).isDisplayed ? 'Hide from Homepage' : 'Show on Homepage'}
                      </button>
                    )}
                  </div>
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
        onConfirm={confirmDeleteTestimonial}
        title="Hapus Testimoni"
        message={`Apakah Anda yakin ingin menghapus testimoni dari ${testimonialToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
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

export default Testimonials;