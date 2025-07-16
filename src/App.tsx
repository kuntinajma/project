import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// Layout
import PublicLayout from './components/public/PublicLayout';

// Public pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import PackagesPage from './pages/TourPackagesPage';
import UMKMPage from './pages/MSMEPage';
import CulturePage from './pages/CulturePage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/public/LoginPage';

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
        <Route path="kontak" element={<ContactPage onNavigate={onNavigate} />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default function RootApp() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
