import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Toast from '../../components/common/Toast';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useToast } from '../../hooks/useToast';

const ContactMessages: React.FC = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageToDelete, setMessageToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [replyText, setReplyText] = useState('');
  const { toast, showToast, hideToast } = useToast();

  const messages = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+62 812-3456-7890',
      subject: 'Inquiry about Island Hopping Package',
      message: 'Hi, I would like to know more about the island hopping package for 6 people. What are the available dates in March?',
      isRead: false,
      hasReply: false,
      adminReply: null,
      createdAt: '2024-01-15 10:30:00',
      repliedAt: null
    },
    {
      id: 2,
      name: 'Ahmad Rahman',
      email: 'ahmad@example.com',
      phone: '+62 812-3456-7891',
      subject: 'UMKM Partnership Inquiry',
      message: 'I am interested in becoming a partner for selling local handicrafts. Could you provide information about the requirements?',
      isRead: true,
      hasReply: true,
      adminReply: 'Thank you for your interest! Please visit our office with your business documents for the partnership process.',
      createdAt: '2024-01-14 14:20:00',
      repliedAt: '2024-01-14 16:45:00'
    },
    {
      id: 3,
      name: 'Maria Santos',
      email: 'maria@example.com',
      phone: '+62 812-3456-7892',
      subject: 'Transportation Schedule',
      message: 'What is the boat schedule from Bulukumba to Laiya Island? Are there any changes during the rainy season?',
      isRead: true,
      hasReply: false,
      adminReply: null,
      createdAt: '2024-01-13 09:15:00',
      repliedAt: null
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david@example.com',
      phone: '+62 812-3456-7893',
      subject: 'Photography Permission',
      message: 'I am a professional photographer and would like to conduct a photo shoot on the island. Do I need special permission?',
      isRead: false,
      hasReply: false,
      adminReply: null,
      createdAt: '2024-01-12 16:45:00',
      repliedAt: null
    }
  ];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !message.isRead) ||
                         (filterStatus === 'read' && message.isRead) ||
                         (filterStatus === 'replied' && message.hasReply) ||
                         (filterStatus === 'unreplied' && !message.hasReply);
    return matchesSearch && matchesStatus;
  });

  const handleViewMessage = (message: any) => {
    setSelectedMessage(message);
    setIsViewModalOpen(true);
    // Mark as read when viewed
    if (!message.isRead) {
      showToast('info', 'Pesan ditandai sebagai sudah dibaca');
    }
  };

  const handleReplyMessage = (message: any) => {
    setSelectedMessage(message);
    setReplyText(message.adminReply || '');
    setIsReplyModalOpen(true);
  };

  const handleDeleteMessage = (message: any) => {
    setMessageToDelete(message);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMessage = () => {
    setTimeout(() => {
      showToast('success', `Pesan dari ${messageToDelete.name} berhasil dihapus`);
      setMessageToDelete(null);
    }, 500);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      showToast('success', `Balasan berhasil dikirim ke ${selectedMessage.email}`);
      setIsReplyModalOpen(false);
      setSelectedMessage(null);
      setReplyText('');
    }, 500);
  };

  const getStatusColor = (message: any) => {
    if (message.hasReply) return 'bg-green-100 text-green-800';
    if (message.isRead) return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (message: any) => {
    if (message.hasReply) return 'Replied';
    if (message.isRead) return 'Read';
    return 'New';
  };

  const getStatusIcon = (message: any) => {
    if (message.hasReply) return <CheckCircleIcon className="h-4 w-4" />;
    if (message.isRead) return <EyeIcon className="h-4 w-4" />;
    return <ClockIcon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-600">Manage visitor inquiries and messages</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="font-medium">{messages.filter(m => !m.isRead).length}</span>
          <span>unread messages</span>
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
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="unreplied">Unreplied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr key={message.id} className={`hover:bg-gray-50 ${!message.isRead ? 'bg-blue-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{message.name}</div>
                      <div className="text-sm text-gray-500">{message.email}</div>
                      <div className="text-sm text-gray-500">{message.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{message.subject}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {message.message.substring(0, 100)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${getStatusColor(message)}`}>
                      {getStatusIcon(message)}
                      <span>{getStatusText(message)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewMessage(message)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleReplyMessage(message)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(message)}
                        className="text-red-600 hover:text-red-900"
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

      {/* View Message Modal */}
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
                    Message Details
                  </Dialog.Title>
                  
                  {selectedMessage && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="text-sm text-gray-900">{selectedMessage.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-sm text-gray-900">{selectedMessage.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date</label>
                          <p className="text-sm text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-900">{selectedMessage.message}</p>
                        </div>
                      </div>
                      
                      {selectedMessage.hasReply && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Admin Reply</label>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-gray-900">{selectedMessage.adminReply}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Replied on {new Date(selectedMessage.repliedAt).toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      )}
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
                    <button
                      type="button"
                      onClick={() => {
                        setIsViewModalOpen(false);
                        handleReplyMessage(selectedMessage);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                    >
                      Reply
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Reply Modal */}
      <Transition appear show={isReplyModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsReplyModalOpen}>
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
                    Reply to Message
                  </Dialog.Title>
                  
                  {selectedMessage && (
                    <form onSubmit={handleSubmitReply} className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700">Original Message:</p>
                        <p className="text-sm text-gray-900 mt-1">{selectedMessage.message}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                        <textarea
                          rows={6}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply here..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsReplyModalOpen(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
                        >
                          Send Reply
                        </button>
                      </div>
                    </form>
                  )}
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
        onConfirm={confirmDeleteMessage}
        title="Hapus Pesan"
        message={`Apakah Anda yakin ingin menghapus pesan dari ${messageToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`}
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

export default ContactMessages;