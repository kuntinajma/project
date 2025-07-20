import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  MapPinIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  SparklesIcon,
  UsersIcon,
  CogIcon,
  DocumentTextIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    ];

    switch (user?.role) {
      case 'superadmin':
        return [
          ...baseItems,
          { name: 'Users', href: '/admin/users', icon: UsersIcon },
          { name: 'Destinations', href: '/admin/destinations', icon: MapPinIcon },
          { name: 'Culture', href: '/admin/culture', icon: SparklesIcon },
          { name: 'Tour Packages', href: '/admin/packages', icon: CubeIcon },
          { name: 'UMKM', href: '/admin/umkm', icon: BuildingStorefrontIcon },
          { name: 'Articles', href: '/admin/articles', icon: DocumentTextIcon },
          { name: 'Contact Messages', href: '/admin/contact-messages', icon: ChatBubbleLeftRightIcon },
          { name: 'Testimonials', href: '/admin/testimonials', icon: StarIcon },
          { name: 'Settings', href: '/admin/settings', icon: CogIcon },
        ];
      case 'admin':
        return [
          ...baseItems,
          { name: 'Destinations', href: '/admin/destinations', icon: MapPinIcon },
          { name: 'Culture', href: '/admin/culture', icon: SparklesIcon },
          { name: 'Tour Packages', href: '/admin/packages', icon: CubeIcon },
          { name: 'UMKM', href: '/admin/umkm', icon: BuildingStorefrontIcon },
          { name: 'Articles', href: '/admin/articles', icon: DocumentTextIcon },
          { name: 'Contact Messages', href: '/admin/contact-messages', icon: ChatBubbleLeftRightIcon },
          { name: 'Testimonials', href: '/admin/testimonials', icon: StarIcon },
        ];
      case 'msme':
        return [
          ...baseItems,
          { name: 'My Products', href: '/admin/products', icon: CubeIcon },
          { name: 'UMKM Profile', href: '/admin/profile-umkm', icon: UserIcon },
        ];
      case 'contributor':
        return [
          ...baseItems,
          { name: 'My Articles', href: '/admin/articles', icon: DocumentTextIcon },
          { name: 'Profile', href: '/admin/profile', icon: UserIcon },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return location.pathname === href || location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-orange-600">Pulau Laiya Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                target="_blank"
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;