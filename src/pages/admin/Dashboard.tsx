import React from "react";
import { useAuth } from "../../context/AuthContext";
import SuperAdminDashboard from "../../components/Admin/SuperAdminDashboard";
import AdminDashboard from "../../components/Admin/AdminDashboard";
import MSMEDashboard from "../../components/Admin/MSMEDashboard";
import ContributorDashboard from "../../components/Admin/ContributorDashboard";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "superadmin":
        return <SuperAdminDashboard />;
      case "admin":
        return <AdminDashboard />;
      case "msme":
        return <MSMEDashboard />;
      case "contributor":
        return <ContributorDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to Admin Panel
            </h2>
            <p className="text-gray-600 mt-2">
              Please contact administrator for access.
            </p>
          </div>
        );
    }
  };

  return renderDashboard();
};

export default Dashboard;
