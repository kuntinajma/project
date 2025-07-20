import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  EyeIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const UMKM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const umkmPartners = [
    { 
      id: 1, 
      businessName: 'Kerajinan Laiya', 
      owner: 'Ahmad Rahman',
      category: 'Handicrafts',
      products: 12,
      status: 'approved',
      joinDate: '2024-01-10',
      phone: '+62 812-3456-7890',
      description: 'Traditional handicrafts made from coconut shells and local materials'
    },
    { 
      id: 2, 
      businessName: 'Island Souvenirs', 
      owner: 'Maria Santos',
      category: 'Souvenirs',
      products: 8,
      status: 'pending',
      joinDate: '2024-01-12',
      phone: '+62 812-3456-7891',
      description: 'Unique souvenirs representing Laiya Island culture'
    },
    { 
      id: 3, 
      businessName: 'Traditional Foods', 
      owner: 'Siti Nurhaliza',
      category: 'Food & Beverage',
      products: 15,
      status: 'approved',
      joinDate: '2024-01-08',
      phone: '+62 812-3456-7892',
      description: 'Authentic local cuisine and traditional snacks'
    },
    { 
      id: 4, 
      businessName: 'Laiya Textiles', 
      owner: 'Budi Santoso',
      category: 'Textiles',
      products: 6,
      status: 'rejected',
      joinDate: '2024-01-14',
      phone: '+62 812-3456-7893',
      description: 'Traditional woven fabrics and clothing'
    },
  ];

  const filteredUMKM = umkmPartners.filter(umkm => {
    const matchesSearch = umkm.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         umkm.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || umkm.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">UMKM Partners</h1>
          <p className="text-gray-600">View and manage local business partnerships</p>
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
                placeholder="Search UMKM partners..."
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
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* UMKM Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUMKM.map((umkm) => (
          <div key={umkm.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center">
                  <BuildingStorefrontIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{umkm.businessName}</h3>
                  <p className="text-sm text-gray-600">by {umkm.owner}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-full ${getStatusColor(umkm.status)}`}>
                  {getStatusIcon(umkm.status)}
                  <span>{umkm.status}</span>
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{umkm.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{umkm.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Products:</span>
                <span className="font-medium">{umkm.products} items</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{umkm.phone}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Joined:</span>
                <span className="font-medium">{umkm.joinDate}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center space-x-1">
                <EyeIcon className="h-4 w-4" />
                <span>View Details</span>
              </button>
              {umkm.status === 'pending' && (
                <>
                  <button className="flex-1 text-green-600 hover:text-green-700 text-sm font-medium">
                    Approve
                  </button>
                  <button className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">UMKM Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {umkmPartners.filter(u => u.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved Partners</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {umkmPartners.filter(u => u.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {umkmPartners.reduce((sum, u) => sum + u.products, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">4</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UMKM;