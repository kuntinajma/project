import React, { useState } from 'react';
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

const Testimonials: React.FC = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterDisplay, setFilterDisplay] = useState('all');
  const { toast, showToast, hideToast } = useToast();

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      rating: 5,
      message: 'Amazing experience! The island is a paradise with crystal clear waters and friendly locals. The tour guide was very knowledgeable and made our trip memorable.',
      origin: 'Jakarta, Indonesia',
      isDisplayed: true,
      isVerified: true,
      createdAt: '2024-01-15 14:30:00',
      source: 'website'
    },
    {
      id: 2,
      name: 'Ahmad Rahman',
      email: 'ahmad@example.com',
      rating: 5,
      message: 'Perfect family vacation spot with beautiful beaches and amazing snorkeling. The cultural tour was very educational and fun for the kids.',
      origin: 'Makassar, Indonesia',
      isDisplayed: true,
      isVerified: true,
      createdAt: '2024-01-14 16:45:00',
      source: 'website'
    },
    {
      id: 3,
      name: 'Maria Santos',
      email: 'maria@example.com',
      rating: 4,
      message: 'Great destination for nature lovers. The coral reefs are stunning and the local food is delicious. Would definitely come back!',
      origin: 'Surabaya, Indonesia',
      isDisplayed: false,
      isVerified: true,
      createdAt: '2024-01-13 11:20:00',
      source: 'google'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david@example.com',
      rating: 5,
      message: 'Incredible hidden gem! The traditional village experience was authentic and the people were so welcoming. Highly recommended for cultural enthusiasts.',
      origin: 'Seoul, South Korea',
      isDisplayed: true,
      isVerified: false,
      createdAt: '2024-01-12 09:15:00',
      source: 'website'
    },
    {
      id: 5,
      name: 'Lisa Wong',
      email: 'lisa@example.com',
      rating: 3,
      message: 'Nice place but the weather was not great during our visit. The accommodation could be improved. However, the natural beauty is undeniable.',
      origin: 'Singapore',
      isDisplayed: false,
      isVerified: true,
      createdAt: '2024-01-11 13:45:00',
      source: 'website'
    }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.origin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = filterRating === 'all' || testimonial.rating.toString() === filterRating;
    const matchesDisplay = filterDisplay === 'all' || 
                          (filterDisplay === 'displayed' && testimonial.isDisplayed) ||
                          (filterDisplay === 'hidden' && !testimonial.isDisplayed);
    return matchesSearch && matchesRating && matchesDisplay;
  });

  const handleViewTestimonial = (testimonial: any) => {
    setSelectedTestimonial(testimonial);
    setIsViewModalOpen(true);
  };

  const handleDeleteTestimonial = (testimonial: any) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTestimonial = () => {
    setTimeout(() => {
      showToast('success', `Testimoni dari ${testimonialToDelete.name} berhasil dihapus`);
      setTestimonialToDelete(null);
    }, 500);
  };

  const handleToggleDisplay = (testimonial: any) => {
    const action = testimonial.isDisplayed ? 'disembunyikan dari' : 'ditampilkan di';
    showToast('success', `Testimoni ${action} beranda`);
  };

  const handleToggleVerification = (testimonial: any) => {
    const action = testimonial.isVerified ? 'tidak diverifikasi' : 'diverifikasi';
    showToast('success', `Testimoni berhasil ${action}`);
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

  const getDisplayStatusColor = (isDisplayed: boolean) => {
    return isDisplayed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'google': return 'bg-red-100 text-red-800';
      case 'website': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600">Manage visitor testimonials and reviews</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{testimonials.filter(t => t.isDisplayed).length}</span>
            <span>displayed</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">{testimonials.filter(t => !t.isVerified).length}</span>
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
            
            <select
              value={filterDisplay}
              onChange={(e) => setFilterDisplay(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="displayed">Displayed</option>
              <option value="hidden">Hidden</option>
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
              {filteredTestimonials.map((testimonial) => (
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
                      {renderStars(testimonial.rating)}
                      <span className="text-sm text-gray-600">({testimonial.rating})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {testimonial.message.substring(0, 100)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDisplayStatusColor(testimonial.isDisplayed)}`}>
                        {testimonial.isDisplayed ? 'Displayed' : 'Hidden'}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getVerificationColor(testimonial.isVerified)}`}>
                        {testimonial.isVerified ? 'Verified' : 'Pending'}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getSourceColor(testimonial.source)}`}>
                        {testimonial.source}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(testimonial.createdAt).toLocaleDateString('id-ID')}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testimonial Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {testimonials.filter(t => t.isDisplayed).length}
            </div>
            <div className="text-sm text-gray-600">Displayed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {testimonials.filter(t => t.isVerified).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {testimonials.filter(t => t.rating === 5).length}
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
                          <p className="text-sm text-gray-900">{selectedTestimonial.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Origin</label>
                          <p className="text-sm text-gray-900">{selectedTestimonial.origin}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Rating</label>
                          <div className="flex items-center space-x-2">
                            {renderStars(selectedTestimonial.rating)}
                            <span className="text-sm text-gray-600">({selectedTestimonial.rating}/5)</span>
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
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getDisplayStatusColor(selectedTestimonial.isDisplayed)}`}>
                            {selectedTestimonial.isDisplayed ? 'Displayed on Homepage' : 'Hidden from Homepage'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Verification</label>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getVerificationColor(selectedTestimonial.isVerified)}`}>
                            {selectedTestimonial.isVerified ? 'Verified' : 'Pending Verification'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Source</label>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getSourceColor(selectedTestimonial.source)}`}>
                            {selectedTestimonial.source}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                        <p className="text-sm text-gray-900">{new Date(selectedTestimonial.createdAt).toLocaleString('id-ID')}</p>
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
                          selectedTestimonial.isDisplayed 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {selectedTestimonial.isDisplayed ? 'Hide from Homepage' : 'Show on Homepage'}
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