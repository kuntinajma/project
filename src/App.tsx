import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/Admin/AdminLayout";

// Public pages
import HomePage from "./pages/HomePage";
import DestinationsPage from "./pages/DestinationsPage";
import PackagesPage from "./pages/TourPackagesPage";
import UMKMPage from "./pages/MSMEPage";
import CulturePage from "./pages/CulturePage";
import ContactPage from "./pages/ContactPage";
import ArticlesPage from "./pages/ArticlesPage";
import LoginPage from "./pages/public/LoginPage";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import Destinations from "./pages/admin/Destinations";
import Culture from "./pages/admin/Culture";
import TourPackages from "./pages/admin/TourPackages";
import UMKM from "./pages/admin/UMKM";
import Products from "./pages/admin/Products";
import Articles from "./pages/admin/Articles";
import ProfileUMKM from "./pages/admin/ProfileUMKM";
import Profile from "./pages/admin/Profile";
import ContactMessages from "./pages/admin/ContactMessages";
import Testimonials from "./pages/admin/Testimonials";
import Transportation from "./pages/admin/Transportation";

// Define roles with access to admin routes
const adminRoles = ["superadmin", "admin"];
const contributorRoles = [...adminRoles, "contributor"];
const msmeRoles = [...adminRoles, "msme"];
const allAdminRoles = [...adminRoles, "contributor", "msme"];

function AppWrapper() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    switch (page) {
      case "destinations":
        navigate("/destinasi");
        break;
      case "packages":
        navigate("/paket-wisata");
        break;
      case "culture":
        navigate("/budaya");
        break;
      case "msme":
        navigate("/umkm");
        break;
      case "articles":
        navigate("/artikel");
        break;
      case "contact":
        navigate("/kontak");
        break;
      default:
        navigate("/");
    }
  };

  return <App onNavigate={handleNavigate} />;
}

function App({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage onNavigate={onNavigate} />} />
        <Route
          path="destinasi"
          element={<DestinationsPage onNavigate={onNavigate} />}
        />
        <Route
          path="paket-wisata"
          element={<PackagesPage onNavigate={onNavigate} />}
        />
        <Route path="umkm" element={<UMKMPage onNavigate={onNavigate} />} />
        <Route
          path="budaya"
          element={<CulturePage onNavigate={onNavigate} />}
        />
        <Route
          path="artikel"
          element={<ArticlesPage onNavigate={onNavigate} />}
        />
        <Route
          path="kontak"
          element={<ContactPage onNavigate={onNavigate} />}
        />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
          <p className="mb-4">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={allAdminRoles}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={
          <ProtectedRoute allowedRoles={adminRoles}>
            <Users />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute allowedRoles={adminRoles}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="destinations" element={
          <ProtectedRoute allowedRoles={contributorRoles}>
            <Destinations />
          </ProtectedRoute>
        } />
        <Route path="culture" element={
          <ProtectedRoute allowedRoles={contributorRoles}>
            <Culture />
          </ProtectedRoute>
        } />
        <Route path="packages" element={
          <ProtectedRoute allowedRoles={contributorRoles}>
            <TourPackages />
          </ProtectedRoute>
        } />
        <Route path="umkm" element={
          <ProtectedRoute allowedRoles={adminRoles}>
            <UMKM />
          </ProtectedRoute>
        } />
        <Route path="products" element={
          <ProtectedRoute allowedRoles={[...adminRoles, "msme"]}>
            <Products />
          </ProtectedRoute>
        } />
        <Route path="articles" element={
          <ProtectedRoute allowedRoles={contributorRoles}>
            <Articles />
          </ProtectedRoute>
        } />
        <Route path="profile-umkm" element={
          <ProtectedRoute allowedRoles={msmeRoles}>
            <ProfileUMKM />
          </ProtectedRoute>
        } />
        <Route path="profile" element={<Profile />} />
        <Route path="contact-messages" element={
          <ProtectedRoute allowedRoles={adminRoles}>
            <ContactMessages />
          </ProtectedRoute>
        } />
        <Route path="testimonials" element={
          <ProtectedRoute allowedRoles={adminRoles}>
            <Testimonials />
          </ProtectedRoute>
        } />
        <Route path="transportation" element={
          <ProtectedRoute allowedRoles={adminRoles}>
            <Transportation />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
