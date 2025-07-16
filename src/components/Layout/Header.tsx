import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'destinations', label: 'Destinasi' },
    { id: 'packages', label: 'Paket Wisata' },
    { id: 'culture', label: 'Budaya' },
    { id: 'msme', label: 'UMKM' },
    { id: 'articles', label: 'Artikel' },
    { id: 'contact', label: 'Kontak' },
  ];

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getDashboardPage = () => {
    const dashboardMap = {
      'superadmin': 'superadmin-dashboard',
      'admin': 'admin-dashboard',
      'msme': 'msme-dashboard',
      'contributor': 'contributor-dashboard'
    };
    return dashboardMap[user?.role as keyof typeof dashboardMap];
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => handleNavigation('home')}
              className="text-xl md:text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
            >
              Pulau Laiya
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 lg:space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Hai, {user.name}</span>
                  {getDashboardPage() && (
                    <button
                      onClick={() => handleNavigation(getDashboardPage()!)}
                      className="text-sm text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      Dasbor
                    </button>
                  )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigation('login')}
                className="flex items-center space-x-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                <User size={16} />
                <span>Masuk</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Buka menu utama</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-orange-600 bg-orange-50 border-l-4 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile User Section */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {user ? (
                <div className="px-3 py-2">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Hai, {user.name}</p>
                      <p className="text-xs text-gray-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  {getDashboardPage() && (
                    <button
                      onClick={() => handleNavigation(getDashboardPage()!)}
                      className="block w-full text-left px-3 py-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors mb-2"
                    >
                      📊 Dasbor Saya
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <button
                    onClick={() => handleNavigation('login')}
                    className="flex items-center justify-center w-full px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                  >
                    <User size={16} className="mr-2" />
                    <span>Masuk</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;