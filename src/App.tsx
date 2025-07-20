import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout
import PublicLayout from './components/public/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

// Public pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import PackagesPage from './pages/TourPackagesPage';
import UMKMPage from './pages/MSMEPage';
import CulturePage from './pages/CulturePage';
import ContactPage from './pages/ContactPage';
import ArticlesPage from './pages/ArticlesPage';
import LoginPage from './pages/public/LoginPage';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Settings from './pages/admin/Settings';
import Destinations from './pages/admin/Destinations';
import Culture from './pages/admin/Culture';
import TourPackages from './pages/admin/TourPackages';
import UMKM from './pages/admin/UMKM';
import Products from './pages/admin/Products';
import Articles from './pages/admin/Articles';
import ProfileUMKM from './pages/admin/ProfileUMKM';
import Profile from './pages/admin/Profile';

function AppWrapper() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    switch (page) {
      case 'destinations':
        navigate('/destinasi');
        break;
      case 'packages':
        navigate('/paket-wisata');
        break;
      case 'culture':
        navigate('/budaya');
        break;
      case 'msme':
        navigate('/umkm');
        break;
      case 'articles':
        navigate('/artikel');
        break;
      case 'contact':
        navigate('/kontak');
        break;
      default:
        navigate('/');
    }
  };

  return <App onNavigate={handleNavigate} />;
}

function App({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage onNavigate={onNavigate} />} />
        <Route path="destinasi" element={<DestinationsPage onNavigate={onNavigate} />} />
        <Route path="paket-wisata" element={<PackagesPage onNavigate={onNavigate} />} />
        <Route path="umkm" element={<UMKMPage onNavigate={onNavigate} />} />
        <Route path="budaya" element={<CulturePage onNavigate={onNavigate} />} />
        <Route path="artikel" element={<ArticlesPage onNavigate={onNavigate} />} />
        <Route path="kontak" element={<ContactPage onNavigate={onNavigate} />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="culture" element={<Culture />} />
        <Route path="packages" element={<TourPackages />} />
        <Route path="umkm" element={<UMKM />} />
        <Route path="products" element={<Products />} />
        <Route path="articles" element={<Articles />} />
        <Route path="profile-umkm" element={<ProfileUMKM />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}
